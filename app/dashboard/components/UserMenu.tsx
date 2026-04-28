"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { DayPlan, BudgetBreakdown } from "../types";

interface HistoryItem {
  id: string;
  destination: string;
  start_date: string;
  end_date: string;
  travelers: number;
  style: string;
  day_plans: DayPlan[];
  budget: BudgetBreakdown | null;
  budget_per_orang?: number; 
  extra_budget?: number;       
  created_at: string;
}

interface UserMenuProps {
  onLoadHistory: (item: HistoryItem) => void;
  onShareHistory: (item: HistoryItem) => void;
  shareToast: boolean;
}

export function UserMenu({ onLoadHistory, onShareHistory, shareToast }: UserMenuProps) {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"profile" | "history">("profile");
  const [user, setUser] = useState<{ email: string; name: string; avatar: string } | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }: { data: { user: { email?: string; user_metadata?: Record<string, string> } | null } }) => {
      if (!data.user) return;
      const meta = data.user.user_metadata ?? {};
      setUser({
        email: data.user.email ?? "",
        name: meta.full_name ?? meta.name ?? (data.user.email?.split("@")[0] ?? "User"),
        avatar: meta.avatar_url ?? meta.picture ?? "",
      });
    });
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    if (tab !== "history" || !open) return;
    setLoadingHistory(true);
    supabase
      .from("itinerary_history")
      // FIX: eksplisit select semua kolom termasuk budget_per_orang dan extra_budget
      .select("id, destination, start_date, end_date, travelers, style, day_plans, budget, budget_per_orang, extra_budget, created_at")
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data }: { data: HistoryItem[] | null }) => {
        setHistory(data ?? []);
        setLoadingHistory(false);
      });
  }, [tab, open]);

  async function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    await supabase.from("itinerary_history").delete().eq("id", id);
    setHistory((prev) => prev.filter((h) => h.id !== id));
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  function handleLoadHistory(item: HistoryItem) {
    onLoadHistory(item);
    setOpen(false);
    setTimeout(() => {
      const el = document.getElementById("itinerary-section");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  }

  if (!user) return null;

  const initials = user.name.slice(0, 2).toUpperCase();

  const dropdownStyle: React.CSSProperties = {
    position: "absolute",
    top: 42,
    right: 0,
    width: isMobile ? "calc(100vw - 32px)" : 300,
    maxWidth: isMobile ? 340 : 300,
    background: "white",
    borderRadius: 14,
    boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
    border: "1px solid #f1f5f9",
    overflow: "hidden",
    zIndex: 100,
  };

  return (
    <>
      {shareToast && (
        <div style={{
          position: "fixed",
          bottom: 28,
          left: "50%",
          transform: "translateX(-50%)",
          background: "#0f172a",
          color: "#fff",
          padding: "11px 22px",
          borderRadius: 12,
          fontSize: 13,
          fontWeight: 600,
          zIndex: 9999,
          boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontFamily: "'DM Sans', sans-serif",
          pointerEvents: "none",
          animation: "fadeInUp 0.2s ease",
        }}>
          🔗 Link berhasil disalin!
        </div>
      )}

      <div ref={menuRef} style={{ position: "relative", flexShrink: 0 }}>
        <button
          onClick={() => setOpen((v) => !v)}
          title={user.name}
          style={{
            width: 34, height: 34, borderRadius: 10,
            border: open ? "2px solid #0ea5e9" : "1.5px solid #e2e8f0",
            background: user.avatar ? "transparent" : "linear-gradient(135deg, #0369a1, #38bdf8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", overflow: "hidden", padding: 0, flexShrink: 0,
            transition: "border 0.15s",
          }}
        >
          {user.avatar
            ? <img src={user.avatar} alt={user.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <span style={{ color: "white", fontSize: 12, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>{initials}</span>
          }
        </button>

        {open && (
          <div style={dropdownStyle}>
            <div style={{ display: "flex", borderBottom: "1px solid #f1f5f9" }}>
              {(["profile", "history"] as const).map((t) => (
                <button key={t} onClick={() => setTab(t)} style={{
                  flex: 1, padding: "10px 0", border: "none", cursor: "pointer",
                  fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
                  background: tab === t ? "white" : "#fafbfc",
                  color: tab === t ? "#0ea5e9" : "#94a3b8",
                  borderBottom: tab === t ? "2px solid #0ea5e9" : "2px solid transparent",
                  transition: "all 0.15s",
                }}>
                  {t === "profile" ? "👤 Profil" : "🗺️ Riwayat"}
                </button>
              ))}
            </div>

            {tab === "profile" && (
              <div style={{ padding: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, overflow: "hidden", flexShrink: 0,
                    background: user.avatar ? "transparent" : "linear-gradient(135deg, #0369a1, #38bdf8)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {user.avatar
                      ? <img src={user.avatar} alt={user.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <span style={{ color: "white", fontSize: 16, fontWeight: 700 }}>{initials}</span>
                    }
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    width: "100%", padding: "9px 0", borderRadius: 8,
                    border: "1.5px solid #fecaca", background: "#fff5f5",
                    color: "#ef4444", fontSize: 12, fontWeight: 700,
                    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={e => { (e.currentTarget).style.background = "#fef2f2"; }}
                  onMouseLeave={e => { (e.currentTarget).style.background = "#fff5f5"; }}
                >
                  Logout
                </button>
              </div>
            )}

            {tab === "history" && (
              <div style={{ maxHeight: isMobile ? 260 : 320, overflowY: "auto" }}>
                {loadingHistory && (
                  <div style={{ padding: 24, textAlign: "center", color: "#94a3b8", fontSize: 12 }}>
                    Memuat riwayat...
                  </div>
                )}
                {!loadingHistory && history.length === 0 && (
                  <div style={{ padding: 24, textAlign: "center", color: "#94a3b8", fontSize: 12 }}>
                    Belum ada riwayat itinerary.
                  </div>
                )}
                {!loadingHistory && history.map((h) => (
                  <div
                    key={h.id}
                    onClick={() => handleLoadHistory(h)}
                    style={{
                      padding: "12px 16px", borderBottom: "1px solid #f8fafc",
                      cursor: "pointer", transition: "background 0.1s",
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#f8fafc")}
                    onMouseLeave={e => (e.currentTarget.style.background = "white")}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 12, color: "#0f172a", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        ✈️ {h.destination}
                      </div>
                      <div style={{ fontSize: 10, color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {h.start_date} → {h.end_date} · {h.travelers} orang · {h.style}
                      </div>
                      {/* FIX: tampilkan info budget di history item */}
                      <div style={{ fontSize: 10, color: "#0369a1", marginTop: 2 }}>
                        {h.budget_per_orang ? `Rp ${h.budget_per_orang.toLocaleString("id-ID")}/org` : ""}
                        {h.extra_budget && h.extra_budget > 0 ? ` + Rp ${h.extra_budget.toLocaleString("id-ID")} extra` : ""}
                      </div>
                      <div style={{ fontSize: 10, color: "#cbd5e1", marginTop: 2 }}>
                        {new Date(h.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: 8, flexShrink: 0 }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); onShareHistory(h); }}
                        title="Copy link share"
                        style={{
                          width: 28, height: 28, borderRadius: 6,
                          border: "1px solid #f1f5f9", background: "white",
                          color: "#cbd5e1", cursor: "pointer", fontSize: 13,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "all 0.15s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.color = "#0369a1"; e.currentTarget.style.borderColor = "#bae6fd"; e.currentTarget.style.background = "#eff6ff"; }}
                        onMouseLeave={e => { e.currentTarget.style.color = "#cbd5e1"; e.currentTarget.style.borderColor = "#f1f5f9"; e.currentTarget.style.background = "white"; }}
                      >
                        🔗
                      </button>

                      <button
                        onClick={(e) => handleDelete(h.id, e)}
                        title="Hapus"
                        style={{
                          width: 28, height: 28, borderRadius: 6,
                          border: "1px solid #f1f5f9", background: "white",
                          color: "#cbd5e1", cursor: "pointer", fontSize: 11,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "all 0.15s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.borderColor = "#fecaca"; }}
                        onMouseLeave={e => { e.currentTarget.style.color = "#cbd5e1"; e.currentTarget.style.borderColor = "#f1f5f9"; }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}