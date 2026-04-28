"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import RegisterForm from "./RegisterForm";

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

  const handleGoogle = () =>
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });

  return (
    <RegisterForm
      formData={formData}
      loading={loading}
      error={error}
      success={success}
      showPassword={showPassword}
      showConfirm={showConfirm}
      onFormChange={handleChange}
      onTogglePassword={() => setShowPassword(!showPassword)}
      onToggleConfirm={() => setShowConfirm(!showConfirm)}
      onSubmit={handleSubmit}
      onGoogle={handleGoogle}
    />
  );
}