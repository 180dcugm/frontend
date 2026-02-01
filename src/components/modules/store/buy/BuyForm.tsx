"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";

import Stepper from "./components/Stepper";
import Slide1 from "./slides/Slide1";
import Slide2 from "./slides/Slide2";
import Slide3 from "./slides/Slide3";
import ThanksSlide from "./slides/ThanksSlide";
import { toast } from "sonner";
import Container from "@/components/layout/Container";

export interface OrderVariant {
  variantId?: string;
  size: string;
  quantity: number;
  color?: string;
}

export interface Order {
  name: string;
  type: 'merch' | 'digital' | 'bundle';
  price: number;
  quantity?: number;
  variants?: OrderVariant[];
  color?: string;
}

type FormData = {
  // Receipt
  transactionId: string;
  date: string;

  // --- Fields dari Slide 1 ---
  name: string;
  email: string;
  whatsapp: string;
  isDelivery: boolean;
  fullAddress?: string;
  area?: string;
  
  // --- Fields dari Slide 2 ---
  order: Order[];

  // -- Fields dari Slide 3 ---
  totalPrice: number;
  paymentProofUrl: string;
  paymentProofFileName: string;
  refundAccount: string;
  refundNumber: string;
}

// Key for LOCALSTORAGE
const STORAGE_KEY = "merch-buy-progress"
const RECEIPT_KEY = "merch-receipt-data";

export default function BuyForm({ isMerchOpen }) {
  // State
  const [currentStep, setCurrentStep] = useState(1);
  const [isDelivery, setIsDelivery] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionId, setTransactionId] = useState("")

  const methods = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      transactionId: "",
      paymentProofUrl: "",
      paymentProofFileName: "",
    }
  });
  const { watch, reset } = methods

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", 
    });
  }, [currentStep])

  // Load Local Storage
  useEffect(() => {
    const savedProgress = localStorage.getItem(STORAGE_KEY);
    if(savedProgress) {
      try {
        const data = JSON.parse(savedProgress);
        // Check if store status change
        if (data.storeStatus !== isMerchOpen) {
           localStorage.removeItem(STORAGE_KEY);
           setIsLoading(false);
           return;
        }
        if (data.formData) {
          reset(data.formData);
        }
        if (data.currentStep) {
          setCurrentStep(data.currentStep);
        }
        if (data.isDelivery) {
          setIsDelivery(data.isDelivery);
        }
        if (data.transactionId) {
          setTransactionId(data.transactionId);
        }
      } catch (error) {
        console.error("Gagal memuat progress:", error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, [reset, isMerchOpen]);

  // Save to Local Storage
  const watchedData = watch();
  useEffect(() => {
    if (isLoading) return;
    if (currentStep === 4) return;

    const progressData = {
      formData: watchedData,
      currentStep,
      isDelivery,
      storeStatus: isMerchOpen,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progressData))
  }, [watchedData, currentStep, isDelivery, isLoading, isMerchOpen]);

  // Next Navigation
  const handleNextStep = () => {
    if (currentStep === 1) {
      setCurrentStep(2)
    } else if (currentStep === 2){
      setCurrentStep(3);
    }
  }

  // Prev Navigation
  const handlePrevStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    } else if (currentStep === 3){
      setCurrentStep(2);
    } 
  }

  // Stepper
  const stepsToShow = ["Personal Information", "Select Merch", "Payment", "Complete"];
  let activeStepIndex = currentStep;

  //Submit 
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    // Validate refund fields
    const isValid = await methods.trigger(['refundAccount', 'refundNumber']);
    if (!isValid) {
      toast.error('Please complete all required fields');
      return;
    }
    
    setIsSubmitting(true);

    // Post
    try {
      const response = await fetch("/api/store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      // Handle Fail Submit
      if (!response.ok) {
        throw new Error(result.error || "Failed to submit. Please try again.");
      }

      // Handle Success Submit
      console.log("Sukses submit:", result.message);
      toast.success("Registration complete!");
      const orderData = result.data;
      setTransactionId(orderData.transaction_id);
      setCurrentStep(4);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(RECEIPT_KEY, JSON.stringify(orderData));

    } catch (error: any) {
      console.error("Submit error:", error);
      toast.error(`Error submitting form: ${error.message}`);
      setIsSubmitting(false);

    } finally {
      setIsSubmitting(false);
    }
  }

  // Tampilan Loading 
  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="font-lato-regular text-lg">Loading...</p>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Dinamic Slide
  const renderSlide = () => {
    const slideProps = {
      onNext: handleNextStep,
      onPrev: handlePrevStep,
      isMerchOpen,
    }

    switch (currentStep) {
      case 1:
        return <Slide1 {...slideProps} isDelivery={isDelivery} setIsDelivery={setIsDelivery}/>
      case 2:
        return <Slide2 {...slideProps} formatPrice={formatPrice} />
      case 3:
        return <Slide3 {...slideProps} formatPrice={formatPrice} isSubmitting={isSubmitting}/>
      case 4:
        // setCurrentStep(1);
        return <ThanksSlide transactionId={transactionId}/>
      default:
        setCurrentStep(1);
    }
  }


  return (
    <section className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black to-green-300/90 p-4">
      <Container className="w-full max-w-4xl py-10">
        <div className="rounded-lg border-0 bg-white p-6 shadow-2xl backdrop-blur-xs">
          <div className="pb-4">  
            {currentStep < 5 && <Stepper activeStep={activeStepIndex} steps={stepsToShow} />}
          </div>
          <div className="pb-8 min-h-[400px]">
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                {renderSlide()}
              </form>
            </FormProvider>
          </div>
        </div>
      </Container>
    </section>
  );
}