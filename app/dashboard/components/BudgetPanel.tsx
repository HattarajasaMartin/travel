import { useState, useEffect } from "react";
import { BudgetBreakdown } from "../types";
import { KATEGORI_META } from "../constants";
import { formatIDR } from "../utils";

interface Props {
  budget: BudgetBreakdown | null;
  loading: boolean;
  travelers: number;
  budgetInput: string;
  inputBudgetTotal: number;
  onSaveBudget?: (updated: BudgetBreakdown) => Promise<void>;
  onTambahBudget?: (tambahan: number) => void;
}

export function BudgetPanel({ budget, loading, travelers, budgetInput, inputBudgetTotal, onSaveBudget, onTambahBudget }: Props) {
  const [editing, setEditing] = useState(false);
  const [editBudget, setEditBudget] = useState<BudgetBreakdown | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [lastSavedTotal, setLastSavedTotal] = useState<number | null>(null);

  // Fitur tambah budget
  const [showTambahBudget, setShowTambahBudget] = useState(false);
  const [tambahInput, setTambahInput] = useState("");
  const [tambahSaved, setTambahSaved] = useState(false);

  const calcTotal = (b: BudgetBreakdown | null): number => {
    if (!b) return 0;
    return (
      (b.akomodasi ?? 0) +
      (b.makanan ?? 0) +
      (b.aktivitas ?? 0) +
      (b.transportasi ?? 0) +
      (b.lainnya ?? 0)
    );
  };

  const getBudgetPercent = (amount: number, total: number) => {
    if (!total) return 0;
    return Math.round((amount / total) * 100);
  };

  useEffect(() => {
    if (budget?.totalEstimasi && budget.totalEstimasi > 0) {
      setLastSavedTotal(budget.totalEstimasi);
    }
  }, [budget?.totalEstimasi]);

  const budgetKamu = inputBudgetTotal;
  const estimasiAI = editing && editBudget
    ? calcTotal(editBudget)
    : (lastSavedTotal !== null ? lastSavedTotal : (budget?.totalEstimasi ?? 0));

  const getBudgetStatus = () => {
    if (!budgetKamu) return null;
    if (estimasiAI === 0) return null;
    const diff = budgetKamu - estimasiAI;
    const pct = Math.abs(Math.round((diff / budgetKamu) * 100));
    if (diff >= 0) return {
      ok: true, diff, pct, estimasi: estimasiAI,
      label: "Budget mencukupi", icon: "✅", barClass: "bg-emerald-500"
    };
    return {
      ok: false, diff: Math.abs(diff), pct, estimasi: estimasiAI,
      label: "Budget kurang", icon: "⚠️", barClass: "bg-red-500"
    };
  };

  const status = getBudgetStatus();

  function parseTambah(str: string): number {
    const digits = str.replace(/[^0-9]/g, "");
    return digits ? parseInt(digits, 10) : 0;
  }

  function handleTambahBudgetConfirm() {
    const nominal = parseTambah(tambahInput);
    if (!nominal || nominal <= 0) return;
    onTambahBudget?.(nominal);
    setTambahSaved(true);
    setShowTambahBudget(false);
    setTambahInput("");
    setTimeout(() => setTambahSaved(false), 3000);
  }

  function handleStartEdit() {
    // ✅ Bisa edit kapan saja, kalau budget null buat object kosong
    const base: BudgetBreakdown = budget
      ? { ...budget }
      : {
          akomodasi: 0,
          makanan: 0,
          aktivitas: 0,
          transportasi: 0,
          lainnya: 0,
          totalEstimasi: 0,
        };
    setEditBudget(base);
    setEditing(true);
    setSaveMsg(null);
  }

  function handleCancelEdit() {
    setEditing(false);
    setEditBudget(null);
    setSaveMsg(null);
  }

  function handleAmountChange(key: keyof Omit<BudgetBreakdown, "totalEstimasi">, raw: string) {
    const digits = raw.replace(/[^0-9]/g, "");
    const value = digits ? parseInt(digits, 10) : 0;
    setEditBudget((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, [key]: value };
      updated.totalEstimasi = calcTotal(updated);
      return updated;
    });
  }

  async function handleSave() {
    if (!editBudget || !onSaveBudget) return;
    setSaving(true);
    setSaveMsg(null);
    try {
      const toSave: BudgetBreakdown = {
        ...editBudget,
        totalEstimasi: calcTotal(editBudget),
      };
      await onSaveBudget(toSave);
      setLastSavedTotal(toSave.totalEstimasi);
      setSaveMsg({ ok: true, text: "✅ Budget berhasil disimpan!" });
      setEditing(false);
      setEditBudget(null);
      setTimeout(() => setSaveMsg(null), 3000);
    } catch (err) {
      console.error("handleSave error:", err);
      setSaveMsg({ ok: false, text: "❌ Gagal menyimpan, coba lagi." });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "48px 0" }}>
      <div style={{ width: 44, height: 44, borderRadius: "50%", border: "3px solid #fef3c7", borderTopColor: "#f59e0b" }} className="spin" />
      <p style={{ fontWeight: 700, color: "#334155" }}>Menghitung estimasi budget...</p>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

      {/* ✅ Header dengan tombol Edit Budget selalu tampil */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        paddingBottom: 10, borderBottom: "1px solid #f1f5f9",
      }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#334155" }}>
          💰 Budget Breakdown
        </div>
        <button
          onClick={editing ? handleCancelEdit : handleStartEdit}
          style={{
            fontSize: 11, fontWeight: 700,
            color: editing ? "#64748b" : "#0369a1",
            background: editing ? "#f1f5f9" : "#eff6ff",
            border: `1px solid ${editing ? "#e2e8f0" : "#bae6fd"}`,
            borderRadius: 8, padding: "6px 14px",
            cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            display: "flex", alignItems: "center", gap: 5,
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = editing ? "#e2e8f0" : "#dbeafe";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = editing ? "#f1f5f9" : "#eff6ff";
          }}
        >
          {editing ? "✕ Batal Edit" : "✏️ Edit Budget"}
        </button>
      </div>

      {saveMsg && (
        <div style={{
          background: saveMsg.ok ? "#f0fdf4" : "#fff1f2",
          border: `1px solid ${saveMsg.ok ? "#86efac" : "#fca5a5"}`,
          color: saveMsg.ok ? "#15803d" : "#dc2626",
          borderRadius: 12, padding: "12px 16px",
          fontSize: 13, fontWeight: 700,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          {saveMsg.text}
        </div>
      )}

      {tambahSaved && (
        <div style={{
          background: "#f0fdf4", border: "1px solid #86efac",
          color: "#15803d", borderRadius: 12, padding: "12px 16px",
          fontSize: 13, fontWeight: 700,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          ✅ Budget tambahan berhasil ditambahkan!
        </div>
      )}

      {/* ✅ Info jika belum ada budget dari AI tapi user bisa tetap edit */}
      {!budget && !editing && (
        <div style={{
          background: "linear-gradient(135deg, #fffbeb, #fef3c7)",
          border: "1px solid #fde68a",
          borderRadius: 14, padding: "20px 16px",
          display: "flex", flexDirection: "column", alignItems: "center",
          textAlign: "center", gap: 10,
        }}>
          <div style={{ fontSize: 32 }}>💰</div>
          <p style={{ fontWeight: 700, color: "#334155", fontSize: 14, margin: 0 }}>
            Budget breakdown belum tersedia
          </p>
          <p style={{ fontSize: 12, color: "#94a3b8", maxWidth: 260, lineHeight: 1.7, margin: 0 }}>
            Generate itinerary untuk estimasi otomatis, atau klik <strong>Edit Budget</strong> untuk input manual.
          </p>
        </div>
      )}

      {/* Status Bar */}
      {status && (
        <div style={{
          background: status.ok
            ? "linear-gradient(135deg, #f0fdf4, #dcfce7)"
            : "linear-gradient(135deg, #fff1f2, #ffe4e6)",
          border: `1px solid ${status.ok ? "#86efac" : "#fca5a5"}`,
          borderRadius: 14, padding: "14px 16px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 10, transition: "all 0.2s ease",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 26 }}>{status.icon}</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: 14, color: status.ok ? "#15803d" : "#dc2626" }}>
                {status.label}
              </div>
              <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                {status.ok
                  ? `Sisa Rp ${formatIDR(status.diff)} (${status.pct}%)`
                  : `Kurang Rp ${formatIDR(status.diff)} (${status.pct}%)`}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 2 }}>Estimasi total</div>
              <div style={{ fontWeight: 800, fontSize: 16, color: "#0f172a" }}>
                Rp {formatIDR(estimasiAI)}
              </div>
            </div>
            {!status.ok && !showTambahBudget && (
              <button
                onClick={() => setShowTambahBudget(true)}
                style={{
                  fontSize: 11, fontWeight: 700,
                  background: "#dc2626", color: "white",
                  border: "none", borderRadius: 8,
                  padding: "6px 12px", cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  display: "flex", alignItems: "center", gap: 5,
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#b91c1c"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#dc2626"}
              >
                ➕ Tambah Budget
              </button>
            )}
          </div>
        </div>
      )}

      {/* Form Tambah Budget */}
      {showTambahBudget && !status?.ok && (
        <div style={{
          background: "linear-gradient(135deg, #fff7ed, #ffedd5)",
          border: "1.5px solid #fdba74",
          borderRadius: 14, padding: 16,
          display: "flex", flexDirection: "column", gap: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 13, color: "#c2410c" }}>➕ Tambah Budget</div>
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
                Budget kurang Rp {formatIDR(status?.diff ?? 0)} — tambahkan dana ekstra
              </div>
            </div>
            <button
              onClick={() => { setShowTambahBudget(false); setTambahInput(""); }}
              style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#94a3b8", lineHeight: 1 }}
            >×</button>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {[status?.diff ?? 0, 500000, 1000000, 2000000]
              .filter((v, i, arr) => v > 0 && arr.indexOf(v) === i)
              .map((nominal) => (
                <button
                  key={nominal}
                  onClick={() => setTambahInput(String(nominal))}
                  style={{
                    fontSize: 11, fontWeight: 700,
                    background: parseTambah(tambahInput) === nominal ? "#fed7aa" : "#fff",
                    color: parseTambah(tambahInput) === nominal ? "#c2410c" : "#64748b",
                    border: `1.5px solid ${parseTambah(tambahInput) === nominal ? "#fb923c" : "#e2e8f0"}`,
                    borderRadius: 8, padding: "5px 10px", cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s",
                  }}
                >
                  {nominal === (status?.diff ?? 0)
                    ? `Tepat (Rp ${formatIDR(nominal)})`
                    : `Rp ${formatIDR(nominal)}`}
                </button>
              ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ position: "relative", flex: 1 }}>
              <span style={{
                position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                color: "#94a3b8", fontSize: 12, fontWeight: 600,
              }}>Rp</span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Masukkan nominal"
                value={parseTambah(tambahInput) > 0 ? formatIDR(String(parseTambah(tambahInput))) : ""}
                onChange={(e) => setTambahInput(e.target.value.replace(/[^0-9]/g, ""))}
                style={{
                  width: "100%", paddingLeft: 36, paddingRight: 12,
                  paddingTop: 9, paddingBottom: 9,
                  fontSize: 13, fontWeight: 700, color: "#0f172a",
                  border: "1.5px solid #fdba74", borderRadius: 9,
                  fontFamily: "'DM Sans', sans-serif",
                  background: "#fff", outline: "none", boxSizing: "border-box",
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = "#f97316"}
                onBlur={(e) => e.currentTarget.style.borderColor = "#fdba74"}
              />
            </div>
            <button
              onClick={handleTambahBudgetConfirm}
              disabled={parseTambah(tambahInput) <= 0}
              style={{
                fontSize: 12, fontWeight: 700, color: "white",
                background: parseTambah(tambahInput) > 0 ? "#f97316" : "#d1d5db",
                border: "none", borderRadius: 9,
                padding: "9px 16px",
                cursor: parseTambah(tambahInput) > 0 ? "pointer" : "not-allowed",
                fontFamily: "'DM Sans', sans-serif",
                whiteSpace: "nowrap", transition: "background 0.15s",
              }}
            >
              ✓ Tambahkan
            </button>
          </div>
          {parseTambah(tambahInput) > 0 && (
            <div style={{
              background: "#fff", border: "1px solid #fed7aa",
              borderRadius: 10, padding: "10px 14px",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div style={{ fontSize: 11, color: "#64748b" }}>Budget setelah ditambah</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#16a34a" }}>
                Rp {formatIDR(budgetKamu + parseTambah(tambahInput))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Budget vs Estimasi */}
      {budgetInput && (
        <div style={{ background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: 14, padding: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
            Budget vs Estimasi
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
            {[
              { label: "Budget Kamu", value: budgetKamu, color: "#0369a1", bg: "linear-gradient(135deg, #eff6ff, #dbeafe)" },
              {
                label: "Estimasi AI",
                value: estimasiAI,
                color: status?.ok ? "#15803d" : estimasiAI > 0 ? "#dc2626" : "#64748b",
                bg: status?.ok
                  ? "linear-gradient(135deg, #f0fdf4, #dcfce7)"
                  : estimasiAI > 0
                  ? "linear-gradient(135deg, #fff1f2, #ffe4e6)"
                  : "#f8fafc",
              },
            ].map((item) => (
              <div key={item.label} style={{ background: item.bg, borderRadius: 10, padding: "10px 12px", transition: "background 0.2s ease" }}>
                <div style={{ fontSize: 11, color: "#64748b", marginBottom: 3 }}>{item.label}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: item.color }}>Rp {formatIDR(item.value)}</div>
                <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>untuk {travelers} orang</div>
              </div>
            ))}
          </div>
          <div className="bar-track">
            <div
              className={`bar-fill ${status?.barClass || "bg-sky-500"}`}
              style={{
                width: `${budgetKamu > 0 ? Math.min(100, Math.round((estimasiAI / budgetKamu) * 100)) : 0}%`,
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>
      )}

      {/* ✅ Rincian per Kategori — selalu tampil, edit mode bisa kapan saja */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Rincian per Kategori
        </div>

        {/* ✅ Kalau tidak ada budget dan tidak sedang edit, tampilkan placeholder per kategori */}
        {!budget && !editing && KATEGORI_META.map((meta) => (
          <div key={meta.key} className="budget-item" style={{ opacity: 0.45 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div className={`${meta.bgClass} border ${meta.borderClass}`}
                style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>
                {meta.icon}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>{meta.label}</div>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>{meta.sublabel} · 0%</div>
              </div>
              <div style={{ marginLeft: "auto", fontSize: 13, fontWeight: 800, color: "#cbd5e1" }}>Rp 0</div>
            </div>
            <div className="bar-track"><div className={`bar-fill ${meta.barClass}`} style={{ width: "0%" }} /></div>
          </div>
        ))}

        {/* Kategori dengan data / mode edit */}
        {(budget || editing) && KATEGORI_META.map((meta) => {
          const amount = (editing
            ? editBudget?.[meta.key as keyof BudgetBreakdown]
            : budget?.[meta.key as keyof BudgetBreakdown]) ?? 0;
          const pct = getBudgetPercent(Number(amount), estimasiAI);
          return (
            <div key={meta.key} className="budget-item">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: editing ? 6 : 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div className={`${meta.bgClass} border ${meta.borderClass}`}
                    style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>
                    {meta.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>{meta.label}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>{meta.sublabel} · {pct}%</div>
                  </div>
                </div>

                {!editing && (
                  <div style={{ textAlign: "right" }}>
                    <div className={meta.colorClass} style={{ fontSize: 13, fontWeight: 800 }}>
                      Rp {formatIDR(Number(amount))}
                    </div>
                    {travelers > 1 && (
                      <div style={{ fontSize: 10, color: "#94a3b8" }}>
                        Rp {formatIDR(Math.round(Number(amount) / travelers))}/org
                      </div>
                    )}
                  </div>
                )}

                {editing && (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>Rp</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={Number(amount) === 0 ? "" : formatIDR(Number(amount))}
                        onChange={(e) => handleAmountChange(
                          meta.key as keyof Omit<BudgetBreakdown, "totalEstimasi">,
                          e.target.value
                        )}
                        placeholder="0"
                        style={{
                          width: 110, fontSize: 12, fontWeight: 700, color: "#0f172a",
                          border: "1.5px solid #bae6fd", borderRadius: 7, padding: "4px 8px",
                          textAlign: "right", fontFamily: "'DM Sans', sans-serif",
                          background: "#fff", outline: "none",
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = "#0ea5e9"}
                        onBlur={(e) => e.currentTarget.style.borderColor = "#bae6fd"}
                      />
                    </div>
                    {travelers > 1 && (
                      <div style={{ fontSize: 10, color: "#94a3b8" }}>
                        Rp {formatIDR(Math.round(Number(amount) / travelers))}/org
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="bar-track">
                <div
                  className={`bar-fill ${meta.barClass}`}
                  style={{ width: `${pct}%`, opacity: 0.85, transition: "width 0.3s ease" }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Total saat editing */}
      {editing && editBudget && (
        <div style={{
          background: "#f0f9ff", border: "1px solid #bae6fd",
          borderRadius: 12, padding: "12px 16px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ fontSize: 12, color: "#0369a1", fontWeight: 700 }}>
            Total Estimasi (otomatis)
          </div>
          <div style={{ fontSize: 15, fontWeight: 900, color: "#0369a1" }}>
            Rp {formatIDR(calcTotal(editBudget))}
          </div>
        </div>
      )}

      {/* Tombol Simpan / Batal saat editing */}
      {editing && (
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 4 }}>
          <button
            onClick={handleCancelEdit}
            disabled={saving}
            style={{
              fontSize: 12, color: "#64748b", background: "#f1f5f9",
              border: "1px solid #e2e8f0", borderRadius: 8, padding: "8px 18px",
              cursor: saving ? "not-allowed" : "pointer", fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif", opacity: saving ? 0.6 : 1,
            }}
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              fontSize: 12, color: "white",
              background: saving ? "#7dd3fc" : "#0ea5e9",
              border: "none", borderRadius: 8, padding: "8px 18px",
              cursor: saving ? "not-allowed" : "pointer", fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif",
              display: "flex", alignItems: "center", gap: 6,
              transition: "background 0.15s",
            }}
          >
            {saving ? (
              <>
                <span style={{
                  display: "inline-block", width: 12, height: 12,
                  border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "white",
                  borderRadius: "50%", animation: "spin 0.7s linear infinite",
                }} />
                Menyimpan...
              </>
            ) : "✓ Simpan Budget"}
          </button>
        </div>
      )}

      <div style={{
        background: "#fffbeb", border: "1px solid #fde68a",
        borderRadius: 12, padding: "12px 14px",
        fontSize: 12, color: "#92400e", lineHeight: 1.6,
      }}>
        ℹ️ <strong>Catatan:</strong> Estimasi ini bersifat indikatif dan dapat bervariasi.
      </div>
    </div>
  );
}