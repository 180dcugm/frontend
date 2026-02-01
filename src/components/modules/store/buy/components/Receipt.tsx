"use client"

import { formatWIB } from "@/utils/formatDate";
import React, {useMemo, useState, useEffect, useRef} from "react";

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

// Flattenen Order Item
interface FlatOrderItem {
  name: string;
  quantity: number;
  size?: string;
  color?: string;
  price: number;
  subtotal: number;
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

interface ReceiptProps {
  orderData: OrderData | null;
}

const SAFE_COLORS = {
  white: '#ffffff',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',
  green600: '#16a34a',
  black: '#000000',
};

export const Receipt = React.forwardRef<HTMLDivElement, ReceiptProps>(
  ( { orderData } , ref) => {
    const formatPrice = (price: number) => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(price);
    };

    const flatOrderItems: FlatOrderItem[] = useMemo(() => {
      if (!orderData || !orderData.order_items || !Array.isArray(orderData.order_items)) return [];

      return orderData.order_items.flatMap((item) => {
        const unitPrice = item.price;

        if (item.variants && Array.isArray(item.variants) && item.variants.length > 0) {
          return item.variants.map((v) => ({
            name: item.name,
            price: unitPrice,
            quantity: v.quantity,
            size: v.size,
            color: v.color,
            subtotal: unitPrice * v.quantity
          }));
        } 
        
        else {
          const qty = item.quantity || 1;
          return [{
            name: item.name,
            price: unitPrice,
            quantity: qty,
            size: undefined,
            color: undefined,
            subtotal: unitPrice * qty
          }];
        }
      });
    }, [orderData]);

    if (!orderData) return <div ref={ref} className="p-8 text-center">No data available</div>;

    return (
      <div 
        ref={ref} 
        style={{ 
          padding: '2rem', 
          fontFamily: 'sans-serif',
          backgroundColor: SAFE_COLORS.white, 
          color: SAFE_COLORS.gray900, 
          width: '100%', 
          maxWidth: '800px' 
        }}
      >
        {/* Header */}
        <div 
          style={{ 
            marginBottom: '1.5rem', 
            paddingBottom: '1.5rem', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'start',
            borderBottom: `2px solid ${SAFE_COLORS.gray300}` 
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: SAFE_COLORS.gray900 }}>180 Degrees Consulting</h1>
            <p style={{ fontSize: '0.875rem', color: SAFE_COLORS.gray600 }}>Universitas Gadjah Mada</p>
          </div>
          
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: SAFE_COLORS.gray900 }}>RECEIPT</h2>
            <p style={{ fontSize: '0.875rem', marginTop: '0.25rem', color: SAFE_COLORS.gray600 }}>Order ID: {orderData.transaction_id}</p>
            <p style={{ fontSize: '0.875rem', color: SAFE_COLORS.gray600 }}>Date: {formatWIB(orderData.created_at)}</p>
          </div>
        </div>

        {/* Customer Information */}
        <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
          <h3 style={{ marginBottom: '0.75rem', fontSize: '1.125rem', fontWeight: 'bold', color: SAFE_COLORS.gray900 }}>Customer Information</h3>
          <div 
            style={{ 
              borderRadius: '0.5rem', 
              padding: '1rem',
              backgroundColor: SAFE_COLORS.gray50 
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.875rem', gap: '0.5rem' }}>
              <div>
                <span style={{ fontWeight: '600', color: SAFE_COLORS.gray700 }}>Name: </span>
                <span style={{ color: SAFE_COLORS.gray900 }}>{orderData.name}</span>
              </div>
              <div>
                <span style={{ fontWeight: '600', color: SAFE_COLORS.gray700 }}>Email: </span>
                <span style={{ color: SAFE_COLORS.gray900 }}>{orderData.email}</span>
              </div>
              <div>
                <span style={{ fontWeight: '600', color: SAFE_COLORS.gray700 }}>WhatsApp: </span>
                <span style={{ color: SAFE_COLORS.gray900 }}>{orderData.whatsapp}</span>
              </div>
              {orderData.area && (
                <div>
                  <span style={{ fontWeight: '600', color: SAFE_COLORS.gray700 }}>Area: </span>
                  <span style={{ color: SAFE_COLORS.gray900 }}>{orderData.area}</span>
                </div>
              )}
              {orderData.full_address && (
                <div>
                  <span style={{ fontWeight: '600', color: SAFE_COLORS.gray700 }}>Address: </span>
                  <span style={{ color: SAFE_COLORS.gray900 }}>{orderData.full_address}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.75rem', fontSize: '1.125rem', fontWeight: 'bold', textAlign: 'left', color: SAFE_COLORS.gray900 }}>Order Details</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${SAFE_COLORS.gray300}`, backgroundColor: SAFE_COLORS.gray100 }}>
                <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 'bold', color: SAFE_COLORS.gray700 }}>Item</th>
                <th style={{ padding: '0.75rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: 'bold', color: SAFE_COLORS.gray700 }}>Qty</th>
                <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: 'bold', color: SAFE_COLORS.gray700 }}>Price</th>
                <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: 'bold', color: SAFE_COLORS.gray700 }}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {flatOrderItems.map((item, index) => (
                <tr key={index} style={{ borderBottom: `1px solid ${SAFE_COLORS.gray200}` }}>
                  <td style={{ padding: '0.75rem', fontSize: '0.875rem', textAlign: 'left', color: SAFE_COLORS.gray900 }}>
                    <div style={{ fontWeight: '600' }}>{item.name}</div>
                    {(item.size || item.color) && (
                      <div style={{ fontSize: '0.75rem', color: SAFE_COLORS.gray600 }}>
                        {item.size && <span>Size: {item.size}</span>}
                        {item.size && item.color && <span> | </span>}
                        {item.color && <span>Color: {item.color}</span>}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', fontSize: '0.875rem', color: SAFE_COLORS.gray900 }}>{item.quantity}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', color: SAFE_COLORS.gray900 }}>{formatPrice(item.price)}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: SAFE_COLORS.gray900 }}>
                    {formatPrice(item.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: `2px solid ${SAFE_COLORS.gray300}`, backgroundColor: SAFE_COLORS.gray100 }}>
                <td colSpan={3} style={{ padding: '0.75rem', textAlign: 'right', fontSize: '1.125rem', fontWeight: 'bold', color: SAFE_COLORS.gray900 }}>
                  TOTAL
                </td>
                <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '1.125rem', fontWeight: 'bold', color: SAFE_COLORS.green600 }}>
                  {formatPrice(orderData.total_price)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Footer */}
        <div 
          style={{ 
            marginTop: '2rem', 
            paddingTop: '1.5rem', 
            textAlign: 'center',
            borderTop: `2px solid ${SAFE_COLORS.gray300}` 
          }}
        >
          <p style={{ fontSize: '0.875rem', color: SAFE_COLORS.gray600 }}>Thank you for your purchase!</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: SAFE_COLORS.gray500 }}>
            For any inquiries, please contact us via WhatsApp or email
          </p>
        </div>
      </div>
    );
  }
);