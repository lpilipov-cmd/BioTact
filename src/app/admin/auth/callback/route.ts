import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";

function recoveryFailureUrl(request: NextRequest) {
  return new URL("/admin/forgot-password?status=invalid", request.url);
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(recoveryFailureUrl(request));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(recoveryFailureUrl(request));
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    await supabase.auth.signOut();
    return NextResponse.redirect(recoveryFailureUrl(request));
  }

  const { data: profile, error: profileError } = await supabase
    .from("admin_profiles")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    await supabase.auth.signOut();
    return NextResponse.redirect(recoveryFailureUrl(request));
  }

  return NextResponse.redirect(new URL("/admin/reset-password", request.url));
}
