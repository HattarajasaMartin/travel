"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import LoginForm from "./LoginForm";

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

  const handleGoogle = () =>
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/api/auth/callback` }, // ← diubah
    });

  return (
    <LoginForm
      email={email}
      password={password}
      loading={loading}
      error={error}
      showPass={showPass}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onTogglePass={() => setShowPass(!showPass)}
      onSubmit={handleLogin}
      onGoogle={handleGoogle}
    />
  );
}