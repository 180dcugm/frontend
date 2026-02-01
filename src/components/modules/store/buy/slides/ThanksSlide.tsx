"use client"
import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from 'next/link';
import confetti from "canvas-confetti"
import { useRouter } from "next/navigation";
import { Button } from "@/components/elements/Form/button";
import { toast } from "sonner";
import { Receipt } from "../components/Receipt";

const whatsappGroupUrl = "";

Receipt.displayName = "Receipt";
const RECEIPT_KEY = "merch-receipt-data";

export default function ThanksSlide({ transactionId }: { transactionId?: string }) {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    const end = Date.now() + 3 * 1000 // 3 seconds
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"]
    const frame = () => {
      if (Date.now() > end) return
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      })
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      })
      requestAnimationFrame(frame)
    }
    frame()
  }, [])

  useEffect(() => {
    const savedData = localStorage.getItem(RECEIPT_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setOrderData(parsed);
      } catch (e) {
        console.error("Failed to parse receipt data", e);
      }
    }
  }, []);

  const router = useRouter();
  const handleHome = () => {
    router.push("/"); // Logika untuk kembali ke Home
  };

  const downloadPDF = async () => {
    const element = receiptRef.current;
    
    if (!element) return; 
    
    try {
      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = html2pdfModule.default;
    
      if (!html2pdf) {
        throw new Error('html2pdf.js failed to load');
      }

      const opt = {
          margin: 10,
          filename: `receipt.pdf`,
          image: { type: 'jpeg' as any, quality: 0.98 },
          html2canvas: { 
            scale: 2, 
          },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
      };

      await html2pdf().set(opt).from(element).save();
      setIsDownloaded(true);
      toast.success('Receipt downloaded successfully!');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Failed to download: ${error.message}`);
      } else {
        toast.error('Failed to download receipt. Please try again.');
      }
    }
  };
  
  return (
    <div className="mx-auto max-w-lg text-center">
      <div className="hidden">
        <Receipt ref={receiptRef} orderData={orderData}/>
      </div>
      <div className="mb-6 text-6xl">🎉</div>

      <h2 className="font-avenir-black mb-4 text-3xl text-gray-900">Payment Complete!</h2>

      <p className="font-lato-regular mb-8 text-lg text-gray-700">
        You've made a great choice!✨
      </p>

      <div className="rounded-lg border border-green-200 bg-green-50 p-6 mb-5">
        <div className="flex items-center justify-center gap-2 mb-4">
          <h3 className="text-2xl font-bold text-green-800">Download Receipt</h3>
        </div>
        <Button type="button" onClick={downloadPDF} className="w-full">
          Receipt
        </Button>
      </div>

      <div className="rounded-lg border border-green-200 bg-green-50 p-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <h3 className="text-2xl font-bold text-green-800">Join Our Community</h3>
        </div>
        <Link
          href={whatsappGroupUrl}
          onClick={(e) => {
            if (!isDownloaded) {
              e.preventDefault();
              toast.error('Please download the receipt first');
            }
          }}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center justify-center w-full ${isDownloaded ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'} text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg`}
        >
          <svg 
            className="w-5 h-5 mr-2" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          {isDownloaded ? <span>Join WhatsApp Group</span> : <span>Download the receipt to unlock</span>}
        </Link>
        
        <p className="flex items-center justify-center gap-2 text-xs text-green-700 text-center mt-3">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          You'll receive further instructions and updates in the group
        </p>
      </div>

      <p className="font-lato-regular text-md mt-8 text-gray-600">
        Stay tuned & Thank you for purchasing!
      </p>

      <Button
        type="button"
        onClick={handleHome}
        className="mt-8"
      >
        Back to Home
      </Button>
    </div>
  );
}
