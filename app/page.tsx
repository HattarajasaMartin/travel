"use client";

import { useState, useMemo, useRef } from "react";

const packages = [
  {
    id: 1, type: "flight", image: "https://res.klook.com/image/upload/fl_lossy.progressive,q_60/Mobile/City/olvu6sgb3dcdjwlcpts3.jpg", bg: "#dbeafe",
    dest: "Jakarta → Bali", sub: "Garuda Indonesia • 1.5 jam",
    tags: ["Langsung", "Bagasi 20kg", "Sarapan"], price: 850000, rating: 4.8,
  },
  {
    id: 2, type: "holiday", image: "https://balipremiumtrip.com/en/wp-content/uploads/2025/02/Tirta-Gangga-Water-Palace-.webp", bg: "#dcfce7",
    dest: "Paket Bali 4H3M", sub: "Hotel + Transport + Tour",
    tags: ["All-Inclusive", "Guide", "Snorkeling"], price: 3500000, rating: 4.9,
  },
  {
    id: 3, type: "promo", image: "https://c.pxhere.com/photos/d8/6c/eiffel_tower_sunset_landmark_architecture_seine_river_boats_barges_reflection-862291.jpg!d", bg: "#fef9c3",
    dest: "Jakarta → Paris", sub: "Emirates • 17 jam transit Dubai",
    tags: ["Promo", "1 Stop", "Bagasi 30kg"], price: 8900000, rating: 4.6,
  },
  {
    id: 4, type: "flight", image: "https://www.travelbook.de/data/uploads/2022/11/gettyimages-1284581217-1-1040x690.jpg", bg: "#dbeafe",
    dest: "Jakarta → Tokyo", sub: "ANA • 7 jam langsung",
    tags: ["Langsung", "Bagasi 23kg", "Makan"], price: 6200000, rating: 4.7,
  },
  {
    id: 5, type: "holiday", image: "https://tse2.mm.bing.net/th/id/OIP.fWIymJn9H32cmg8WASAjegHaDk?pid=Api&P=0&h=180", bg: "#dcfce7",
    dest: "Paket Lombok 3H2M", sub: "Resort + Snorkeling + Gili",
    tags: ["Semi All-In", "Sunset Tour", "Speedboat"], price: 2800000, rating: 4.5,
  },
  {
    id: 6, type: "promo", image: "https://baguiocityguide.com/wp-content/uploads/2023/03/Visit-Singapore-1600x900.jpg", bg: "#fef9c3",
    dest: "Jakarta → Singapore", sub: "Scoot • 1.5 jam",
    tags: ["Flash Sale", "Low Cost", "Kabin Only"], price: 450000, rating: 4.3,
  },
];

type Package = (typeof packages)[0];
interface ModalState {
  pkg: Package; depDate: string; retDate: string;
  pax: number; classMultiplier: number; specialReq: string;
}

const formatRupiah = (n: number) => "Rp " + n.toLocaleString("id-ID");
const badgeColor: Record<string, { bg: string; color: string }> = {
  flight:  { bg: "#dbeafe", color: "#1e40af" },
  holiday: { bg: "#dcfce7", color: "#166534" },
  promo:   { bg: "#fef9c3", color: "#854d0e" },
};
const badgeLabel: Record<string, string> = {
  flight: "Penerbangan", holiday: "Liburan", promo: "Promo",
};
const typeIcon: Record<string, string> = {
  flight: "✈️", holiday: "🏝️", promo: "🎫",
};
const starRating = (r: number) =>
  "★".repeat(Math.floor(r)) + (r % 1 >= 0.5 ? "½" : "") + "☆".repeat(5 - Math.floor(r) - (r % 1 >= 0.5 ? 1 : 0));

export default function PackagesPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort]     = useState("default");
  const [modal, setModal]   = useState<ModalState | null>(null);
  const [pkgImages, setPkgImages] = useState<Record<number, string>>({});
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const handleImageUpload = (id: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPkgImages((prev) => ({ ...prev, [id]: e.target!.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const filtered = useMemo(() => {
    let data = packages.filter((p) => {
      if (filter !== "all" && p.type !== filter) return false;
      const q = search.toLowerCase();
      return p.dest.toLowerCase().includes(q) || p.sub.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q));
    });
    if (sort === "asc")    data.sort((a, b) => a.price - b.price);
    if (sort === "desc")   data.sort((a, b) => b.price - a.price);
    if (sort === "rating") data.sort((a, b) => b.rating - a.rating);
    return data;
  }, [filter, search, sort]);

  const total = modal ? Math.round(modal.pkg.price * modal.pax * modal.classMultiplier) : 0;
  const openModal = (pkg: Package) =>
    setModal({ pkg, depDate: "", retDate: "", pax: 2, classMultiplier: 1, specialReq: "" });

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Hero ── */}
      <div style={{ background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)", padding: "3rem 2rem 2.5rem", color: "#fff" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.35)", borderRadius: 999, padding: "4px 16px", fontSize: 13, marginBottom: 16 }}>
          ✈ Paket Travel
        </span>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 600, margin: "0 0 8px" }}>
          Temukan paket perjalanan impianmu
        </h1>
        <p style={{ fontSize: 15, opacity: 0.85, margin: 0 }}>
          Pilih dari ratusan paket penerbangan &amp; liburan yang bisa kamu sesuaikan
        </p>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem" }}>

        {/* Search + Sort */}
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <input
            type="text" value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari destinasi, maskapai, atau paket..."
            style={{ flex: 1, padding: "10px 16px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 14, outline: "none", background: "#fff" }}
          />
          <select value={sort} onChange={(e) => setSort(e.target.value)}
            style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 13, background: "#fff", cursor: "pointer" }}>
            <option value="default">Urutkan</option>
            <option value="asc">Harga: Termurah</option>
            <option value="desc">Harga: Termahal</option>
            <option value="rating">Rating Tertinggi</option>
          </select>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
          {["all", "flight", "holiday", "promo"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              style={{
                padding: "7px 20px", borderRadius: 999, fontSize: 13, cursor: "pointer", border: "1px solid",
                background: filter === f ? "#2563eb" : "#fff",
                color:      filter === f ? "#fff"    : "#374151",
                borderColor: filter === f ? "#2563eb" : "#e2e8f0",
                transition: "all 0.15s",
              }}>
              {{ all: "Semua", flight: "Penerbangan", holiday: "Liburan", promo: "Promo" }[f]}
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        {filtered.length === 0 ? (
          <p style={{ textAlign: "center", color: "#9ca3af", padding: "4rem 0" }}>Tidak ada paket yang cocok.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {filtered.map((pkg) => {
              const imgSrc = pkgImages[pkg.id] || pkg.image || "";
              return (
                <div key={pkg.id}
                  style={{ background: "#fff", borderRadius: 16, border: "1px solid #f1f5f9", overflow: "hidden", transition: "transform 0.15s", cursor: "default" }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                >
                  {/* Card Image Area */}
                  <div
                    style={{ height: 150, background: pkg.bg, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", cursor: "pointer" }}
                    onClick={() => fileInputRefs.current[pkg.id]?.click()}
                    title="Klik untuk upload gambar"
                  >
                    {imgSrc ? (
                      <img src={imgSrc} alt={pkg.dest}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, color: "#94a3b8" }}>
                        <span style={{ fontSize: 36 }}>{typeIcon[pkg.type]}</span>
                        <span style={{ fontSize: 11, background: "rgba(0,0,0,0.06)", padding: "3px 10px", borderRadius: 6 }}>
                          📷 Klik untuk upload foto
                        </span>
                      </div>
                    )}

                    {/* Badge */}
                    <span style={{
                      position: "absolute", top: 10, left: 10,
                      background: badgeColor[pkg.type].bg, color: badgeColor[pkg.type].color,
                      fontSize: 11, fontWeight: 500, padding: "3px 12px", borderRadius: 999,
                    }}>
                      {badgeLabel[pkg.type]}
                    </span>

                    {/* Hidden file input */}
                    <input
                      type="file" accept="image/*"
                      style={{ display: "none" }}
                      ref={(el) => { fileInputRefs.current[pkg.id] = el; }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(pkg.id, file);
                        e.target.value = "";
                      }}
                    />
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: "16px 18px" }}>
                    <p style={{ fontWeight: 600, fontSize: 15, color: "#0f172a", margin: "0 0 3px" }}>{pkg.dest}</p>
                    <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 6px" }}>{pkg.sub}</p>
                    <p style={{ fontSize: 12, color: "#f59e0b", margin: "0 0 10px" }}>
                      {starRating(pkg.rating)}{" "}
                      <span style={{ color: "#94a3b8" }}>({pkg.rating})</span>
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                      {pkg.tags.map((t) => (
                        <span key={t} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 6, background: "#f8fafc", color: "#64748b", border: "1px solid #e2e8f0" }}>
                          {t}
                        </span>
                      ))}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <span style={{ fontSize: 18, fontWeight: 700, color: "#2563eb" }}>{formatRupiah(pkg.price)}</span>
                        <span style={{ fontSize: 12, color: "#94a3b8" }}> / orang</span>
                      </div>
                      <button onClick={() => openModal(pkg)}
                        style={{ padding: "7px 16px", borderRadius: 8, background: "#2563eb", color: "#fff", border: "none", fontSize: 13, fontWeight: 500, cursor: "pointer" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#1d4ed8")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "#2563eb")}
                      >
                        Customize
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      {modal && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 16px" }}
          onClick={(e) => e.target === e.currentTarget && setModal(null)}
        >
          <div style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 460, padding: "1.75rem", position: "relative" }}>
            <button onClick={() => setModal(null)}
              style={{ position: "absolute", top: 16, right: 18, background: "none", border: "none", fontSize: 20, color: "#94a3b8", cursor: "pointer" }}>✕</button>

            {/* Modal image preview */}
            {(pkgImages[modal.pkg.id] || modal.pkg.image) && (
              <div style={{ width: "100%", height: 140, borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
                <img src={pkgImages[modal.pkg.id] || modal.pkg.image} alt={modal.pkg.dest}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            )}

            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, margin: "0 0 4px" }}>{modal.pkg.dest}</h2>
            <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 20px" }}>{modal.pkg.sub}</p>

            {/* Date Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              {[["depDate", "Tanggal Berangkat"], ["retDate", "Tanggal Pulang"]].map(([key, label]) => (
                <div key={key}>
                  <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>{label}</label>
                  <input type="date"
                    value={modal[key as "depDate" | "retDate"]}
                    onChange={(e) => setModal({ ...modal, [key]: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13, boxSizing: "border-box" }}
                  />
                </div>
              ))}
            </div>

            {/* Pax + Class Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>Jumlah Penumpang</label>
                <input type="number" min={1} max={10} value={modal.pax}
                  onChange={(e) => setModal({ ...modal, pax: Number(e.target.value) })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13, boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>Kelas</label>
                <select value={modal.classMultiplier}
                  onChange={(e) => setModal({ ...modal, classMultiplier: Number(e.target.value) })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13, boxSizing: "border-box" }}>
                  <option value={1}>Ekonomi</option>
                  <option value={1.5}>Bisnis (+50%)</option>
                  <option value={2}>First Class (+100%)</option>
                </select>
              </div>
            </div>

            {/* Special Request */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>Permintaan Khusus</label>
              <input type="text" value={modal.specialReq}
                onChange={(e) => setModal({ ...modal, specialReq: e.target.value })}
                placeholder="Contoh: kursi dekat jendela, makanan vegan..."
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13, boxSizing: "border-box" }}
              />
            </div>

            {/* Total */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f5f9", paddingTop: 16, marginBottom: 16 }}>
              <span style={{ fontSize: 13, color: "#64748b" }}>Total harga</span>
              <span style={{ fontSize: 22, fontWeight: 700, color: "#2563eb" }}>{formatRupiah(total)}</span>
            </div>

            <button
              style={{ width: "100%", padding: "11px", borderRadius: 12, background: "#2563eb", color: "#fff", border: "none", fontSize: 14, fontWeight: 500, cursor: "pointer" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#1d4ed8")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#2563eb")}
            >
              Pesan Sekarang
            </button>
          </div>
        </div>
      )}
    </div>
  );
}