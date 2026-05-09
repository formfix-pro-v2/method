import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// GET /api/referrals — koliko ljudi je korisnik preporučio
export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("referrals")
    .select("*")
    .eq("referrer_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const stats = {
    total: data?.length || 0,
    signedUp: data?.filter((r) => r.status === "signed_up").length || 0,
    converted: data?.filter((r) => r.status === "converted").length || 0,
    rewarded: data?.filter((r) => r.status === "rewarded").length || 0,
  };

  return NextResponse.json({ referrals: data, stats });
}

// POST /api/referrals — registruj da je korisnik došao preko referral linka
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { referral_code } = body;

  if (!referral_code) {
    return NextResponse.json({ error: "referral_code is required" }, { status: 400 });
  }

  // Nađi referrer-a po kodu (kod je VM-XXXXXXXX gde je XXXXXXXX prvih 8 karaktera user ID-ja)
  const shortId = referral_code.replace("VM-", "").toLowerCase();

  // Traži profil čiji ID počinje sa tim karakterima
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id")
    .limit(100);

  const referrer = profiles?.find((p) =>
    p.id.replace(/-/g, "").substring(0, 8).toLowerCase() === shortId.toLowerCase()
  );

  if (!referrer) {
    return NextResponse.json({ error: "Invalid referral code" }, { status: 400 });
  }

  // Ne može sam sebe da preporuči
  if (referrer.id === user.id) {
    return NextResponse.json({ error: "Cannot refer yourself" }, { status: 400 });
  }

  // Proveri da li je već referisan
  const { data: existing } = await supabase
    .from("referrals")
    .select("id")
    .eq("referred_id", user.id)
    .single();

  if (existing) {
    return NextResponse.json({ error: "Already referred" }, { status: 409 });
  }

  // Sačuvaj referral
  const { data, error } = await supabase
    .from("referrals")
    .insert({
      referrer_id: referrer.id,
      referred_id: user.id,
      referral_code,
      status: "signed_up",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ referral: data }, { status: 201 });
}
