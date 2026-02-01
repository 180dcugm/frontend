import { createClient } from "@/integrations/supabase/server";
import { NextResponse } from "next/server";

// 1. PENTING: Paksa route ini agar tidak di-cache oleh Next.js
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  console.log("➡️ [API Start] Receipt endpoint hit");

  const { searchParams } = new URL(request.url);
  const transactionId = searchParams.get("id");

  console.log("🔍 [API Debug] Transaction ID received:", transactionId);

  if (!transactionId) {
    console.error("❌ [API Error] No Transaction ID");
    return NextResponse.json({ error: "Transaction ID required" }, { status: 400 });
  }

  try {
    // Inisialisasi client
    const supabase = createClient();
    console.log("✅ [API Debug] Supabase client initialized");

    // Query Database
    // Note: Pastikan tabel 'merch_orders' memiliki Policy (RLS) yang mengizinkan 'public' untuk SELECT
    // atau gunakan supabase service role jika data ini sangat rahasia tapi ingin diakses guest.
    const { data, error } = await supabase
      .from("merch_orders")
      .select("*")
      .eq("transaction_id", transactionId)
      .single();

    if (error) {
      console.error("❌ [API Supabase Error]:", error.message, error.details);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      console.error("⚠️ [API Warning] Data is null/empty for ID:", transactionId);
      return NextResponse.json({ error: "Receipt not found" }, { status: 404 });
    }

    console.log("✅ [API Success] Data found for:", data.name || "Unknown Name");
    
    // Return data
    return NextResponse.json({ success: true, data });

  } catch (error: any) {
    console.error("🔥 [API Critical Error]:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}