"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Semua field harus diisi");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Password tidak cocok");
      return;
    }

    setLoading(true);

    const { error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: { full_name: formData.fullName },
      },
    });

    if (authError) {
      if (authError.message.includes("already registered")) {
        setError("Email sudah terdaftar, silakan login");
      } else {
        setError(authError.message);
      }
      setLoading(false);
    } else {
      setSuccess("Registrasi berhasil! Cek email kamu untuk verifikasi.");
      setTimeout(() => router.push("/login"), 3000);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#06080f]">
      {/* LEFT PANEL */}
      <div className="flex-1 bg-gradient-to-br from-[#0d1f3c] via-[#06080f] to-[#0a2a1e] p-12 flex flex-col justify-between relative overflow-hidden">
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
            Start your <br />
            journey <span className="italic text-[#4dd9ac]">today</span>
          </h2>
          <p className="mt-6 text-[#7a8ea0] text-sm max-w-[320px]">
            Join thousands of travelers discovering the world's most beautiful destinations.
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
          <h1 className="font-serif text-3xl text-white">Create account</h1>
          <p className="text-[#5a6a7a] text-sm mt-1 mb-10">
            Sign up to begin your adventure
          </p>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-sm mb-6">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-4 rounded-xl text-sm mb-6">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs uppercase text-[#4a5a6a] mb-2">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                disabled={loading}
                placeholder="John Doe"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-[#4dd9ac] outline-none transition-colors text-sm"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs uppercase text-[#4a5a6a] mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                placeholder="you@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-[#4dd9ac] outline-none transition-colors text-sm"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs uppercase text-[#4a5a6a] mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-[#4dd9ac] outline-none transition-colors text-sm pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs uppercase text-[#4a5a6a] mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-[#4dd9ac] outline-none transition-colors text-sm pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showConfirm ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Tombol Register */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4dd9ac] text-black py-3 rounded-xl font-semibold disabled:opacity-50 mt-2"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

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
                options: { redirectTo: `${location.origin}/auth/callback` },
              })
            }
            className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 rounded-xl py-3 text-gray-300 hover:bg-white/10 transition-colors text-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-sm text-gray-500 mt-8">
            Already have an account?{" "}
            <Link href="/login" className="text-[#4dd9ac] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}