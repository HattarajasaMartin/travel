import { useRef, useState, useEffect } from "react";
import { DayPlan, SaveStatus, SessionItem } from "../types";

const SESSION_PRESETS = [
  { label: "Pagi", icon: "🌅" },
  { label: "Siang", icon: "☀️" },
  { label: "Malam", icon: "🌙" },
  { label: "Sore", icon: "🌆" },
  { label: "Aktivitas", icon: "📌" },
];

interface Props {
  dayPlans: DayPlan[];
  loading: boolean;
  saveStatus: SaveStatus;
  expandedDay: number | null;
  editingDay: number | null;
  editBuffer: DayPlan | null;
  onToggleExpand: (day: number) => void;
  onStartEdit: (dp: DayPlan) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onEditBufferChange: (buf: DayPlan) => void;
  onExportPDF: () => void;
  onRegenerateDay: (day: number) => void;
  onReorderDay: (day: number, direction: "up" | "down") => void;
  onReorderSession: (sessionId: string, direction: "up" | "down") => void;
  onAddSession: (label?: string, icon?: string) => void;
  onRemoveSessionById: (sessionId: string) => void;
  onUpdateSession: (sessionId: string, patch: Partial<SessionItem>) => void;
  onRemoveSessionDirect: (day: number, sessionId: string) => void;
  onRemoveSession: (sessionKey: "pagi" | "siang" | "malam") => void;
  onAddCustomActivity: (sessionKey: "pagi" | "siang" | "malam") => void;
  onTimingChange: (sessionKey: "pagi" | "siang" | "malam", time: string) => void;
}

interface SwipeCardProps {
  dp: DayPlan;
  idx: number;
  total: number;
  isExpanded: boolean;
  isEditing: boolean;
  isRegenerating: boolean;
  sessions: SessionItem[];
  editBuffer: DayPlan | null;
  onToggleExpand: (day: number) => void;
  onStartEdit: (dp: DayPlan) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onEditBufferChange: (buf: DayPlan) => void;
  onRegenerateDay: (day: number) => void;
  onReorderDay: (day: number, direction: "up" | "down") => void;
  onReorderSession: (sessionId: string, direction: "up" | "down") => void;
  onAddSession: (label?: string, icon?: string) => void;
  onRemoveSessionById: (sessionId: string) => void;
  onUpdateSession: (sessionId: string, patch: Partial<SessionItem>) => void;
  onRemoveSessionDirect: (day: number, sessionId: string) => void;
}

function SwipeCard({
  dp, idx, total, isExpanded, isEditing, isRegenerating, sessions, editBuffer,
  onToggleExpand, onStartEdit, onSaveEdit, onCancelEdit, onEditBufferChange,
  onRegenerateDay, onReorderDay, onReorderSession, onAddSession,
  onRemoveSessionById, onUpdateSession, onRemoveSessionDirect,
}: SwipeCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ idx, total, isEditing, dayNum: dp.day, onReorderDay });
  useEffect(() => {
    stateRef.current = { idx, total, isEditing, dayNum: dp.day, onReorderDay };
  });

  const [swipeDelta, setSwipeDelta] = useState(0);
  const [swiping, setSwiping] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    let startY = 0;
    let startX = 0;
    let tracking = false;
    let dominated = false;

    const onTouchStart = (e: TouchEvent) => {
      if (stateRef.current.isEditing) return;
      startY = e.touches[0].clientY;
      startX = e.touches[0].clientX;
      tracking = true;
      dominated = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!tracking || stateRef.current.isEditing) return;
      const dy = e.touches[0].clientY - startY;
      const dx = Math.abs(e.touches[0].clientX - startX);
      if (!dominated && Math.abs(dy) < 8 && dx < 8) return;
      if (!dominated) {
        if (dx > Math.abs(dy)) { tracking = false; return; }
        dominated = true;
      }
      e.preventDefault();
      e.stopPropagation();
      setSwipeDelta(Math.max(-70, Math.min(70, dy)));
      setSwiping(true);
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!tracking || !dominated || stateRef.current.isEditing) {
        tracking = false; dominated = false;
        setSwiping(false); setSwipeDelta(0);
        return;
      }
      const dy = startY - e.changedTouches[0].clientY;
      const dx = Math.abs(startX - e.changedTouches[0].clientX);
      const { idx: curIdx, total: curTotal, dayNum, onReorderDay: reorder } = stateRef.current;
      if (Math.abs(dy) >= 60 && Math.abs(dy) > dx * 1.2) {
        if (dy > 0 && curIdx > 0) reorder(dayNum, "up");
        else if (dy < 0 && curIdx < curTotal - 1) reorder(dayNum, "down");
      }
      tracking = false; dominated = false;
      setSwiping(false); setSwipeDelta(0);
    };

    const onTouchCancel = () => {
      tracking = false; dominated = false;
      setSwiping(false); setSwipeDelta(0);
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    el.addEventListener("touchcancel", onTouchCancel, { passive: true });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchCancel);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`day-card ${isEditing ? "editing" : ""}`}
      style={{
        transform: swiping ? `translateY(${swipeDelta * 0.35}px)` : "translateY(0)",
        transition: swiping ? "none" : "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        cursor: isEditing ? "default" : "grab",
        userSelect: "none",
        WebkitUserSelect: "none",
        touchAction: "pan-x",
        boxShadow:
          swiping && swipeDelta < -15 ? "0 -6px 16px rgba(3,105,161,0.2)" :
          swiping && swipeDelta > 15  ? "0 6px 16px rgba(3,105,161,0.2)" : undefined,
      }}
    >
      {/* Card Header */}
      <div className="day-card-header" onClick={() => !isEditing && onToggleExpand(dp.day)}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{ display: "flex", flexDirection: "column", gap: 3, padding: "2px 4px", opacity: 0.35, flexShrink: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 16, height: 2, borderRadius: 1, background: "#94a3b8" }} />
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 1 }} onClick={(e) => e.stopPropagation()}>
            <button
              disabled={idx === 0}
              onClick={() => onReorderDay(dp.day, "up")}
              style={{ background: "none", border: "none", cursor: idx === 0 ? "default" : "pointer", color: idx === 0 ? "#e2e8f0" : "#94a3b8", fontSize: 11, padding: "1px 3px", lineHeight: 1 }}
              title="Pindah ke atas"
            >▲</button>
            <button
              disabled={idx === total - 1}
              onClick={() => onReorderDay(dp.day, "down")}
              style={{ background: "none", border: "none", cursor: idx === total - 1 ? "default" : "pointer", color: idx === total - 1 ? "#e2e8f0" : "#94a3b8", fontSize: 11, padding: "1px 3px", lineHeight: 1 }}
              title="Pindah ke bawah"
            >▼</button>
          </div>

          <div className="day-badge">
            <span style={{ fontSize: 9, fontWeight: 800, color: "rgba(255,255,255,0.7)", letterSpacing: "0.05em", textTransform: "uppercase", lineHeight: 1 }}>HARI</span>
            <span style={{ fontSize: 17, fontWeight: 900, color: "white", lineHeight: 1.1 }}>{dp.day}</span>
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
                {dp.date || `Hari ke-${dp.day}`}
              </span>
              {dp.dayName && (
                <span style={{ fontSize: 10, fontWeight: 700, color: "#0369a1", background: "#eff6ff", border: "1px solid #bae6fd", borderRadius: 6, padding: "1px 7px", letterSpacing: "0.04em" }}>
                  {dp.dayName}
                </span>
              )}
            </div>
            {dp.estimasiBiaya && !isEditing && (
              <div style={{ fontSize: 11, color: "#0369a1", fontWeight: 600, marginTop: 1 }}>💸 {dp.estimasiBiaya}</div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }} onClick={(e) => e.stopPropagation()}>
          {!isEditing && (
            <button
              className="edit-btn"
              disabled={isRegenerating}
              onClick={() => onRegenerateDay(dp.day)}
              style={{ color: "#0369a1", background: "#eff6ff", borderColor: "#bae6fd" }}
              title="Regenerate hari ini"
            >{isRegenerating ? "⏳" : "🔄"}</button>
          )}
          {!isEditing && (
            <button className="edit-btn" onClick={() => onStartEdit(dp)}>✏️ Edit</button>
          )}
          {!isEditing && (
            <span style={{ fontSize: 16, color: "#94a3b8", transition: "transform 0.2s", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", display: "inline-block" }}>⌄</span>
          )}
        </div>
      </div>

      {/* ── VIEW MODE ── tombol hapus DIHILANGKAN di sini */}
      {isExpanded && !isEditing && (
        <>
          {isRegenerating ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "20px 16px", color: "#64748b", fontSize: 13 }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid #e0f2fe", borderTopColor: "#0ea5e9" }} className="spin" />
              Sedang regenerate hari ini...
            </div>
          ) : sessions.length > 0 ? (
            <>
              {sessions.map((s) => (
                <div key={s.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 16px", borderTop: "1px solid #f1f5f9" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{s.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</span>
                      {/* ── waktu tetap tampil, tombol hapus DIHAPUS dari view mode ── */}
                      {s.time && (
                        <span style={{ fontSize: 11, color: "#0369a1" }}>🕐 {s.time}</span>
                      )}
                    </div>
                    <div style={{ fontSize: 13, color: "#334155", lineHeight: 1.6 }}>
                      {s.content || <span style={{ color: "#cbd5e1", fontStyle: "italic" }}>Belum diisi</span>}
                    </div>
                  </div>
                </div>
              ))}
              {dp.estimasiBiaya && (
                <div style={{ padding: "8px 16px", background: "#eff6ff", borderTop: "1px solid #e0f2fe", fontSize: 12, color: "#0369a1", fontWeight: 700 }}>
                  💸 Estimasi: {dp.estimasiBiaya}
                </div>
              )}
            </>
          ) : (
            <div style={{ padding: "16px", color: "#94a3b8", fontSize: 13, fontStyle: "italic" }}>
              Belum ada aktivitas. Klik Edit untuk menambahkan.
            </div>
          )}
        </>
      )}

      {/* ── EDIT MODE ── tombol hapus tetap ada di sini */}
      {isEditing && editBuffer && (
        <div style={{ padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
          {sessions.map((s, sIdx) => (
            <div key={s.id} style={{ border: "1px solid #e2e8f0", borderRadius: 10, overflow: "hidden", background: "#fafafa" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: "#f1f5f9", borderBottom: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <button disabled={sIdx === 0} onClick={() => onReorderSession(s.id, "up")}
                    style={{ background: "none", border: "none", cursor: sIdx === 0 ? "default" : "pointer", color: sIdx === 0 ? "#e2e8f0" : "#94a3b8", fontSize: 10, padding: "0 2px", lineHeight: 1 }}>▲</button>
                  <button disabled={sIdx === sessions.length - 1} onClick={() => onReorderSession(s.id, "down")}
                    style={{ background: "none", border: "none", cursor: sIdx === sessions.length - 1 ? "default" : "pointer", color: sIdx === sessions.length - 1 ? "#e2e8f0" : "#94a3b8", fontSize: 10, padding: "0 2px", lineHeight: 1 }}>▼</button>
                </div>

                <select
                  value={s.icon}
                  onChange={(e) => onUpdateSession(s.id, { icon: e.target.value })}
                  style={{ fontSize: 16, border: "none", background: "transparent", cursor: "pointer", padding: "0 2px" }}
                >
                  {["🌅","☀️","🌆","🌙","📌","🍽️","🚶","🚗","🏖️","🏛️","🛍️","🎭","🌿","🏊","🎵","🎸"].map((em) => (
                    <option key={em} value={em}>{em}</option>
                  ))}
                </select>

                <input
                  type="text"
                  value={s.label}
                  onChange={(e) => onUpdateSession(s.id, { label: e.target.value })}
                  style={{ flex: 1, fontSize: 12, fontWeight: 700, color: "#334155", border: "none", background: "transparent", outline: "none", fontFamily: "'DM Sans', sans-serif" }}
                  placeholder="Nama sesi..."
                />

                <input
                  type="time"
                  value={s.time || ""}
                  onChange={(e) => onUpdateSession(s.id, { time: e.target.value })}
                  style={{ fontSize: 11, border: "1px solid #e2e8f0", borderRadius: 6, padding: "2px 6px", color: "#64748b", background: "#fff", fontFamily: "'DM Sans', sans-serif" }}
                />

                {/* ── Tombol hapus HANYA di edit mode ── */}
                <button
                  onClick={() => onRemoveSessionById(s.id)}
                  style={{ fontSize: 11, color: "#ef4444", background: "#fff1f2", border: "1px solid #fecaca", borderRadius: 6, padding: "2px 7px", cursor: "pointer", fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}
                >✕</button>
              </div>

              <textarea
                className="textarea-base"
                value={s.content}
                onChange={(e) => onUpdateSession(s.id, { content: e.target.value })}
                placeholder="Tulis aktivitas di sini..."
                style={{ border: "none", borderRadius: 0, background: "#fff", margin: 0 }}
              />
            </div>
          ))}

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, paddingTop: 4 }}>
            {SESSION_PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => onAddSession(p.label, p.icon)}
                style={{ fontSize: 11, color: "#0369a1", background: "#eff6ff", border: "1px solid #bae6fd", borderRadius: 6, padding: "3px 10px", cursor: "pointer", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: 4 }}
              >{p.icon} + {p.label}</button>
            ))}
            <button
              type="button"
              onClick={() => onAddSession("Custom", "📌")}
              style={{ fontSize: 11, color: "#7c3aed", background: "#faf5ff", border: "1px solid #e9d5ff", borderRadius: 6, padding: "3px 10px", cursor: "pointer", fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}
            >📌 + Custom</button>
          </div>

          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 4 }}>💸 Estimasi Biaya</label>
            <input
              type="text"
              className="input-base"
              style={{ fontSize: 13, padding: "9px 12px" }}
              value={editBuffer.estimasiBiaya}
              onChange={(e) => onEditBufferChange({ ...editBuffer, estimasiBiaya: e.target.value })}
              placeholder="Rp 500.000"
            />
          </div>

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button className="cancel-btn" onClick={onCancelEdit}>Batal</button>
            <button className="save-btn" onClick={onSaveEdit}>✓ Simpan</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main DayCards Component ───────────────────────────────────────────────────
export function DayCards({
  dayPlans, loading, saveStatus, expandedDay, editingDay, editBuffer,
  onToggleExpand, onStartEdit, onSaveEdit, onCancelEdit, onEditBufferChange,
  onExportPDF, onRegenerateDay, onReorderDay,
  onReorderSession, onAddSession, onRemoveSessionById, onUpdateSession, onRemoveSessionDirect,
}: Props) {

  if (!dayPlans.length && !loading) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "48px 0", gap: 14 }}>
      <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #eff6ff, #e0f2fe)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>🗺️</div>
      <div>
        <p style={{ fontWeight: 700, color: "#334155", marginBottom: 6, fontSize: 15 }}>Itinerary belum dibuat</p>
        <p style={{ fontSize: 13, color: "#94a3b8", maxWidth: 240, lineHeight: 1.7, margin: "0 auto" }}>Isi form dan klik Generate Itinerary untuk memulai.</p>
      </div>
    </div>
  );

  if (loading) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "48px 0" }}>
      <div style={{ width: 44, height: 44, borderRadius: "50%", border: "3px solid #e0f2fe", borderTopColor: "#0ea5e9" }} className="spin" />
      <div style={{ textAlign: "center" }}>
        <p style={{ fontWeight: 700, color: "#334155", marginBottom: 4 }}>AI sedang merencanakan tripmu...</p>
        <p style={{ fontSize: 13, color: "#94a3b8" }}>Ini mungkin butuh beberapa detik</p>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 12 }}>
          {saveStatus === "saving" && <span style={{ color: "#94a3b8" }}>⏳ Menyimpan...</span>}
          {saveStatus === "saved"  && <span style={{ color: "#16a34a" }}>✅ Tersimpan</span>}
          {saveStatus === "failed" && <span style={{ color: "#dc2626" }}>❌ Gagal simpan</span>}
        </div>
        <button onClick={onExportPDF} style={{ fontSize: 12, color: "#7c3aed", background: "#faf5ff", border: "1px solid #e9d5ff", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: 6 }}>
          <span>📄</span> Export PDF
        </button>
      </div>

      <div style={{ fontSize: 11, color: "#b0bcc8", marginBottom: 10, display: "flex", alignItems: "center", gap: 4 }}>
        <span>↕</span>
        <span>Swipe kartu ke atas/bawah untuk ubah urutan hari (mobile) atau gunakan ▲▼</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {dayPlans.map((dp, idx) => {
          const isExpanded = expandedDay === dp.day;
          const isEditing = editingDay === dp.day;
          const isRegenerating = !!dp._regenerating;
          const sessions: SessionItem[] = (isEditing ? editBuffer?.sessions : dp.sessions) || [];

          return (
            <SwipeCard
              key={dp.day}
              dp={dp}
              idx={idx}
              total={dayPlans.length}
              isExpanded={isExpanded}
              isEditing={isEditing}
              isRegenerating={isRegenerating}
              sessions={sessions}
              editBuffer={editBuffer}
              onToggleExpand={onToggleExpand}
              onStartEdit={onStartEdit}
              onSaveEdit={onSaveEdit}
              onCancelEdit={onCancelEdit}
              onEditBufferChange={onEditBufferChange}
              onRegenerateDay={onRegenerateDay}
              onReorderDay={onReorderDay}
              onReorderSession={onReorderSession}
              onAddSession={onAddSession}
              onRemoveSessionById={onRemoveSessionById}
              onUpdateSession={onUpdateSession}
              onRemoveSessionDirect={onRemoveSessionDirect}
            />
          );
        })}
      </div>
    </div>
  );
}