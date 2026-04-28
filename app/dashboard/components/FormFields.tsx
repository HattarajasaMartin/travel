import { TRAVEL_STYLES } from "../constants";
import { formatIDR } from "../utils";
import { FormState } from "../types";

interface Props {
  form: FormState;
  days: number;
  loading: boolean;
  error: string;
  onFieldChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBudgetChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExtraBudgetChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTravelersChange: (delta: number) => void;
  onStyleChange: (id: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

// Helper parse lokal agar konsisten dengan useDashboard
function parseBudget(str: string | number): number {
  if (!str) return 0;
  const digits = String(str).replace(/[^0-9]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

export function FormFields({
  form, days, loading, error,
  onFieldChange, onBudgetChange, onExtraBudgetChange,
  onTravelersChange, onStyleChange, onSubmit,
}: Props) {
  // FIX: pakai parseBudget agar konsisten
  const inputBudgetTotal = parseBudget(form.budget) * form.travelers;
  const extraTotal = parseBudget(form.extraBudget);
  const grandTotal = inputBudgetTotal + extraTotal;

  const selectedStyles = Array.isArray(form.style) ? form.style : [];
  const isSelected = (id: string) => selectedStyles.includes(id);

  return (
    <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div className="form-card">
        <div className="card-header">
          <div className="card-icon" style={{ background: "#eff6ff" }}>📍</div>
          <span className="card-title" style={{ color: "#0ea5e9" }}>Detail Perjalanan</span>
        </div>
        <div style={{ padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label className="field-label">Destinasi</label>
            <input
              type="text" name="destination" value={form.destination}
              onChange={onFieldChange} placeholder="Contoh: Bali, Tokyo, Paris"
              className="input-base"
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label className="field-label">Tanggal Mulai</label>
              <input type="date" name="startDate" value={form.startDate} onChange={onFieldChange} className="input-base" />
            </div>
            <div>
              <label className="field-label">Tanggal Selesai</label>
              <input type="date" name="endDate" value={form.endDate} onChange={onFieldChange} className="input-base" />
            </div>
          </div>
          {days > 0 && (
            <div className="days-badge">
              <span style={{ fontSize: 18 }}>🗓️</span>
              <span style={{ color: "#0369a1", fontWeight: 700, fontSize: 14 }}>{days} hari perjalanan</span>
            </div>
          )}
        </div>
      </div>

      <div className="form-card">
        <div className="card-header">
          <div className="card-icon" style={{ background: "#fefce8" }}>💰</div>
          <span className="card-title" style={{ color: "#d97706" }}>Budget & Traveler</span>
        </div>
        <div style={{ padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <label className="field-label">Budget per Orang</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: 13, fontWeight: 600 }}>Rp</span>
              <input
                type="text" inputMode="numeric"
                value={formatIDR(form.budget)} onChange={onBudgetChange}
                placeholder="5.000.000" className="input-base" style={{ paddingLeft: 40 }}
              />
            </div>
            {form.budget && form.travelers > 1 && (
              <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>
                Total: <strong style={{ color: "#475569" }}>Rp {formatIDR(inputBudgetTotal)}</strong> untuk {form.travelers} orang
              </p>
            )}
          </div>

          <div>
            <label className="field-label">
              Tambahan Budget
              <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 400, marginLeft: 6 }}>(opsional)</span>
            </label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: 13, fontWeight: 600 }}>Rp</span>
              <input
                type="text" inputMode="numeric"
                // FIX: selalu format dari parseBudget agar konsisten
                value={parseBudget(form.extraBudget) > 0 ? formatIDR(String(parseBudget(form.extraBudget))) : ""}
                onChange={onExtraBudgetChange}
                placeholder="0"
                className="input-base" style={{ paddingLeft: 40 }}
              />
            </div>
            {extraTotal > 0 && (
              <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>
                Misal: uang saku, oleh-oleh, dsb.
              </p>
            )}
          </div>

          {form.budget && (extraTotal > 0 || form.travelers > 1) && (
            <div style={{ background: "linear-gradient(135deg, #eff6ff, #dbeafe)", border: "1px solid #bae6fd", borderRadius: 12, padding: "10px 14px" }}>
              <div style={{ fontSize: 11, color: "#64748b", marginBottom: 3 }}>Total Keseluruhan Budget</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#0369a1" }}>Rp {formatIDR(grandTotal)}</div>
              {extraTotal > 0 && (
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
                  {form.travelers} orang × Rp {formatIDR(form.budget)} + Rp {formatIDR(extraTotal)} tambahan
                </div>
              )}
            </div>
          )}

          <div>
            <label className="field-label">Jumlah Traveler</label>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <button type="button" className="counter-btn" onClick={() => onTravelersChange(-1)}>−</button>
              <div style={{ textAlign: "center", minWidth: 48 }}>
                <div className="font-display" style={{ fontSize: 30, fontStyle: "italic", color: "#0f172a", lineHeight: 1 }}>{form.travelers}</div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>orang</div>
              </div>
              <button type="button" className="counter-btn" onClick={() => onTravelersChange(1)}>+</button>
              <span style={{ fontSize: 11, color: "#b0bcc8" }}>maks. 10</span>
            </div>
          </div>
        </div>
      </div>

      <div className="form-card">
        <div className="card-header">
          <div className="card-icon" style={{ background: "#fdf4ff" }}>🎯</div>
          <span className="card-title" style={{ color: "#9333ea" }}>Travel Style</span>
        </div>
        <div style={{ padding: "0 16px 16px" }}>
          <p style={{ fontSize: 11, color: "#94a3b8", marginBottom: 10 }}>
            Pilih satu atau lebih style perjalananmu
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {TRAVEL_STYLES.map((s) => {
              const active = isSelected(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onStyleChange(s.id)}
                  className={`style-card ${active ? "active" : ""}`}
                  style={{ position: "relative" }}
                >
                  {active && (
                    <span style={{
                      position: "absolute", top: 6, right: 6,
                      width: 16, height: 16, borderRadius: "50%",
                      background: "#0ea5e9", color: "white",
                      fontSize: 9, fontWeight: 800,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>✓</span>
                  )}
                  <span className="style-emoji">{s.icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: active ? "#0369a1" : "#334155" }}>
                    {s.label}
                  </span>
                  <span style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.4 }}>{s.desc}</span>
                </button>
              );
            })}
          </div>

          {selectedStyles.length > 0 && (
            <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
              {selectedStyles.map((id) => {
                const s = TRAVEL_STYLES.find((t) => t.id === id);
                if (!s) return null;
                return (
                  <span key={id} style={{
                    background: "#eff6ff", border: "1px solid #bae6fd",
                    color: "#0369a1", borderRadius: 99,
                    padding: "3px 10px", fontSize: 11, fontWeight: 600,
                    display: "flex", alignItems: "center", gap: 4,
                  }}>
                    {s.icon} {s.label}
                    <span
                      onClick={(e) => { e.stopPropagation(); onStyleChange(id); }}
                      style={{ cursor: "pointer", color: "#94a3b8", fontWeight: 700, fontSize: 12, marginLeft: 2 }}
                    >×</span>
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div style={{ background: "#fef2f2", border: "1.5px solid #fecaca", color: "#dc2626", padding: "12px 14px", borderRadius: 12, fontSize: 13, fontWeight: 500 }}>
          ⚠️ {error}
        </div>
      )}

      <div style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}>
        <button type="submit" disabled={loading} className="gen-btn">
          {loading
            ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                <span className="spin" style={{ display: "inline-block", width: 16, height: 16, border: "2.5px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%" }} />
                Sedang membuat itinerary...
              </span>
            : "✨  Generate Itinerary"}
        </button>
      </div>
    </form>
  );
}