import { DayPlan, SessionItem } from "./types";

export function formatIDR(value: string | number): string {
  const num = String(value).replace(/\D/g, "");
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

export function getDayName(dateStr: string): string {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length !== 3) return "";
  const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  return isNaN(d.getTime()) ? "" : HARI[d.getDay()];
}

export function addDays(dateStr: string, days: number): string {
  if (!dateStr) return dateStr;
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  if (isNaN(d.getTime())) return dateStr;
  d.setDate(d.getDate() + days);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function reorderDaysWithDates(plans: DayPlan[], startDate: string): DayPlan[] {
  return plans.map((dp, i) => {
    const newDate = addDays(startDate, i);
    return {
      ...dp,
      day: i + 1,
      date: newDate,
      dayName: getDayName(newDate),
    };
  });
}

// ── Random time dalam rentang jam yang wajar ─────────────────────────────────
function randomTime(hourMin: number, hourMax: number): string {
  const hour = Math.floor(Math.random() * (hourMax - hourMin + 1)) + hourMin;
  const minutes = [0, 15, 30, 45];
  const minute = minutes[Math.floor(Math.random() * minutes.length)];
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

// ── Buat sessions dengan waktu random per sesi ───────────────────────────────
export function makeSessions(pagi: string, siang: string, malam: string): SessionItem[] {
  const result: SessionItem[] = [];
  if (pagi)  result.push({ id: crypto.randomUUID(), label: "Pagi",  icon: "🌅", content: pagi,  time: randomTime(6, 9)   });
  if (siang) result.push({ id: crypto.randomUUID(), label: "Siang", icon: "☀️", content: siang, time: randomTime(11, 14) });
  if (malam) result.push({ id: crypto.randomUUID(), label: "Malam", icon: "🌙", content: malam, time: randomTime(18, 21) });
  return result;
}

export function parseItineraryToDays(text: string): DayPlan[] {
  const days: DayPlan[] = [];
  const dayBlocks = text.split(/(?=\*?\*?Hari\s+\d+)/i).filter(Boolean);
  dayBlocks.forEach((block) => {
    const headerMatch = block.match(/Hari\s+(\d+)[^\n]*/i);
    if (!headerMatch) return;
    const dayNum = parseInt(headerMatch[1]);
    const dateMatch = headerMatch[0].match(/[-–]\s*(.+)/);
    const date = dateMatch ? dateMatch[1].replace(/\*+/g, "").trim() : "";
    const extract = (label: string) => {
      const re = new RegExp(`${label}[:\\s*]*([^\\n]+)`, "i");
      const m = block.match(re);
      return m ? m[1].replace(/\*+/g, "").trim() : "";
    };
    const biayaMatch = block.match(/[Ee]stimasi\s+[Bb]iaya[:\s*]*([^\n]+)/);
    const pagi = extract("Pagi");
    const siang = extract("Siang");
    const malam = extract("Malam");
    days.push({
      day: dayNum,
      date,
      dayName: getDayName(date),
      pagi,
      siang,
      malam,
      estimasiBiaya: biayaMatch ? biayaMatch[1].replace(/\*+/g, "").trim() : "",
      sessions: makeSessions(pagi, siang, malam),
    });
  });
  return days.sort((a, b) => a.day - b.day);
}

export function calculateDayCount(startDate: string, endDate: string): number {
  if (!startDate || !endDate) return 0;
  const diff = Math.ceil(
    (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
  );
  return diff > 0 ? diff : 0;
}