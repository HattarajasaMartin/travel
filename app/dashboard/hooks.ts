import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { DayPlan, BudgetBreakdown, FormState, SaveStatus, ActiveTab, SessionItem } from "./types";
import { formatIDR, parseItineraryToDays, calculateDayCount, makeSessions, reorderDaysWithDates } from "./utils";

function parseBiaya(str: string): number {
  if (!str) return 0;
  const digits = str.replace(/[^0-9]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

function toSupabaseDate(dateStr: string): string | null {
  if (!dateStr) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function parseBudgetString(str: string): number {
  if (!str) return 0;
  const digits = str.replace(/[^0-9]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

export function useDashboard() {
  const [loading, setLoading] = useState(false);
  const [dayPlans, setDayPlans] = useState<DayPlan[]>([]);
  const [budget, setBudget] = useState<BudgetBreakdown | null>(null);
  const [error, setError] = useState("");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [activeTab, setActiveTab] = useState<ActiveTab>("form");
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [editBuffer, setEditBuffer] = useState<DayPlan | null>(null);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [shareToast, setShareToast] = useState(false);
  const [currentHistoryId, setCurrentHistoryId] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    travelers: 2,
    style: [] as string[],
    extraBudget: "",
  });

  const days = calculateDayCount(form.startDate, form.endDate);
  const inputBudgetTotal = parseBudgetString(form.budget) * form.travelers + parseBudgetString(form.extraBudget);

  const dynamicBudget: BudgetBreakdown | null = budget
    ? {
        ...budget,
        totalEstimasi: budget.totalEstimasi,
      }
    : null;

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleBudgetChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, budget: e.target.value.replace(/\./g, "") }));
  }, []);

  const handleExtraBudgetChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, extraBudget: e.target.value.replace(/\./g, "") }));
  }, []);

  const handleTravelersChange = useCallback((delta: number) => {
    setForm((prev) => ({
      ...prev,
      travelers: Math.min(10, Math.max(1, prev.travelers + delta)),
    }));
  }, []);

  const handleStyleChange = useCallback((id: string) => {
    setForm((prev) => {
      const current = Array.isArray(prev.style) ? prev.style : [];
      const already = current.includes(id);
      return {
        ...prev,
        style: already ? current.filter((s) => s !== id) : [...current, id],
      };
    });
  }, []);

  const handleToggleExpand = useCallback((day: number) => {
    setExpandedDay((prev) => (prev === day ? null : day));
  }, []);

  const handleStartEdit = useCallback((dp: DayPlan) => {
    setEditingDay(dp.day);
    setEditBuffer({
      ...dp,
      sessions: dp.sessions?.length
        ? dp.sessions
        : makeSessions(dp.pagi, dp.siang, dp.malam),
    });
    setExpandedDay(dp.day);
  }, []);

  const handleSaveEdit = useCallback(async () => {
    if (!editBuffer) return;

    const sessions = editBuffer.sessions || [];
    const getByLabel = (label: string) =>
      sessions.find((s) => s.label.toLowerCase() === label)?.content || "";

    const synced: DayPlan = {
      ...editBuffer,
      pagi: getByLabel("pagi"),
      siang: getByLabel("siang"),
      malam: getByLabel("malam"),
    };

    const updatedPlans = dayPlans.map((d) => (d.day === synced.day ? synced : d));
    setDayPlans(updatedPlans);
    setEditingDay(null);
    setEditBuffer(null);

    setSaveStatus("saving");
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setSaveStatus("failed"); return; }

      const startDate = toSupabaseDate(form.startDate);
      if (!startDate) { setSaveStatus("failed"); return; }

      const cleanText = updatedPlans
        .map((dp) =>
          `**Hari ${dp.day} - ${dp.date}**\n- Pagi: ${dp.pagi}\n- Siang: ${dp.siang}\n- Malam: ${dp.malam}\n- Estimasi biaya: ${dp.estimasiBiaya}`
        )
        .join("\n\n");

      const { error: saveError } = await supabase
        .from("itineraries")
        .update({ result: cleanText })
        .eq("user_id", user.id)
        .eq("destination", form.destination)
        .eq("start_date", startDate);

      if (saveError) console.error("handleSaveEdit error:", saveError);
      setSaveStatus(saveError ? "failed" : "saved");

      if (currentHistoryId) {
        await supabase
          .from("itinerary_history")
          .update({ day_plans: updatedPlans })
          .eq("id", currentHistoryId);
      }
    } catch (err) {
      console.error("handleSaveEdit exception:", err);
      setSaveStatus("failed");
    }
  }, [editBuffer, dayPlans, form, currentHistoryId]);

  const handleCancelEdit = useCallback(() => {
    setEditingDay(null);
    setEditBuffer(null);
  }, []);

  const handleReorderSession = useCallback((sessionId: string, direction: "up" | "down") => {
    setEditBuffer((prev) => {
      if (!prev?.sessions) return prev;
      const idx = prev.sessions.findIndex((s) => s.id === sessionId);
      if (idx === -1) return prev;
      const targetIdx = direction === "up" ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= prev.sessions.length) return prev;
      const next = [...prev.sessions];
      [next[idx], next[targetIdx]] = [next[targetIdx], next[idx]];
      return { ...prev, sessions: next };
    });
  }, []);

  const handleAddSession = useCallback((label?: string, icon?: string) => {
    setEditBuffer((prev) => {
      if (!prev) return prev;
      const newSession: SessionItem = {
        id: crypto.randomUUID(),
        label: label || "Aktivitas",
        icon: icon || "📌",
        content: "",
        time: "",
      };
      return { ...prev, sessions: [...(prev.sessions || []), newSession] };
    });
  }, []);

  const handleRemoveSessionById = useCallback((sessionId: string) => {
    setEditBuffer((prev) => {
      if (!prev?.sessions) return prev;
      return { ...prev, sessions: prev.sessions.filter((s) => s.id !== sessionId) };
    });
  }, []);

  const handleUpdateSession = useCallback((sessionId: string, patch: Partial<SessionItem>) => {
    setEditBuffer((prev) => {
      if (!prev?.sessions) return prev;
      return {
        ...prev,
        sessions: prev.sessions.map((s) => s.id === sessionId ? { ...s, ...patch } : s),
      };
    });
  }, []);

  const handleRemoveSessionDirect = useCallback((day: number, sessionId: string) => {
    setDayPlans((prev) =>
      prev.map((d) => {
        if (d.day !== day) return d;
        return { ...d, sessions: (d.sessions || []).filter((s) => s.id !== sessionId) };
      })
    );
  }, []);

  const handleRemoveSession = useCallback((sessionKey: "pagi" | "siang" | "malam") => {
    setEditBuffer((prev) => (prev ? { ...prev, [sessionKey]: "" } : prev));
  }, []);

  const handleAddCustomActivity = useCallback((sessionKey: "pagi" | "siang" | "malam") => {
    setEditBuffer((prev) => {
      if (!prev) return prev;
      const existing = prev[sessionKey];
      const placeholder = existing ? existing + "\n+ Aktivitas tambahan" : "+ Aktivitas tambahan";
      return { ...prev, [sessionKey]: placeholder };
    });
  }, []);

  const handleExportPDF = useCallback(() => {
    const printArea = document.getElementById("pdf-print-area");
    if (!printArea) return;
    const html = `
      <!DOCTYPE html><html><head><meta charset="utf-8"/>
      <title>Itinerary - ${form.destination}</title>
      <style>
        body{font-family:sans-serif;padding:32px;color:#0f172a}
        h1{font-size:22px;margin-bottom:4px}
        .meta{font-size:13px;color:#64748b;margin-bottom:24px}
        .day{margin-bottom:20px;border-bottom:1px solid #e2e8f0;padding-bottom:16px}
        .day-title{font-size:15px;font-weight:800;margin-bottom:8px}
        .session{margin-bottom:6px;font-size:13px}
        .session strong{font-weight:700}
        .biaya{font-size:12px;color:#0369a1;font-weight:600;margin-top:6px}
      </style></head>
      <body>${printArea.innerHTML}</body></html>`;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 500);
  }, [form]);

  const saveToHistory = useCallback(async (
    plans: DayPlan[],
    budgetData: BudgetBreakdown | null,
    budgetPerOrang: number,
    extraBudgetVal: number
  ) => {
    try {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;
      if (!user) return;

      const startDate = toSupabaseDate(form.startDate);
      const endDate = toSupabaseDate(form.endDate);
      if (!startDate || !endDate) return;

      const { data, error } = await supabase
        .from("itinerary_history")
        .insert({
          user_id: user.id,
          destination: form.destination,
          start_date: startDate,
          end_date: endDate,
          travelers: form.travelers,
          style: Array.isArray(form.style) ? form.style.join(", ") : form.style,
          day_plans: plans,
          budget: budgetData,
          budget_per_orang: budgetPerOrang,
          extra_budget: extraBudgetVal,
        })
        .select("id")
        .single();

      if (error) {
        console.error("saveToHistory error:", error.message);
      } else if (data?.id) {
        setCurrentHistoryId(data.id);
        console.log("saveToHistory success, id:", data.id);
      }
    } catch (err) {
      console.error("saveToHistory exception:", err);
    }
  }, [form.startDate, form.endDate, form.destination, form.travelers, form.style]);

  const loadFromHistory = useCallback((item: {
    id?: string;
    destination: string;
    start_date: string;
    end_date: string;
    travelers: number;
    style: string;
    day_plans: DayPlan[];
    budget: BudgetBreakdown | null;
    budget_per_orang?: number;
    extra_budget?: number;
  }) => {
    const budgetPerOrang = item.budget_per_orang ?? 0;
    const extraBudget = item.extra_budget ?? 0;

    setForm((prev) => ({
      ...prev,
      destination: item.destination,
      startDate: item.start_date,
      endDate: item.end_date,
      travelers: item.travelers,
      style: item.style ? item.style.split(", ") : [],
      budget: budgetPerOrang > 0 ? String(budgetPerOrang) : "",
      extraBudget: extraBudget > 0 ? String(extraBudget) : "",
    }));

    setDayPlans(item.day_plans ?? []);

    if (item.budget) {
      const recalcTotal =
        (item.budget.akomodasi ?? 0) +
        (item.budget.makanan ?? 0) +
        (item.budget.aktivitas ?? 0) +
        (item.budget.transportasi ?? 0) +
        (item.budget.lainnya ?? 0);

      setBudget({
        ...item.budget,
        totalEstimasi: recalcTotal > 0 ? recalcTotal : (item.budget.totalEstimasi ?? 0),
      });
    } else {
      setBudget(null);
    }

    if (item.id) {
      setCurrentHistoryId(item.id);
    } else {
      setCurrentHistoryId(null);
    }

    if ((item.day_plans ?? []).length > 0) setExpandedDay(1);
    setActiveTab("itinerary");
  }, []);

  const handleShareHistory = useCallback((item: {
    id?: string;
    destination: string;
    start_date: string;
    end_date: string;
    travelers: number;
    style: string;
    day_plans: DayPlan[];
    budget: BudgetBreakdown | null;
    budget_per_orang?: number;
    extra_budget?: number;
  }) => {
    try {
      const payload = {
        id: item.id,
        destination: item.destination,
        start_date: item.start_date,
        end_date: item.end_date,
        travelers: item.travelers,
        style: item.style,
        day_plans: item.day_plans,
        budget: item.budget,
        budget_per_orang: item.budget_per_orang,
        extra_budget: item.extra_budget,
      };
      const encoded = btoa(encodeURIComponent(JSON.stringify(payload)));
      const url = `${window.location.origin}/dashboard?share=${encoded}`;
      navigator.clipboard.writeText(url).then(() => {
        setShareToast(true);
        setTimeout(() => setShareToast(false), 2500);
      });
    } catch (e) {
      console.error("handleShareHistory error:", e);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const share = params.get("share");
    if (!share) return;
    try {
      const decoded = JSON.parse(decodeURIComponent(atob(share)));
      loadFromHistory(decoded);
      window.history.replaceState({}, "", "/dashboard");
    } catch (e) {
      console.error("Invalid share link", e);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSaveBudget = useCallback(async (updated: BudgetBreakdown) => {
    try {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;
      if (!user) {
        console.error("handleSaveBudget: user not found");
        throw new Error("User not found");
      }

      const toSave: BudgetBreakdown = {
        ...updated,
        totalEstimasi:
          (updated.akomodasi ?? 0) +
          (updated.makanan ?? 0) +
          (updated.aktivitas ?? 0) +
          (updated.transportasi ?? 0) +
          (updated.lainnya ?? 0),
      };

      if (currentHistoryId) {
        const { error: err1 } = await supabase
          .from("itinerary_history")
          .update({ budget: toSave })
          .eq("id", currentHistoryId);
        if (err1) console.error("handleSaveBudget itinerary_history error:", err1);
      } else {
        const startDate = toSupabaseDate(form.startDate);
        if (startDate) {
          const { error: err1 } = await supabase
            .from("itinerary_history")
            .update({ budget: toSave })
            .eq("user_id", user.id)
            .eq("destination", form.destination)
            .eq("start_date", startDate)
            .order("created_at", { ascending: false })
            .limit(1);
          if (err1) console.error("handleSaveBudget fallback error:", err1);
        }
      }

      const startDate = toSupabaseDate(form.startDate);
      if (startDate) {
        const { error: err2 } = await supabase
          .from("itineraries")
          .update({ budget_breakdown: toSave })
          .eq("user_id", user.id)
          .eq("destination", form.destination)
          .eq("start_date", startDate);
        if (err2) console.error("handleSaveBudget itineraries error:", err2);
      }

      setBudget(toSave);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (err) {
      console.error("handleSaveBudget exception:", err);
      setSaveStatus("failed");
      throw err;
    }
  }, [currentHistoryId, form.startDate, form.destination]);

  //  handleTambahBudget — update state + simpan ke database
  const handleTambahBudget = useCallback(async (tambahan: number) => {
    // 1. Hitung nilai baru dulu sebelum setState (karena setState async)
    const currentExtra = parseBudgetString(form.extraBudget);
    const newExtra = currentExtra + tambahan;

    // 2. Update form state untuk UI reaktif
    setForm((prev) => ({
      ...prev,
      extraBudget: String(newExtra),
    }));

    // 3. Simpan ke database
    try {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;
      if (!user) return;

      // Update itinerary_history
      if (currentHistoryId) {
        const { error: err1 } = await supabase
          .from("itinerary_history")
          .update({ extra_budget: newExtra })
          .eq("id", currentHistoryId);
        if (err1) console.error("handleTambahBudget history error:", err1);
        else console.log("handleTambahBudget history saved, newExtra:", newExtra);
      } else {
        console.warn("handleTambahBudget: tidak ada currentHistoryId");
      }

      // Update itineraries
      const startDate = toSupabaseDate(form.startDate);
      if (startDate) {
        const { error: err2 } = await supabase
          .from("itineraries")
          .update({ extra_budget: newExtra })
          .eq("user_id", user.id)
          .eq("destination", form.destination)
          .eq("start_date", startDate);
        if (err2) console.error("handleTambahBudget itineraries error:", err2);
        else console.log("handleTambahBudget itineraries saved, newExtra:", newExtra);
      }
    } catch (err) {
      console.error("handleTambahBudget exception:", err);
    }
  }, [form.extraBudget, form.startDate, form.destination, currentHistoryId]);

  const handleGenerate = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setDayPlans([]);
    setBudget(null);
    setSaveStatus("idle");
    setExpandedDay(null);
    setEditingDay(null);
    setEditBuffer(null);
    setCurrentHistoryId(null);

    const d = calculateDayCount(form.startDate, form.endDate);
    if (!form.destination) { setError("Destinasi harus diisi"); return; }
    if (!form.startDate || !form.endDate) { setError("Tanggal harus diisi"); return; }
    if (d <= 0) { setError("End date harus setelah start date"); return; }
    if (!form.budget) { setError("Budget harus diisi"); return; }
    if (!Array.isArray(form.style) || form.style.length === 0) {
      setError("Pilih travel style terlebih dahulu");
      return;
    }

    setLoading(true);
    setActiveTab("itinerary");

    const styleText = form.style.join(", ");
    const budgetPerOrang = parseBudgetString(form.budget);
    const extraBudgetVal = parseBudgetString(form.extraBudget);
    const totalBudget = budgetPerOrang * form.travelers + extraBudgetVal;

    const prompt = `Kamu adalah travel planner expert. Buatkan itinerary perjalanan yang detail dengan informasi berikut:
- Destinasi: ${form.destination}
- Tanggal: ${form.startDate} sampai ${form.endDate} (${d} hari)
- Budget per orang: Rp ${formatIDR(budgetPerOrang)}
- Jumlah traveler: ${form.travelers} orang
- Total budget: Rp ${formatIDR(totalBudget)}${extraBudgetVal > 0 ? `\n- Tambahan budget: Rp ${formatIDR(extraBudgetVal)} (untuk oleh-oleh, uang saku, dll)` : ""}
- Travel style: ${styleText}

PENTING: Format itinerary HARUS PERSIS seperti ini untuk setiap hari:

**Hari 1 - ${form.startDate}**
- Pagi: [aktivitas pagi]
- Siang: [aktivitas siang]
- Malam: [aktivitas malam]
- Estimasi biaya: Rp [angka]

**Hari 2 - [tanggal]**
- Pagi: ...
(dst untuk setiap hari)

Setelah semua hari, tambahkan tips singkat dan rekomendasi akomodasi.

---

Setelah itinerary, tambahkan blok JSON berikut PERSIS seperti ini:

BUDGET_BREAKDOWN_START
{
  "akomodasi": <angka>,
  "makanan": <angka>,
  "aktivitas": <angka>,
  "transportasi": <angka>,
  "lainnya": <angka>,
  "totalEstimasi": <angka>
}
BUDGET_BREAKDOWN_END`;

    try {
      const response = await fetch("/api/itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data: { text?: string } = await response.json();
      const text: string = data.text || "";
      if (!text.trim()) throw new Error("Response kosong dari server");

      let parsedBudget: BudgetBreakdown | null = null;
      const budgetMatch = text.match(/BUDGET_BREAKDOWN_START\s*([\s\S]*?)\s*BUDGET_BREAKDOWN_END/);
      if (budgetMatch) {
        try {
          const raw = JSON.parse(budgetMatch[1]);
          parsedBudget = {
            ...raw,
            totalEstimasi:
              (raw.akomodasi ?? 0) +
              (raw.makanan ?? 0) +
              (raw.aktivitas ?? 0) +
              (raw.transportasi ?? 0) +
              (raw.lainnya ?? 0),
          };
          setBudget(parsedBudget);
        } catch {}
      }

      const cleanText = text
        .replace(/BUDGET_BREAKDOWN_START[\s\S]*?BUDGET_BREAKDOWN_END/g, "")
        .trim();
      const parsed = parseItineraryToDays(cleanText);
      setDayPlans(parsed);
      if (parsed.length > 0) setExpandedDay(1);

      await saveToHistory(parsed, parsedBudget, budgetPerOrang, extraBudgetVal);

      setSaveStatus("saving");
      try {
        const { data: authData } = await supabase.auth.getUser();
        const user = authData?.user;
        if (user) {
          const startDate = toSupabaseDate(form.startDate);
          const endDate = toSupabaseDate(form.endDate);
          if (!startDate || !endDate) { setSaveStatus("failed"); return; }

          const { error: saveError } = await supabase.from("itineraries").upsert(
            {
              user_id: user.id,
              destination: form.destination,
              start_date: startDate,
              end_date: endDate,
              budget: budgetPerOrang,
              travelers: form.travelers,
              style: styleText,
              result: cleanText,
              budget_breakdown: parsedBudget ?? null,
              extra_budget: extraBudgetVal,
            },
            { onConflict: "user_id,destination,start_date" }
          );
          if (saveError) console.error("handleGenerate upsert error:", saveError);
          setSaveStatus(saveError ? "failed" : "saved");
        }
      } catch (err) {
        console.error("handleGenerate upsert exception:", err);
        setSaveStatus("failed");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gagal generate itinerary, coba lagi.";
      setError(message);
      setActiveTab("form");
    } finally {
      setLoading(false);
    }
  }, [form, saveToHistory, loading]);

  const handleRegenerateDay = useCallback(async (day: number) => {
    const dp = dayPlans.find((d) => d.day === day);
    if (!dp) return;
    setDayPlans((prev) =>
      prev.map((d) => (d.day === day ? { ...d, _regenerating: true } : d))
    );

    const styleText = Array.isArray(form.style) ? form.style.join(", ") : form.style;
    const budgetPerOrang = parseBudgetString(form.budget);
    const extraBudgetVal = parseBudgetString(form.extraBudget);
    const totalBudget = budgetPerOrang * form.travelers + extraBudgetVal;

    const prompt = `Kamu adalah travel planner expert. Buatkan ulang itinerary untuk HANYA 1 hari ini saja:
- Destinasi: ${form.destination}
- Tanggal: ${dp.date}
- Budget per orang: Rp ${formatIDR(budgetPerOrang)}
- Jumlah traveler: ${form.travelers} orang
- Total budget: Rp ${formatIDR(totalBudget)}
- Travel style: ${styleText}

Format HARUS PERSIS seperti ini:

**Hari ${day} - ${dp.date}**
- Pagi: [aktivitas pagi]
- Siang: [aktivitas siang]
- Malam: [aktivitas malam]
- Estimasi biaya: Rp [angka]`;

    try {
      const response = await fetch("/api/itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data: { text?: string } = await response.json();
      const parsed = parseItineraryToDays(data.text || "");

      if (parsed.length > 0) {
        const updated = parsed[0];
        const updatedPlans = dayPlans.map((d) =>
          d.day === day
            ? {
                ...d,
                pagi: updated.pagi,
                siang: updated.siang,
                malam: updated.malam,
                estimasiBiaya: updated.estimasiBiaya,
                sessions: updated.sessions,
                _regenerating: false,
              }
            : d
        );
        setDayPlans(updatedPlans);
        setSaveStatus("saving");
        try {
          const { data: authData } = await supabase.auth.getUser();
          const user = authData?.user;
          if (user) {
            const startDate = toSupabaseDate(form.startDate);
            if (!startDate) { setSaveStatus("failed"); return; }
            const cleanText = updatedPlans
              .map((dp) =>
                `**Hari ${dp.day} - ${dp.date}**\n- Pagi: ${dp.pagi}\n- Siang: ${dp.siang}\n- Malam: ${dp.malam}\n- Estimasi biaya: ${dp.estimasiBiaya}`
              )
              .join("\n\n");
            const { error: saveError } = await supabase
              .from("itineraries")
              .update({ result: cleanText })
              .eq("user_id", user.id)
              .eq("destination", form.destination)
              .eq("start_date", startDate);
            if (saveError) console.error("handleRegenerateDay error:", saveError);

            if (currentHistoryId) {
              await supabase
                .from("itinerary_history")
                .update({ day_plans: updatedPlans })
                .eq("id", currentHistoryId);
            }

            setSaveStatus(saveError ? "failed" : "saved");
          }
        } catch (err) {
          console.error("handleRegenerateDay exception:", err);
          setSaveStatus("failed");
        }
      } else {
        setDayPlans((prev) =>
          prev.map((d) => (d.day === day ? { ...d, _regenerating: false } : d))
        );
      }
    } catch {
      setDayPlans((prev) =>
        prev.map((d) => (d.day === day ? { ...d, _regenerating: false } : d))
      );
    }
  }, [dayPlans, form, currentHistoryId]);

  const handleReorderDay = useCallback((dayNum: number, direction: "up" | "down") => {
    setDayPlans((prev) => {
      const idx = prev.findIndex((d) => d.day === dayNum);
      if (idx === -1) return prev;
      const targetIdx = direction === "up" ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[targetIdx]] = [next[targetIdx], next[idx]];
      const startDate = prev[0]?.date || "";
      return reorderDaysWithDates(next, startDate);
    });
  }, []);

  const handleTimingChange = useCallback((sessionKey: "pagi" | "siang" | "malam", time: string) => {
    setEditBuffer((prev) => {
      if (!prev) return prev;
      const timings = prev._timings || {};
      return { ...prev, _timings: { ...timings, [sessionKey]: time } };
    });
  }, []);

  return {
    form,
    days,
    inputBudgetTotal,
    loading,
    dayPlans,
    budget: dynamicBudget,
    error,
    saveStatus,
    activeTab,
    editingDay,
    editBuffer,
    expandedDay,
    shareToast,
    setActiveTab,
    setEditBuffer,
    handleChange,
    handleBudgetChange,
    handleExtraBudgetChange,
    handleTravelersChange,
    handleStyleChange,
    handleToggleExpand,
    handleStartEdit,
    handleSaveEdit,
    handleCancelEdit,
    handleExportPDF,
    handleGenerate,
    handleRegenerateDay,
    handleRemoveSession,
    handleAddCustomActivity,
    handleReorderDay,
    handleTimingChange,
    handleReorderSession,
    handleAddSession,
    handleRemoveSessionById,
    handleUpdateSession,
    handleRemoveSessionDirect,
    loadFromHistory,
    handleShareHistory,
    handleSaveBudget,
    handleTambahBudget, 
  };
}