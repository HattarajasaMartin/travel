import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email dan password harus diisi" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseServer.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ error: "Email atau password salah" }, { status: 401 });
  }

  return NextResponse.json(
    { message: "Login berhasil!", user: data.user, session: data.session },
    { status: 200 }
  );
}