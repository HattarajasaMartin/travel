"use client";

import { CSS } from "./styles";
import { HERO_DESTINATIONS, KATEGORI_META } from "./constants";
import { useDashboard } from "./hooks";
import { FormFields } from "./components/FormFields";
import { DayCards } from "./components/DayCards";
import { BudgetPanel } from "./components/BudgetPanel";
import { FlyingPlane } from "./components/FlyingPlane";
import { RunningFamily } from "./components/RunningFamily";
import { HeroScene } from "./components/HeroScene";
import { UserMenu } from "./components/UserMenu";
import { formatIDR } from "./utils";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const {
    form, days, inputBudgetTotal, loading, dayPlans, budget,
    error, saveStatus, activeTab, editingDay, editBuffer, expandedDay,
    setActiveTab, setEditBuffer,
    handleChange, handleBudgetChange, handleExtraBudgetChange,
    handleTravelersChange, handleStyleChange,
    handleToggleExpand, handleStartEdit, handleSaveEdit, handleCancelEdit,
    handleExportPDF, handleGenerate,
    handleRegenerateDay, handleRemoveSession, handleAddCustomActivity,
    handleReorderDay, handleTimingChange,
    handleReorderSession,
    handleAddSession,
    handleRemoveSessionById,
    handleUpdateSession,
    handleRemoveSessionDirect,
    loadFromHistory,
    handleShareHistory,
    shareToast,
    handleSaveBudget,
    handleTambahBudget, 
  } = useDashboard();

  const dayCardsProps = {
    dayPlans, loading, saveStatus, expandedDay, editingDay, editBuffer,
    onToggleExpand: handleToggleExpand,
    onStartEdit: handleStartEdit,
    onSaveEdit: handleSaveEdit,
    onCancelEdit: handleCancelEdit,
    onEditBufferChange: setEditBuffer,
    onExportPDF: handleExportPDF,
    onRegenerateDay: handleRegenerateDay,
    onRemoveSession: handleRemoveSession,
    onAddCustomActivity: handleAddCustomActivity,
    onReorderDay: handleReorderDay,
    onTimingChange: handleTimingChange,
    onReorderSession: handleReorderSession,
    onAddSession: handleAddSession,
    onRemoveSessionById: handleRemoveSessionById,
    onUpdateSession: handleUpdateSession,
    onRemoveSessionDirect: handleRemoveSessionDirect,
  };

  const formProps = {
    form, days, loading, error,
    onFieldChange: handleChange,
    onBudgetChange: handleBudgetChange,
    onExtraBudgetChange: handleExtraBudgetChange,
    onTravelersChange: handleTravelersChange,
    onStyleChange: handleStyleChange,
    onSubmit: handleGenerate,
  };

  const budgetProps = {
    budget, loading, travelers: form.travelers,
    budgetInput: form.budget, inputBudgetTotal,
    onSaveBudget: handleSaveBudget,
    onTambahBudget: handleTambahBudget, 
  };

  return (
    <div className="min-h-screen" style={{ background: "#f0f4f8", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{CSS}</style>

      {/* PDF Print Area */}
      <div id="pdf-print-area" style={{ position: "absolute", left: "-9999px", top: 0, width: 800, padding: 32, fontFamily: "sans-serif", color: "#0f172a" }}>
        <h1 style={{ fontSize: 22, marginBottom: 4 }}>✈️ Itinerary — {form.destination}</h1>
        <div style={{ fontSize: 13, color: "#64748b", marginBottom: 24 }}>
          {form.startDate} s/d {form.endDate} · {form.travelers} orang · Style: {form.style}
          {Number(form.extraBudget) > 0 && ` · Tambahan: Rp ${formatIDR(form.extraBudget)}`}
        </div>
        {dayPlans.map((dp) => (
          <div key={dp.day} style={{ marginBottom: 20, borderBottom: "1px solid #e2e8f0", paddingBottom: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 8 }}>Hari {dp.day} — {dp.date}</div>
            {dp.sessions?.length ? dp.sessions.map((s) => (
              <div key={s.id} style={{ marginBottom: 6, fontSize: 13 }}>
                <strong>{s.icon} {s.label}:{s.time ? ` (${s.time})` : ""}</strong> {s.content || "-"}
              </div>
            )) : (
              <>
                <div style={{ marginBottom: 6, fontSize: 13 }}><strong>🌅 Pagi:</strong> {dp.pagi || "-"}</div>
                <div style={{ marginBottom: 6, fontSize: 13 }}><strong>☀️ Siang:</strong> {dp.siang || "-"}</div>
                <div style={{ marginBottom: 6, fontSize: 13 }}><strong>🌙 Malam:</strong> {dp.malam || "-"}</div>
              </>
            )}
            {dp.estimasiBiaya && (
              <div style={{ fontSize: 12, color: "#0369a1", fontWeight: 600, marginTop: 6 }}>
                💸 Estimasi: {dp.estimasiBiaya}
              </div>
            )}
          </div>
        ))}
        {budget && (
          <div style={{ marginTop: 16, padding: "12px 14px", border: "1px solid #e2e8f0", borderRadius: 10 }}>
            <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 8 }}>💰 Total: Rp {formatIDR(budget.totalEstimasi)}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, fontSize: 11 }}>
              {KATEGORI_META.map((m) => (
                <div key={m.key}>
                  <div style={{ color: "#64748b" }}>{m.icon} {m.label}</div>
                  <div style={{ fontWeight: 700 }}>Rp {formatIDR(budget[m.key as keyof typeof budget])}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navbar */}
      <nav className="nav-glass sticky top-0 z-50">
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 16px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, overflow: "hidden" }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg, #0369a1, #38bdf8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>✈️</div>
            <span className="font-display" style={{ fontSize: isMobile ? 16 : 19, fontStyle: "italic", color: "#0f172a", letterSpacing: -0.3, flexShrink: 0 }}>
              Travel<span style={{ color: "#0ea5e9" }}>.</span>
            </span>
            {!isMobile && <>
              <div style={{ width: 1, height: 28, background: "#e2e8f0", margin: "0 2px", flexShrink: 0 }} />
              <FlyingPlane />
              <div style={{ width: 1, height: 28, background: "#e2e8f0", margin: "0 2px", flexShrink: 0 }} />
              <RunningFamily />
            </>}
          </div>
          <UserMenu
            onLoadHistory={loadFromHistory}
            onShareHistory={handleShareHistory}
            shareToast={shareToast}
          />
        </div>
      </nav>

      {/* Hero */}
      <div className="hero-bg" style={{ padding: "28px 16px 36px" }}>
        <div className="hero-grid" />
        <HeroScene />
        <div style={{ maxWidth: 1180, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 16, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" as const }}>
            {HERO_DESTINATIONS.map((d) => <span key={d} className="dest-tag" style={{ flexShrink: 0 }}>{d}</span>)}
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(56,189,248,0.15)", border: "1px solid rgba(56,189,248,0.3)", borderRadius: 99, padding: "4px 12px", fontSize: 10, fontWeight: 700, color: "#7dd3fc", letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 12 }}>
            <span>✦</span> AI-Powered Travel Planner
          </div>
          <h1 className="font-display" style={{ fontSize: "clamp(22px, 6vw, 44px)", fontStyle: "italic", color: "white", letterSpacing: -0.5, lineHeight: 1.2, margin: "0 0 8px" }}>
            Rencanakan perjalanan impianmu
          </h1>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, maxWidth: 480, lineHeight: 1.6, margin: 0 }}>
            Isi detail tripmu dan biarkan AI buatkan itinerary lengkap beserta estimasi budget.
          </p>
        </div>
      </div>

      {/* Desktop */}
      {!isMobile && (
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "28px 24px 64px", display: "grid", gridTemplateColumns: "380px 1fr", gap: 24, alignItems: "start" }}>
          <FormFields {...formProps} />
          <div className="form-card" style={{ overflow: "hidden" }}>
            <div style={{ display: "flex", borderBottom: "1px solid #f1f5f9" }}>
              {[{ key: "itinerary", label: "🗺️  Itinerary" }, { key: "budget", label: "💰  Budget" }].map((tab) => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
                  style={{ flex: 1, padding: "14px", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, background: activeTab === tab.key ? "white" : "#fafbfc", color: activeTab === tab.key ? "#0ea5e9" : "#94a3b8", borderBottom: activeTab === tab.key ? "2px solid #0ea5e9" : "2px solid transparent", transition: "all 0.15s", fontFamily: "'DM Sans', sans-serif" }}>
                  {tab.label}
                  {tab.key === "budget" && budget && <span style={{ marginLeft: 8, background: "#0ea5e9", color: "white", borderRadius: 99, padding: "2px 8px", fontSize: 10, fontWeight: 700 }}>Baru</span>}
                </button>
              ))}
            </div>
            <div
              id="itinerary-section"
              className="result-scroll"
              style={{ padding: 24, minHeight: 540, overflowY: "auto", maxHeight: "calc(100vh - 260px)" }}
            >
              {activeTab === "itinerary" ? <DayCards {...dayCardsProps} /> : <BudgetPanel {...budgetProps} />}
            </div>
          </div>
        </div>
      )}

      {/* Mobile */}
      {isMobile && (
        <div style={{ padding: "16px 16px 100px" }}>
          {activeTab === "form" && <FormFields {...formProps} />}
          {activeTab === "itinerary" && (
            <div id="itinerary-section" className="form-card">
              <div className="result-scroll" style={{ padding: 16, minHeight: "60vh", overflowY: "auto" }}>
                <DayCards {...dayCardsProps} />
              </div>
            </div>
          )}
          {activeTab === "budget" && (
            <div className="form-card">
              <div className="result-scroll" style={{ padding: 16, minHeight: "60vh", overflowY: "auto" }}>
                <BudgetPanel {...budgetProps} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bottom Nav - hanya mobile */}
      {isMobile && (
        <nav className="bottom-nav">
          <button className={`bottom-tab ${activeTab === "form" ? "active" : ""}`} onClick={() => setActiveTab("form")}>
            <span className="bottom-tab-icon">📋</span><span>Form</span><span className="bottom-tab-dot" />
          </button>
          <button className={`bottom-tab ${activeTab === "itinerary" ? "active" : ""}`} onClick={() => setActiveTab("itinerary")}>
            <span className="bottom-tab-icon">🗺️</span><span>Itinerary</span><span className="bottom-tab-dot" />
          </button>
          <button className={`bottom-tab ${activeTab === "budget" ? "active" : ""}`} onClick={() => setActiveTab("budget")}>
            <span className="bottom-tab-icon" style={{ position: "relative", display: "inline-block" }}>
              💰{budget && <span style={{ position: "absolute", top: -2, right: -4, width: 8, height: 8, background: "#0ea5e9", borderRadius: "50%", border: "1.5px solid white" }} />}
            </span>
            <span>Budget</span><span className="bottom-tab-dot" />
          </button>
        </nav>
      )}
    </div>
  );
}