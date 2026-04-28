export interface Activity {
  id: string;
  time?: string;
  session: "pagi" | "siang" | "malam" | "custom";
  title: string;
  notes?: string;
}

export interface SessionItem {
  id: string;
  label: string;
  icon: string;
  content: string;
  time?: string;
}

export interface DayPlan {
  day: number;
  date: string;
  dayName?: string;
  pagi: string;
  siang: string;
  malam: string;
  estimasiBiaya: string;
  sessions?: SessionItem[];
  activities?: Activity[];
  _regenerating?: boolean;
  _timings?: { pagi?: string; siang?: string; malam?: string };
}

export interface BudgetBreakdown {
  akomodasi: number;
  makanan: number;
  aktivitas: number;
  transportasi: number;
  lainnya: number;
  totalEstimasi: number;
}

export interface FormState {
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  travelers: number;
  style: string[];   
  extraBudget: string;
}

export type SaveStatus = "idle" | "saving" | "saved" | "failed";
export type ActiveTab = "form" | "itinerary" | "budget";