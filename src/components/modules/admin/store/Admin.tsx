"use client";

import { useState } from "react";
import { Button } from "@/components/elements/Form/button";
import { Input } from "@/components/elements/Form/input";
import {
  LogOut,
  Search,
  Mail,
  User,
  MapPin,
  Filter,
  Download,
  Truck,
  Store,
  ShoppingBag,
  DollarSign,
  CreditCard,
  Tag,
} from "lucide-react";
import { createClient } from "@/integrations/supabase/client";
import { useRouter } from "next/navigation";

// --- Interfaces Updated ---

// Raw Variant
interface RawVariant {
  size: string;
  quantity: number;
  color?: string;
}

// Raw Order
export interface RawOrder {
  name: string;
  type: string;
  price: number;
  quantity?: number;
  variants?: RawVariant[];
}

interface OrderData {
  transaction_id: string;
  created_at: string;
  name: string;
  email: string;
  whatsapp: string;
  is_delivery: boolean;
  full_address: string | null;
  area: string | null;
  order_items: RawOrder[];
  total_price: number;
  payment_proof_url: string;
  refund_account: string;
  refund_number: string;
}

// --- Component ---

export function AdminOrders({ orders, adminUser }: { orders: OrderData[], adminUser: any }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [selectedOrderType, setSelectedOrderType] = useState("all");
  const router = useRouter();
  const supabase = createClient();

  // Formatting Helpers
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Jakarta",
    });
  };

  // Filter Logic
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.area?.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesType = true;
    if (selectedOrderType === "delivery") matchesType = order.is_delivery === true;
    if (selectedOrderType === "pickup") matchesType = order.is_delivery === false;

    return matchesSearch && matchesType;
  });

  // Stats Calculation
  const deliveryCount = orders.filter((s) => s.is_delivery).length;
  const pickupCount = orders.filter((s) => !s.is_delivery).length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total_price || 0), 0);

  async function handleLogout() {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/dashboard/login");
  }

  // Updated CSV Export to handle Variants
  function exportToCSV() {
    const headers = [
      "Transaction ID",
      "Date",
      "Type",
      "Customer Name",
      "Email",
      "WhatsApp",
      "Address",
      "Area",
      "Items Detail", // Combined string
      "Total Price",
      "Refund Bank",
      "Refund Number",
      "Payment Proof URL",
    ];

    const csvContent = [
      headers.join(","),
      ...filteredOrders.map((order) => {
        // Logic to flatten variants into string
        // Format: "Shirt A [Size: M, Color: Red (x2) | Size: L (x1)]; Sticker B (x5)"
        const itemsString = order.order_items
          .map((item) => {
            const itemPrice = item.price ? ` @${item.price}` : "";
            
            if (item.variants && item.variants.length > 0) {
              const variantDetails = item.variants
                .map(v => `Size: ${v.size}${v.color ? `, Color: ${v.color}` : ""} (x${v.quantity})`)
                .join(" | ");
              return `${item.name} [${variantDetails}]${itemPrice}`;
            }
            
            return `${item.name} (x${item.quantity || 1})${itemPrice}`;
          })
          .join("; ")
          .replace(/"/g, '""'); // Escape double quotes

        return [
          `"${order.transaction_id}"`,
          `"${formatDate(order.created_at)}"`,
          order.is_delivery ? "Delivery" : "Pickup",
          `"${order.name}"`,
          `"${order.email}"`,
          `"${order.whatsapp}"`,
          `"${order.full_address || "-"}"`,
          `"${order.area || "-"}"`,
          `"${itemsString}"`,
          `"${order.total_price}"`,
          `"${order.refund_account || "-"}"`,
          `"${order.refund_number || "-"}"`,
          `"${order.payment_proof_url || ""}"`,
        ].join(",");
      }),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  return (
    <section className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-20">
        {/* Header */}
        <div className="mb-8 rounded-lg bg-white/90 p-6 shadow-sm backdrop-blur-xs">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-avenir-black text-3xl text-gray-900">
                Order Management Dashboard
              </h1>
              <p className="font-lato-regular mt-1 text-gray-600">
                Selamat datang, {adminUser.email}
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout} disabled={isLoggingOut}>
              <LogOut className="mr-2 h-4 w-4" />
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          {/* Stats Cards (Same as before) */}
          <div className="rounded-lg border border-neutral-200 bg-white/90 p-6 shadow-sm backdrop-blur-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-lato-regular text-sm font-medium text-gray-600">Total Orders</p>
                <p className="font-avenir-black text-3xl text-gray-800">{orders.length}</p>
              </div>
              <div className="rounded-full bg-gray-200/50 p-3">
                <ShoppingBag className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-neutral-200 bg-white/90 p-6 shadow-sm backdrop-blur-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-lato-regular text-sm font-medium text-gray-600">Delivery</p>
                <p className="font-avenir-black text-3xl text-blue-400">{deliveryCount}</p>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <Truck className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-neutral-200 bg-white/90 p-6 shadow-sm backdrop-blur-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-lato-regular text-sm font-medium text-gray-600">Pickup</p>
                <p className="font-avenir-black text-3xl text-orange-400">{pickupCount}</p>
              </div>
              <div className="rounded-full bg-orange-100 p-3">
                <Store className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-neutral-200 bg-white/90 p-6 shadow-sm backdrop-blur-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-lato-regular text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="font-avenir-black text-2xl text-green-500">{formatCurrency(totalRevenue)}</p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 rounded-lg border border-neutral-200 bg-white/90 p-6 shadow-sm backdrop-blur-xs">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-4">
              <div className="relative max-w-md flex-1">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search ID, name, email, or area..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={selectedOrderType}
                  onChange={(e) => setSelectedOrderType(e.target.value)}
                  className="font-lato-regular rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400 focus:outline-hidden"
                >
                  <option value="all">All Types</option>
                  <option value="delivery">Delivery Only</option>
                  <option value="pickup">Pickup Only</option>
                </select>
              </div>
            </div>
            <Button onClick={exportToCSV} className="flex items-center gap-2 text-white">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Results Header */}
        <div className="mb-4 rounded-lg border border-neutral-200 bg-white/90 p-4 shadow-sm backdrop-blur-xs">
          <h2 className="font-avenir-regular text-xl font-bold text-gray-900">
            Transactions ({filteredOrders.length})
          </h2>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="rounded-lg bg-white/90 p-8 text-center shadow-sm backdrop-blur-xs">
              <p className="font-lato-regular text-gray-500">
                {searchTerm || selectedOrderType !== "all"
                  ? "No orders match your filters."
                  : "No orders found."}
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.transaction_id}
                className="rounded-lg border border-neutral-200 bg-white/90 p-6 shadow-sm backdrop-blur-xs transition-all hover:shadow-md"
              >
                {/* Card Header */}
                <div className="mb-4 flex flex-col justify-between border-b border-gray-200 pb-4 md:flex-row md:items-start">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-avenir-black text-xl text-gray-900">
                        {order.name}
                      </h3>
                      <span
                        className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                          order.is_delivery
                            ? "bg-blue-100 text-blue-600"
                            : "bg-orange-100 text-orange-600"
                        }`}
                      >
                        {order.is_delivery ? (
                          <> <Truck className="h-3 w-3" /> DELIVERY </>
                        ) : (
                          <> <Store className="h-3 w-3" /> PICKUP </>
                        )}
                      </span>
                    </div>
                    <div className="font-lato-regular mt-2 flex items-center gap-4 text-sm text-gray-500">
                      <span className="font-mono text-xs text-gray-400">#{order.transaction_id}</span>
                      <span className="hidden text-gray-300 md:inline">|</span>
                      <span className="flex items-center gap-1">
                         <Mail className="h-3 w-3" /> {order.email}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 text-left md:mt-0 md:text-right">
                    <div className="font-lato-regular text-sm text-gray-500">Ordered on</div>
                    <div className="font-lato-bold text-sm text-gray-900">
                      {formatDate(order.created_at)}
                    </div>
                  </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  
                  {/* Column 1: Customer & Delivery */}
                  <div className="space-y-4">
                    <div>
                      <p className="font-avenir-regular mb-2 text-sm font-bold text-gray-700">
                        Contact Information
                      </p>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                           <User className="h-4 w-4 text-gray-400" />
                           {order.name}
                        </div>
                        <div className="flex items-center gap-2">
                           <div className="h-4 w-4 flex items-center justify-center text-xs font-bold bg-green-100 text-green-600 rounded-full">W</div>
                           {order.whatsapp}
                        </div>
                      </div>
                    </div>

                    {order.is_delivery && (
                      <div>
                        <p className="font-avenir-regular mb-2 text-sm font-bold text-gray-700">
                          Delivery Details
                        </p>
                        <div className="rounded-md bg-gray-50 p-3 text-sm text-gray-600">
                           <div className="flex items-start gap-2 mb-1">
                              <MapPin className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                              <span className="font-medium text-gray-900">{order.area || "Area not specified"}</span>
                           </div>
                           <p className="pl-6 leading-relaxed">{order.full_address}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Column 2: Order Items (Updated for RawVariant) */}
                  <div>
                    <p className="font-avenir-regular mb-2 text-sm font-bold text-gray-700">
                      Order Items ({order.order_items.length})
                    </p>
                    <div className="max-h-64 overflow-y-auto rounded-md border border-gray-100 bg-white p-1 scrollbar-thin scrollbar-thumb-gray-200">
                       <ul className="divide-y divide-gray-50">
                          {order.order_items.map((item, idx) => (
                             <li key={idx} className="p-3">
                                {/* Item Header */}
                                <div className="flex items-start justify-between mb-1">
                                   <div className="flex flex-col">
                                      <span className="font-medium text-sm text-gray-800">{item.name}</span>
                                      <div className="flex items-center gap-2 mt-0.5">
                                         <span className="inline-flex items-center gap-1 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500 uppercase tracking-wide">
                                            {item.type}
                                         </span>
                                         <span className="text-xs text-gray-400">
                                            {formatCurrency(item.price)}
                                         </span>
                                      </div>
                                   </div>
                                </div>

                                {/* Variants or Single Quantity Logic */}
                                {item.variants && item.variants.length > 0 ? (
                                  <div className="mt-2 space-y-1">
                                     {item.variants.map((variant, vIdx) => (
                                        <div key={vIdx} className="flex items-center justify-between rounded bg-gray-50 px-2 py-1 text-xs">
                                           <div className="flex items-center gap-2 text-gray-600">
                                              <Tag className="h-3 w-3 text-gray-400" />
                                              <span>Size: <strong>{variant.size}</strong></span>
                                              {variant.color && (
                                                <>
                                                  <span className="text-gray-300">|</span>
                                                  <span>{variant.color}</span>
                                                </>
                                              )}
                                           </div>
                                           <span className="font-bold text-gray-700">x{variant.quantity}</span>
                                        </div>
                                     ))}
                                  </div>
                                ) : (
                                  // Fallback for items without variants
                                  <div className="mt-2 flex items-center justify-between rounded bg-gray-50 px-2 py-1 text-xs">
                                     <span className="text-gray-500">Quantity</span>
                                     <span className="font-bold text-gray-700">x{item.quantity || 1}</span>
                                  </div>
                                )}
                             </li>
                          ))}
                       </ul>
                    </div>
                  </div>

                  {/* Column 3: Payment & Refund */}
                  <div className="flex flex-col h-full">
                    <p className="font-avenir-regular mb-2 text-sm font-bold text-gray-700">
                      Payment & Refund
                    </p>
                    <div className="flex-1 space-y-3">
                       <div className="rounded-lg bg-green-50 p-3 border border-green-100">
                          <p className="text-xs text-green-600 font-medium uppercase">Total Amount</p>
                          <p className="text-xl font-avenir-black text-green-700">{formatCurrency(order.total_price)}</p>
                       </div>

                       <div>
                          <p className="text-xs text-gray-400 mb-1">Refund Info</p>
                          <div className="text-sm text-gray-600">
                             <div className="flex justify-between border-b border-dashed border-gray-200 pb-1 mb-1">
                                <span>Bank/E-Wallet</span>
                                <span className="font-medium">{order.refund_account}</span>
                             </div>
                             <div className="flex justify-between">
                                <span>Number</span>
                                <span className="font-mono font-medium">{order.refund_number}</span>
                             </div>
                          </div>
                       </div>

                       <div className="pt-2 mt-auto">
                          {order.payment_proof_url ? (
                            <a
                              href={order.payment_proof_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors shadow-sm"
                            >
                              <CreditCard className="h-4 w-4" />
                              View Proof
                            </a>
                          ) : (
                            <div className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-100 py-2.5 text-sm font-medium text-gray-400 cursor-not-allowed">
                              No proof attached
                            </div>
                          )}
                       </div>
                    </div>
                  </div>

                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}