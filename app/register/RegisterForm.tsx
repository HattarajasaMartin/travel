"use client";

import Link from "next/link";

interface RegisterFormProps {
  formData: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  loading: boolean;
  error: string;
  success: string;
  showPassword: boolean;
  showConfirm: boolean;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTogglePassword: () => void;
  onToggleConfirm: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onGoogle: () => void;
}

export default function RegisterForm({
  formData, loading, error, success,
  showPassword, showConfirm,
  onFormChange, onTogglePassword, onToggleConfirm, onSubmit, onGoogle,
}: RegisterFormProps) {
  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex flex-1 bg-[#0ea5e9] p-10 flex-col justify-between relative overflow-hidden">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 440 560"
          preserveAspectRatio="xMidYMid slice"
        >
          <circle cx="380" cy="-30" r="180" fill="rgba(255,255,255,0.1)" />
          <circle cx="380" cy="-30" r="130" fill="rgba(255,255,255,0.08)" />
          <circle cx="220" cy="280" r="190" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
          <ellipse cx="220" cy="280" rx="65" ry="190" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
          <ellipse cx="220" cy="280" rx="130" ry="190" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
          <ellipse cx="220" cy="280" rx="190" ry="65" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
          <ellipse
            cx="220" cy="280" rx="215" ry="52"
            fill="none"
            stroke="rgba(110,231,183,0.7)"
            strokeWidth="1.2"
            strokeDasharray="5 7"
            style={{ transformOrigin: "220px 280px", animation: "spin-slow 35s linear infinite" }}
          />
          <path d="M168,218 L192,211 L208,222 L202,240 L186,244 L168,235 Z" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" />
          <path d="M242,196 L264,191 L276,206 L268,222 L250,225 L238,216 Z" fill="rgba(110,231,183,0.4)" stroke="rgba(110,231,183,0.7)" strokeWidth="0.8" />
          <path d="M208,265 L232,260 L242,276 L226,290 L208,282 Z" fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" />
          <path d="M264,254 L286,250 L298,266 L292,282 L270,286 L256,275 Z" fill="rgba(110,231,183,0.35)" stroke="rgba(110,231,183,0.6)" strokeWidth="0.8" />
          <circle cx="38" cy="45" r="2" fill="#FFE566" style={{ animation: "twinkle 2.1s ease-in-out infinite" }} />
          <circle cx="410" cy="65" r="1.8" fill="white" style={{ animation: "twinkle 2.8s ease-in-out infinite", animationDelay: "0.5s" }} />
          <circle cx="430" cy="320" r="1.5" fill="#FFE566" style={{ animation: "twinkle 2s ease-in-out infinite", animationDelay: "1s" }} />
          <circle cx="45" cy="420" r="2" fill="white" style={{ animation: "twinkle 3s ease-in-out infinite", animationDelay: "0.3s" }} />
          <circle cx="50" cy="200" r="1.5" fill="#FFE566" style={{ animation: "twinkle 2.5s ease-in-out infinite", animationDelay: "0.8s" }} />
          <path d="M0,450 Q110,428 220,445 Q330,465 440,445 L440,560 L0,560 Z" fill="rgba(255,255,255,0.12)" />
          <path d="M0,480 Q110,465 220,478 Q330,492 440,478 L440,560 L0,560 Z" fill="rgba(255,255,255,0.07)" />
        </svg>

        {/* Brand */}
        <div className="flex items-center gap-2 z-10">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="#6ee7b7" />
          </svg>
          <span className="font-serif text-3xl font-bold text-white tracking-wide">
            Travel<span className="text-[#6ee7b7]">.</span>
          </span>
        </div>

        {/* Hero */}
        <div className="z-10">
          <h2 className="font-serif text-6xl font-bold text-white leading-[1.1]">
            Start your<br />journey{" "}
            <em className="text-[#6ee7b7] not-italic">today</em>
          </h2>
          <p className="mt-4 text-white/60 text-sm max-w-[280px] leading-relaxed font-light">
            Join thousands of travelers discovering the world's most beautiful destinations.
          </p>
        </div>

        {/* Chips */}
        <div className="flex gap-2 flex-wrap z-10">
          {["Paris", "Tokyo", "Bali", "New York"].map((dest, i) => (
            <span
              key={dest}
              className={`px-3 py-1 rounded-full text-xs font-medium border ${
                i === 0
                  ? "bg-[rgba(110,231,183,0.25)] border-[#6ee7b7] text-[#6ee7b7]"
                  : "bg-white/10 border-white/30 text-white/80"
              }`}
            >
              {dest}
            </span>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-[380px] flex-shrink-0 bg-white flex flex-col justify-center px-10 py-10 overflow-y-auto">
        <div className="h-1.5 rounded-full bg-gradient-to-r from-[#0ea5e9] via-[#06b6d4] to-[#34d399] mb-7" />
        <h1 className="font-serif text-3xl font-bold text-[#0a1628]">Create account</h1>
        <p className="text-[#7a8ea0] text-xs mt-1 mb-6">Sign up to begin your adventure</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-xs mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 p-3 rounded-lg text-xs mb-4">
            {success}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-[10px] font-semibold tracking-widest text-[#94a3b8] uppercase mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={onFormChange}
              disabled={loading}
              placeholder="John Doe"
              className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-4 py-2.5 text-[#0a1628] text-sm focus:border-[#0ea5e9] focus:bg-[#f0fdf9] outline-none transition-colors disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold tracking-widest text-[#94a3b8] uppercase mb-1.5">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onFormChange}
              disabled={loading}
              placeholder="you@example.com"
              className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-4 py-2.5 text-[#0a1628] text-sm focus:border-[#0ea5e9] focus:bg-[#f0fdf9] outline-none transition-colors disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold tracking-widest text-[#94a3b8] uppercase mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={onFormChange}
                disabled={loading}
                placeholder="••••••••"
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-4 py-2.5 text-[#0a1628] text-sm focus:border-[#0ea5e9] focus:bg-[#f0fdf9] outline-none transition-colors disabled:opacity-50 pr-10"
              />
              <button
                type="button"
                onClick={onTogglePassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] text-sm"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold tracking-widest text-[#94a3b8] uppercase mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={onFormChange}
                disabled={loading}
                placeholder="••••••••"
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-4 py-2.5 text-[#0a1628] text-sm focus:border-[#0ea5e9] focus:bg-[#f0fdf9] outline-none transition-colors disabled:opacity-50 pr-10"
              />
              <button
                type="button"
                onClick={onToggleConfirm}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] text-sm"
              >
                {showConfirm ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] text-white py-3 rounded-lg text-sm font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity mt-1"
          >
            {loading ? "Creating account..." : "Create Account →"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-[#e2e8f0]" />
          <span className="text-[10px] text-[#94a3b8]">OR</span>
          <div className="flex-1 h-px bg-[#e2e8f0]" />
        </div>

        <button
          type="button"
          onClick={onGoogle}
          className="w-full flex items-center justify-center gap-2 bg-white border border-[#e2e8f0] rounded-lg py-2.5 text-[#374151] text-sm hover:bg-[#f8fafc] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        <p className="text-center text-xs text-[#94a3b8] mt-5">
          Already have an account?{" "}
          <Link href="/login" className="text-[#0ea5e9] font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}