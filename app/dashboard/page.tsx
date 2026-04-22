"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const travelStyles = [
  { id: "adventure", label: "Adventure", icon: "🧗", desc: "Hiking & extreme sports" },
  { id: "relaxation", label: "Relaxation", icon: "🏖️", desc: "Beach, spa & slow travel" },
  { id: "culture", label: "Culture", icon: "🏛️", desc: "Museum & local heritage" },
  { id: "food", label: "Food", icon: "🍜", desc: "Culinary & street food" },
];




export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    travelers: 2,
    style: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const calculateDays = () => {
    if (!form.startDate || !form.endDate) return 0;
    const diff = Math.ceil(
      (new Date(form.endDate).getTime() - new Date(form.startDate).getTime()) /
      (1000 * 60 * 60 * 24)
    );
    return diff > 0 ? diff : 0;
  };

  const formatIDR = (value: string) => {
    const num = value.replace(/\D/g, "");
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, budget: e.target.value.replace(/\./g, "") });
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult("");
    const days = calculateDays();
    if (!form.destination) return setError("Destination harus diisi");
    if (!form.startDate || !form.endDate) return setError("Tanggal harus diisi");
    if (days <= 0) return setError("End date harus setelah start date");
    if (!form.budget) return setError("Budget harus diisi");
    if (!form.style) return setError("Pilih travel style terlebih dahulu");
    setLoading(true);

    const prompt = `Kamu adalah travel planner expert. Buatkan itinerary perjalanan yang detail dengan informasi berikut:
- Destinasi: ${form.destination}
- Tanggal: ${form.startDate} sampai ${form.endDate} (${days} hari)
- Budget per orang: Rp ${formatIDR(form.budget)}
- Jumlah traveler: ${form.travelers} orang
- Total budget: Rp ${formatIDR(String(Number(form.budget) * form.travelers))}
- Travel style: ${form.style}

Format itinerary per hari:
**Hari 1 - [Tanggal]**
- Pagi: ...
- Siang: ...
- Malam: ...
- Estimasi biaya: Rp ...

Sertakan tips, estimasi total pengeluaran, rekomendasi transportasi & akomodasi. Gunakan bahasa Indonesia yang santai.`;

    try {
      const response = await fetch("/api/itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      const text = data.text || "";
      setResult(text);
    } catch {
      setError("Gagal generate itinerary, coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const days = calculateDays();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f4f6fb", fontFamily: "system-ui, sans-serif" }}>

      {/* Navbar */}
      <nav style={{
        backgroundColor: "#fff",
        borderBottom: "1px solid #e8edf2",
        position: "sticky",
        top: 0,
        zIndex: 50,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 22 }}>✈️</span>
            <span style={{ fontWeight: 800, fontSize: 20, color: "#1a1a2e" }}>
              Travel<span style={{ color: "#0194f3" }}>.</span>
            </span>
          </div>
          <button
            onClick={async () => { await supabase.auth.signOut(); router.push("/login"); }}
            style={{
              fontSize: 13, color: "#666", border: "1px solid #dde1e7",
              borderRadius: 8, padding: "7px 16px", background: "none", cursor: "pointer"
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #003d99 0%, #0062cc 50%, #0194f3 100%)", color: "#fff", padding: "40px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: "4px 14px", fontSize: 12, marginBottom: 12, backdropFilter: "blur(4px)" }}>
            ✨ AI-Powered Travel Planner
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 8px", letterSpacing: -0.5 }}>
            Rencanakan perjalanan impianmu
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", margin: 0 }}>
            Isi detail tripmu dan biarkan AI buatkan itinerary terbaik secara otomatis.
          </p>
        </div>
      </div>

      {/* Main */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px", display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 24, alignItems: "start" }}>

        {/* Form */}
        <form onSubmit={handleGenerate} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Trip Details */}
          <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #edf0f5" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#0194f3", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 16 }}>
              📍 Trip Details
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6 }}>Destinasi</label>
              <input
                type="text"
                name="destination"
                value={form.destination}
                onChange={handleChange}
                placeholder="Contoh: Bali, Tokyo, Paris"
                style={{
                  width: "100%", boxSizing: "border-box", border: "1.5px solid #e2e8f0",
                  borderRadius: 10, padding: "11px 14px", fontSize: 14, color: "#1a1a2e",
                  outline: "none", transition: "border 0.2s"
                }}
                onFocus={e => e.target.style.borderColor = "#0194f3"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6 }}>Tanggal Mulai</label>
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  style={{
                    width: "100%", boxSizing: "border-box", border: "1.5px solid #e2e8f0",
                    borderRadius: 10, padding: "11px 12px", fontSize: 13, color: "#1a1a2e", outline: "none"
                  }}
                  onFocus={e => e.target.style.borderColor = "#0194f3"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6 }}>Tanggal Selesai</label>
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  style={{
                    width: "100%", boxSizing: "border-box", border: "1.5px solid #e2e8f0",
                    borderRadius: 10, padding: "11px 12px", fontSize: 13, color: "#1a1a2e", outline: "none"
                  }}
                  onFocus={e => e.target.style.borderColor = "#0194f3"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>
            </div>

            {days > 0 && (
              <div style={{ marginTop: 12, background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                <span>🗓️</span>
                <span style={{ color: "#0194f3", fontWeight: 600, fontSize: 13 }}>{days} hari perjalanan</span>
              </div>
            )}
          </div>

          {/* Budget & Travelers */}
          <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #edf0f5" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#0194f3", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 16 }}>
              💰 Budget & Travelers
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6 }}>Budget per Orang</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "#999", fontWeight: 600 }}>Rp</span>
                <input
                  type="text"
                  value={formatIDR(form.budget)}
                  onChange={handleBudgetChange}
                  placeholder="5.000.000"
                  style={{
                    width: "100%", boxSizing: "border-box", border: "1.5px solid #e2e8f0",
                    borderRadius: 10, padding: "11px 14px 11px 38px", fontSize: 14, color: "#1a1a2e", outline: "none"
                  }}
                  onFocus={e => e.target.style.borderColor = "#0194f3"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>
              {form.budget && form.travelers > 1 && (
                <p style={{ fontSize: 12, color: "#888", marginTop: 6 }}>
                  Total: <strong style={{ color: "#333" }}>Rp {formatIDR(String(Number(form.budget) * form.travelers))}</strong> untuk {form.travelers} orang
                </p>
              )}
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 10 }}>Jumlah Traveler</label>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <button type="button"
                  onClick={() => setForm({ ...form, travelers: Math.max(1, form.travelers - 1) })}
                  style={{ width: 38, height: 38, borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#fff", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#444" }}
                >−</button>
                <div style={{ textAlign: "center", minWidth: 40 }}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: "#1a1a2e" }}>{form.travelers}</div>
                  <div style={{ fontSize: 11, color: "#aaa" }}>orang</div>
                </div>
                <button type="button"
                  onClick={() => setForm({ ...form, travelers: Math.min(10, form.travelers + 1) })}
                  style={{ width: 38, height: 38, borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#fff", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#444" }}
                >+</button>
                <span style={{ fontSize: 12, color: "#aaa" }}>maks. 10 orang</span>
              </div>
            </div>
          </div>

          {/* Travel Style */}
          <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #edf0f5" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#0194f3", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 16 }}>
              🎯 Travel Style
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {travelStyles.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setForm({ ...form, style: s.id })}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4,
                    padding: "14px 14px", borderRadius: 12, cursor: "pointer", textAlign: "left",
                    border: form.style === s.id ? "2px solid #0194f3" : "1.5px solid #e2e8f0",
                    background: form.style === s.id ? "#eff6ff" : "#fafbfc",
                    transition: "all 0.15s"
                  }}
                >
                  <span style={{ fontSize: 22 }}>{s.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: form.style === s.id ? "#0194f3" : "#333" }}>{s.label}</span>
                  <span style={{ fontSize: 11, color: "#999", lineHeight: 1.4 }}>{s.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div style={{ background: "#fff5f5", border: "1px solid #fecaca", color: "#dc2626", padding: "12px 16px", borderRadius: 12, fontSize: 13 }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", background: loading ? "#93c5fd" : "linear-gradient(135deg, #0062cc, #0194f3)",
              color: "#fff", border: "none", borderRadius: 12, padding: "15px 0",
              fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 4px 14px rgba(1,148,243,0.35)", transition: "all 0.2s"
            }}
          >
            {loading ? "✨ Generating itinerary..." : "✨ Generate Itinerary"}
          </button>
        </form>

        {/* Result Panel */}
        <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #edf0f5", minHeight: 600, display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "18px 24px", borderBottom: "1px solid #f0f3f8", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: "#1a1a2e" }}>📋 Itinerary</span>
            {result && (
              <button
                onClick={() => navigator.clipboard.writeText(result)}
                style={{ fontSize: 12, color: "#0194f3", border: "1px solid #bfdbfe", borderRadius: 8, padding: "6px 14px", background: "#eff6ff", cursor: "pointer" }}
              >
                Copy 📋
              </button>
            )}
          </div>

          <div style={{ flex: 1, padding: 24 }}>
            {!result && !loading && (
              <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "60px 0", gap: 16 }}>
                <div style={{ width: 72, height: 72, background: "#eff6ff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>
                  🗺️
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: "#333", marginBottom: 6, fontSize: 15 }}>Itinerary belum dibuat</p>
                  <p style={{ fontSize: 13, color: "#aaa", maxWidth: 260, lineHeight: 1.6 }}>
                    Isi form di sebelah kiri dan klik Generate Itinerary untuk memulai.
                  </p>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  {["🗼 Paris", "🌴 Bali", "🏯 Tokyo"].map((d) => (
                    <span key={d} style={{ fontSize: 12, background: "#f4f6fb", color: "#888", padding: "5px 12px", borderRadius: 20, border: "1px solid #e8edf2" }}>{d}</span>
                  ))}
                </div>
              </div>
            )}

            {loading && (
              <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: "60px 0" }}>
                <div style={{ width: 44, height: 44, border: "4px solid #bfdbfe", borderTopColor: "#0194f3", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontWeight: 700, color: "#333", marginBottom: 4 }}>AI sedang merencanakan tripmu...</p>
                  <p style={{ fontSize: 13, color: "#aaa" }}>Ini mungkin butuh beberapa detik</p>
                </div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            )}

            {result && (
              <div style={{ fontSize: 14, lineHeight: 1.8, color: "#374151", whiteSpace: "pre-wrap" }}>
                {result}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}