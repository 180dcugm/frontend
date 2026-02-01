import { createClient } from "@/integrations/supabase/server"
import { NextResponse } from "next/server"

// --- 1. DEFINISI TYPE/INTERFACE (Agar Type-Safe) ---
interface OrderVariant {
  size: string;
  quantity: number;
  color?: string;
}

interface OrderItem {
  name: string;
  type: 'merch' | 'digital' | 'bundle';
  price: number;
  quantity?: number;
  variants?: OrderVariant[];
}

// Struktur data bersih yang siap masuk Database
interface CleanOrderData {
  transaction_id: string; 
  created_at: string;
  name: string;
  email: string;
  whatsapp: string;
  is_delivery: boolean;
  full_address: string | null;
  area: string | null;
  order_items: OrderItem[];
  total_price: number;
  payment_proof_url: string;
  refund_account: string;
  refund_number: string;
}

const TABLE_NAME = "merch_orders"
const STORAGE_BUCKET = "merch-order-2526"

export async function POST (request: Request) {
  try {
    // 1. Terima Raw JSON dari Frontend
    const rawData = await request.json();

    // 2. --- PROSES EKSTRAKSI & TRANSFORMASI ---
    const finalPaymentProofUrl = rawData.paymentProofUrl;
    const storedFileName = rawData.paymentProofFileName;

    const is_delivery = (rawData.is_delivery)
    // Cek logika Delivery (Jika address ada isinya)
    const hasAddress = rawData.fullAddress && rawData.fullAddress.trim() !== "";

    // Mapping Data ke format yang bersih
    const extractedData: CleanOrderData = {
      // Metadata
      transaction_id: `180DC-${Date.now()}`,
      created_at: new Date().toISOString(),

      // Personal Info
      name: rawData.name,
      email: rawData.email,
      whatsapp: rawData.whatsapp,
      
      // Shipping Info
      is_delivery: is_delivery,
      full_address: hasAddress ? rawData.fullAddress : null,
      area: hasAddress ? rawData.area : null,

      // Order Details (Transformasi Array Order)
      order_items: rawData.order?.map((item: any) => {
        const cleanItem: OrderItem = {
          name: item.name,
          type: item.type,
          price: item.price,
        };

        // Logika: Jika ada variant, map variant-nya. Jika tidak, ambil quantity item.
        if (item.variants && Array.isArray(item.variants) && item.variants.length > 0) {
          cleanItem.variants = item.variants.map((v: any) => ({
            size: v.size || "All Size",
            quantity: v.quantity || 1,
            color: v.color
          }));
          // Opsional: Hitung total quantity dari varian
          cleanItem.quantity = cleanItem.variants.reduce((acc, curr) => acc + curr.quantity, 0);
        } else {
          cleanItem.quantity = item.quantity || 1;
        }

        return cleanItem;
      }) || [],

      // Payment Info
      total_price: rawData.totalPrice,
      payment_proof_url: rawData.paymentProofUrl,
      refund_account: rawData.refundAccount,
      refund_number: rawData.refundNumber
    };

    console.log("✅ Data Berhasil Diekstrak:", extractedData);
    
    const supabase = createClient();
    const { error } = await supabase
      .from(TABLE_NAME)
      .insert(extractedData);

    if (error) throw error;

    console.log(storedFileName)

    if (finalPaymentProofUrl && storedFileName && finalPaymentProofUrl.includes('/temp/')) {
      try {
        const oldPath = `temp/${storedFileName}`;
        const newPath = `public/${storedFileName}`;

        console.log(`Memindahkan file dari ${oldPath} ke ${newPath}...`);

        const { error: moveError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .move(oldPath, newPath);

        if (moveError) {
          console.error("Gagal move file:", moveError.message);
        }
      } catch (moveErr) {
        console.error("Error logic move file:", moveErr);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: "Order processed successfully",
      data: extractedData,
    });

  } catch (error: any) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Error" }, 
      { status: 500 }
    );
  }
}