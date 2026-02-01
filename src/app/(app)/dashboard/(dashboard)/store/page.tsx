import { redirect } from "next/navigation";
import { createClient } from "@/integrations/supabase/admin";
import { AdminOrders } from "@/components/modules/admin/store/Admin";

export default async function StorePage() {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/dashboard/login");
  }

  // Check if user is admin
  const { data: adminUser, error: adminError } = await supabase
    .from("admin_users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (adminError || !adminUser) {
    redirect("/dashboard/login?error=unauthorized");
  }

  const { data: orders, error: ordersError } = await supabase
    .from("merch_orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (ordersError) {
    console.error("Error fetching store orders:", ordersError);
  }

  return <AdminOrders orders={orders || []} adminUser={adminUser} />;
}