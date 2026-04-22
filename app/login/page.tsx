"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      if (authError.message.includes("Invalid login credentials")) {
        setError("Email atau password salah");
      } else {
        setError("Terjadi kesalahan, coba lagi");
      }
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex bg-[#06080f]">
      {/* LEFT PANEL */}
      <div className="flex-1 bg-gradient-to-br from-[#0d1f3c] via-[#06080f] to-[#0a2a1e] p-12 flex flex-col justify-between relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(77,217,172,0.12)_0%,transparent_70%)]" />
        <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(26,90,180,0.15)_0%,transparent_70%)]" />

        {/* Brand */}
        <div className="flex items-center gap-3 z-10">
          <span className="text-4xl">✈️</span>
          <span className="font-serif text-3xl font-bold text-white">
            Travel<span className="text-[#4dd9ac]">.</span>
          </span>
        </div>

        {/* Hero */}
        <div className="z-10">
          <h2 className="font-serif text-6xl text-white leading-[1.15]">
            Explore the <br />
            world with <span className="italic text-[#4dd9ac]">style</span>
          </h2>
          <p className="mt-6 text-[#7a8ea0] text-sm max-w-[320px]">
            Discover curated destinations, seamless bookings, and unforgettable experiences.
          </p>
        </div>

        {/* Destinations */}
        <div className="flex gap-3 z-10 text-sm">
          <span className="dest-chip active">🗼 Paris</span>
          <span className="dest-chip">🏯 Tokyo</span>
          <span className="dest-chip">🌴 Bali</span>
          <span className="dest-chip">🗽 New York</span>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-[480px] bg-[#0b0d14] flex items-center justify-center p-12 border-l border-white/5">
        <div className="w-full max-w-[360px]">
          <h1 className="font-serif text-3xl text-white">Welcome back</h1>
          <p className="text-[#5a6a7a] text-sm mt-1 mb-10">
            Sign in to continue your journey
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-sm mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-xs uppercase text-[#4a5a6a] mb-2">
                Email
              </label>
              <input
                type="email"
                required
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#4dd9ac] outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs uppercase text-[#4a5a6a] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  required
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#4dd9ac] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="text-right text-xs">
              <a href="/forgot-password" className="text-[#4dd9ac]">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4dd9ac] text-black py-3 rounded-xl font-semibold disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-gray-500">OR</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Google */}
          <button
            onClick={() =>
              supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                  redirectTo: `${location.origin}/auth/callback`,
                },
              })
            }
            className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 rounded-xl py-3 text-gray-300 hover:bg-white/10"
          >
            Continue with Google
          </button>

          <p className="text-center text-sm text-gray-500 mt-8">
            Don't have an account?{" "}
            <a href="/register" className="text-[#4dd9ac]">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}