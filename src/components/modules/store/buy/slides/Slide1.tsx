"use client"

import { Button } from "@/components/elements/Form/button";
import { Input } from "@/components/elements/Form/input";
import { Label } from "@/components/elements/Form/label";
import { RadioGroup, RadioGroupItem } from "@/components/elements/Form/radioGroup";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";

interface Slide1Props {
  isMerchOpen: boolean;
  isDelivery: boolean;
  setIsDelivery: (value: boolean) => void;
  onNext: () => void;
}

export default function Slide1({ isMerchOpen, isDelivery, setIsDelivery, onNext } : Slide1Props) {
  const [hasAttemptedNext, setHasAttemptedNext] = useState(false);
  const {
    register,
    formState: { errors },
    trigger,
    clearErrors,
    setValue
  } = useFormContext();

  // Validate Email
  const emailPattern = {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Please enter a valid email address"
  };

  // Validate Whatsapp Number (10 - 15 digit)
  const whatsappPattern = {
    value: /^[0-9]{10,15}$/,
    message: "Please enter a valid WhatsApp number (10-15 digits)"
  };

  const handleFieldValidation = async (fieldName) => {
    // Trigger validasi untuk field tertentu
    if (hasAttemptedNext) {
      const isValid = await trigger(fieldName);
      if (isValid) {
        clearErrors(fieldName);
      }
    }
  };

  const handleNext = async () => {
    setHasAttemptedNext(true);
    const fieldsToValidate = isDelivery 
       ? ["name", "email", "whatsapp", "fullAddress", "area"]
       : ["name", "email", "whatsapp"];
    const isValid = await trigger(fieldsToValidate);
    
    if (isValid) {
      onNext();
    } else {
      toast.error('Please complete all required fields');
    }
  };

  useEffect(() => {
    if (!isDelivery) {
      localStorage.removeItem("fullAddress"); 
      localStorage.removeItem("area");

      setValue("fullAddress", "");
      setValue("area", "");

      clearErrors(["fullAddress", "area"]);
    }
  }, [isDelivery, setValue, clearErrors]);

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="font-avenir-black mb-4 bg-gradient-to-r from-green-200 to-green-500 bg-clip-text text-center text-3xl text-transparent">
        #PLSFIX Merch Cycle 2: 180 Degrees Consulting UGM Order Form
      </h2>
      <div className="rounded-xl border border-green-300/50 p-6 shadow-xs mb-4">
        <h3 className="font-avenir-black mb-6 flex items-center gap-2 text-xl text-gray-800">
          180 Degrees Consulting UGM {isMerchOpen ? <span>Merchandise, Framework, and Casebook</span> : <span>Framework and Casebook</span> } 
        </h3>
        <div className="mb-2 font-lato-regular">
          <p>
            Get ready to elevate your style while making a real impact! At 180 Degrees Consulting UGM, 
            we believe that small actions create big changes—and what better way to show your support 
            than through our exclusive merchandise?
            <br />
            <br />
          </p>
          {isMerchOpen ? 
            <p>
              Whether you're looking for something subtle yet meaningful or bold and eye-catching, 
              we&apos;ve got just the right pieces for you!
              <br />
              <br />
            </p>
            : <></>
          }
        </div>
        <div className="mb-2">
          <h2 className="font-avenir-regular font-bold">💡 What&apos;s in our collection?</h2>
          {isMerchOpen ? 
            <p>
              ✨ Lanyard – Keep your essentials handy while repping a cause you believe in!
              <br />
              🔑 Keychain – Perfect for your bag or keys!
              <br />
              🎨 Stickers – Customize your gadgets, notebooks, and more with designs that inspire!
              <br />
              👕 T-Shirts – Comfy, stylish, and perfect for everyday wear!
              <br />
              🧥 Sweaters – Stay warm and cozy!
              <br />
            </p>
          : 
           <></>}
          <p>
            📘 Casebook – Dive into real-world consulting cases to sharpen your problem-solving skills and 
            prepare for client work or case interviews.
            <br />
            🧠 Framework Bank – Access a curated collection of consulting frameworks to boost your strategy 
            toolkit and ace any challenge.  
            <br />
            <br />
          </p>
        </div>
        {isMerchOpen ? 
          <div className="mb-2">
            <p className="font-lato-regular">
              So why wait? Select your favorites, wear them with pride, and show the world that you&apos;re part of 
              something bigger! 🌍💙
            </p>
          </div>
          :
          <></>
        }
      </div>
      <div className="rounded-xl border border-green-300/50 p-6 shadow-xs">
        <h3 className="font-avenir-black mb-6 flex items-center gap-2 text-xl text-gray-800">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-300">
            <span className="text-sm font-bold text-white">1</span>
          </div>
          Personal Information
        </h3>
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label
              htmlFor="name"
              className="font-avenir-regular mb-2 block text-sm font-medium text-gray-700"
            >
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              {...register("name", {
                required: "Full name is required",
                validate: {
                  notEmpty: (value) => 
                    value.trim() !== "" || "Full name cannot be empty"
                },
                onChange: () => handleFieldValidation("name")
              })}
              placeholder="ex: john doe"
              className={`font-lato-regular border-gray-300 transition-all duration-200 focus:ring-2 focus:ring-green-300/50
              ${errors.name ? "border-red-500" : ""}`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message as any}</p>
            )}
          </div>
          <div>
            <Label
              htmlFor="email"
              className="font-avenir-regular mb-2 block text-sm font-medium text-gray-700"
            >
              Email Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email", {
                required: "Email address is required",
                pattern: emailPattern,
                validate: {
                  notEmpty: (value) => 
                    value.trim() !== "" || "Email cannot be empty"
                },
                onChange: () => handleFieldValidation("email")
              })}
              placeholder="ex: john.doe@example.com"
              className={`font-lato-regular border-gray-300 transition-all duration-200 focus:ring-2 focus:ring-green-300/50 ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message as any}</p>
            )}
          </div>
          <div>
            <Label
              htmlFor="whatsapp"
              className="font-avenir-regular mb-2 block text-sm font-medium text-gray-700"
            >
              Whatsapp Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="whatsapp"
              type="text"
              {...register("whatsapp", {
                required: "WhatsApp number is required",
                pattern: whatsappPattern,
                validate: {
                  notEmpty: (value) => 
                    value.trim() !== "" || "WhatsApp number cannot be empty"
                },
                onChange: () => handleFieldValidation("whatsapp")
              })}
              placeholder="ex: 08123456890"
              className={`font-lato-regular border-gray-300 transition-all duration-200 focus:ring-2 focus:ring-green-300/50 ${
                errors.whatsapp ? "border-red-500" : ""
              }`}
            />
            {errors.whatsapp && (
              <p className="mt-1 text-sm text-red-500">{errors.whatsapp.message as any}</p>
            )}
          </div>
          {isMerchOpen ?
            <div>
              <Label
                className="font-avenir-regular mb-2 block text-sm font-medium text-gray-700"
              >
                Shipping Information <span className="text-red-500">*</span>
              </Label>
              
              <RadioGroup 
                value={isDelivery ? "true" : "false"} 
                onValueChange={(value) => setIsDelivery(value === "true")}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="pickup" />
                  <Label htmlFor="pickup" className="font-avenir-regular font-normal hover:cursor-pointer">
                    Self Pick-Up (Selasar FEB UGM, pick-up date TBA)
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="delivery" />
                  <Label htmlFor="delivery" className="font-avenir-regular font-normal hover:cursor-pointer">
                    Delivery
                  </Label>
                </div>
              </RadioGroup>
            </div>
            :
            <></>
          }
          {isDelivery &&
            <>
              <div className="md:col-span-2">
                <Label
                  htmlFor="fullAddress"
                  className="font-avenir-regular mb-2 block text-sm font-medium text-gray-700"
                >
                  Full Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fullAddress"
                  type="text"
                  {...register("fullAddress", {
                    required: isDelivery ? "Full address is required" : false,
                    validate: {
                      notEmpty: (value) => 
                        !isDelivery || value.trim() !== "" || "Full address cannot be empty"
                    },
                    onChange: () => handleFieldValidation("fullAddress")
                  })}
                  placeholder="ex: Jl. Kaliurang No. 123, Yogyakarta"
                  className={`font-lato-regular border-gray-300 transition-all duration-200 focus:ring-2 focus:ring-green-300/50 ${
                    errors.fullAddress ? "border-red-500" : ""
                  }`}
                />
                {errors.fullAddress && (
                  <p className="mt-1 text-sm text-red-500">{errors.fullAddress.message as string}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <Label
                  htmlFor="area"
                  className="font-avenir-regular mb-2 block text-sm font-medium text-gray-700"
                >
                  Area <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="area"
                  type="text"
                  {...register("area", {
                    required: isDelivery ? "Area is required" : false,
                    validate: {
                      notEmpty: (value) => 
                        !isDelivery || value.trim() !== "" || "Area cannot be empty"
                    },
                    onChange: () => handleFieldValidation("area")
                  })}
                  placeholder="ex: Sleman, Yogyakarta"
                  className={`font-lato-regular border-gray-300 transition-all duration-200 focus:ring-2 focus:ring-green-300/50 ${
                    errors.area ? "border-red-500" : ""
                  }`}
                />
                {errors.area && (
                  <p className="mt-1 text-sm text-red-500">{errors.area.message as string}</p>
                )}
              </div>
            </>
          }
        </div>
      </div>
      <div className="mt-10 flex justify-end">
        <Button type="button" onClick={handleNext}>
          Next
        </Button>
      </div>
    </div>
  )
}