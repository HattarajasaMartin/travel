export const TRAVEL_STYLES = [
  { id: "adventure",   label: "Adventure",   icon: "🧗", desc: "Hiking & olahraga ekstrem" },
  { id: "relaxation",  label: "Relaxation",  icon: "🏖️", desc: "Pantai, spa & slow travel" },
  { id: "culture",     label: "Culture",     icon: "🏛️", desc: "Museum & warisan budaya" },
  { id: "food",        label: "Food",        icon: "🍜", desc: "Kuliner & street food" },
];

export const KATEGORI_META = [
  { key: "akomodasi"    as const, icon: "🏨", label: "Akomodasi",          sublabel: "per malam", colorClass: "text-violet-600", bgClass: "bg-violet-50", borderClass: "border-violet-200", barClass: "bg-violet-500" },
  { key: "makanan"      as const, icon: "🍽️", label: "Makanan & Minuman",  sublabel: "per hari",  colorClass: "text-orange-500", bgClass: "bg-orange-50", borderClass: "border-orange-200", barClass: "bg-orange-400" },
  { key: "aktivitas"    as const, icon: "🎫", label: "Aktivitas & Tiket",  sublabel: "total",     colorClass: "text-teal-600",   bgClass: "bg-teal-50",   borderClass: "border-teal-200",   barClass: "bg-teal-500"   },
  { key: "transportasi" as const, icon: "🚗", label: "Transportasi Lokal", sublabel: "total",     colorClass: "text-blue-600",   bgClass: "bg-blue-50",   borderClass: "border-blue-200",   barClass: "bg-blue-500"   },
  { key: "lainnya"      as const, icon: "🛍️", label: "Lain-lain",         sublabel: "total",     colorClass: "text-rose-500",   bgClass: "bg-rose-50",   borderClass: "border-rose-200",   barClass: "bg-rose-400"   },
];

export const DAY_SESSIONS = [
  { key: "pagi"  as const, label: "Pagi",  icon: "🌅", bg: "#fffbeb", iconBg: "#fef3c7" },
  { key: "siang" as const, label: "Siang", icon: "☀️", bg: "#f0f9ff", iconBg: "#e0f2fe" },
  { key: "malam" as const, label: "Malam", icon: "🌙", bg: "#f5f3ff", iconBg: "#ede9fe" },
];

export const HERO_DESTINATIONS = ["🗼 Paris", "🌴 Bali", "🏯 Tokyo", "🗽 New York", "🏔️ Nepal"];