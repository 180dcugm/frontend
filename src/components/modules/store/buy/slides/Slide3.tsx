"use client"

import { Button } from "@/components/elements/Form/button";
import { Input } from "@/components/elements/Form/input";
import { Label } from "@/components/elements/Form/label";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import FormUploadField from "../components/FormUploadField";

interface Slide3Props {
  onPrev: () => void;
  formatPrice: (price: number) => string;
  isSubmitting: boolean;
  isMerchOpen: boolean;
}

export default function Slide3({ onPrev, formatPrice, isSubmitting, isMerchOpen } : Slide3Props) {
  const {
    register,
    formState: { errors },
    trigger,
    clearErrors,
    watch,
    setValue
  } = useFormContext();

  const totalPrice = watch('totalPrice') || 0;

  const handleFieldValidation = async (fieldName: string) => {
    if (isSubmitting) {
      const isValid = await trigger(fieldName);
      if (isValid) {
        clearErrors(fieldName);
      }
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="font-avenir-black mb-4 bg-gradient-to-r from-green-200 to-green-500 bg-clip-text text-transparent text-center text-2xl">
        Finalize Your Order & Secure Your {isMerchOpen ? <span>Merchandise</span> : <span>item</span>}
      </h2>
      <p className="font-lato-regular mb-8 text-center text-gray-600">
        You are one step away! Please complete your payment.
      </p>
      <div className="mb-8 rounded-lg border-[2px] border-green-300/50 bg-white p-6">
        <h3 className="font-avenir-regular text-lg font-bold text-gray-700">Total Payment</h3>
        <p className="font-avenir-black mt-2 text-3xl text-black">
          {formatPrice(totalPrice)}
        </p>
        <div className="my-3 h-[2px] w-[90%] bg-gray-700" />

        <h3 className="font-avenir-regular mb-4 text-lg font-bold text-gray-700">
          Transfer to This Account
        </h3>

        <div className="flex flex-row items-center justify-start gap-2">
          <p className="font-lato-regular text-md text-gray-600">Bank Name: </p>
          <p className="font-avenir-regular text-md font-bold text-gray-900">blu by BCA</p>
        </div>
        <div className="mt-2 flex flex-row items-center gap-2 border-t border-gray-200">
          <p className="font-lato-regular text-md text-gray-600">Account Number: </p>

          <div className="flex flex-row items-center gap-2">
            <p className="font-avenir-black text-2xl text-green-300">0072 6270 9150</p>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText("007262709150");
                toast.success("Account number copied succesfully!");
              }}
              className="rounded-md bg-green-100 px-3 py-1 text-xs font-medium text-green-600 transition-colors hover:bg-green-200 hover:text-white"
            >
              Copy
            </button>
          </div>
        </div>
        <div className="mt-2 flex flex-row items-center justify-start gap-2 border-t border-gray-200">
          <p className="font-lato-regular text-md text-gray-600">Account Holder: </p>
          <p className="font-lato-bold text-base text-gray-900">Keyra Audrey Annabelle Christian</p>
        </div>
        <p className="font-lato-regular mt-4 text-xs text-gray-500 italic">
          <span className="text-red-300">*</span>Make sure to transfer the exact amount and upload
          your payment proof below
        </p>
      </div>
      <FormUploadField 
        label="Upload Payment Proof"
        name="paymentProofUrl"
        paymentProofFileName="paymentProofFileName"
        register={register}
        watch={watch}
        setValue={setValue}
        accept="image/*"
        maxSizeKB={500}
        bucketName="merch-order-2526"
        validationRules={{
          required: "Payment proof is required",
          validate: {
            hasFile: (files: FileList) => files.length > 0 || "Payment proof is required",
          },
        }}
        className="mb-2"
        />
      <div className="md:col-span-2 mb-2">
        <Label
          htmlFor="refundAccount"
          className="font-avenir-regular mb-2 block text-sm font-medium text-gray-700"
        >
          Refund Account <span className="text-red-500">*</span>
        </Label>
        <Input
          id="refundAccount"
          type="text"
          {...register("refundAccount", {
            required: "Refund account is required",
            validate: {
              notEmpty: (value) => 
                value.trim() !== "" || "Refund account cannot be empty"
            },
            onChange: () => handleFieldValidation("refundAccount")
          })}
          placeholder="ex: Mandiri, Gopay, LinkAja"
          className={`font-lato-regular border-gray-300 transition-all duration-200 focus:ring-2 focus:ring-green-300/50
          ${errors.refundAccount ? "border-red-500" : ""}`}
        />
        {errors.refundAccount && (
          <p className="mt-1 text-sm text-red-500">{errors.refundAccount.message as any}</p>
        )}
      </div>
      <div className="md:col-span-2">
        <Label
          htmlFor="refundNumber"
          className="font-avenir-regular mb-2 block text-sm font-medium text-gray-700"
        >
          Refund Number <span className="text-red-500">*</span>
        </Label>
        <Input
          id="refundNumber"
          type="text"
          {...register("refundNumber", {
            required: "Refund number is required",
            validate: {
              notEmpty: (value) => 
                value.trim() !== "" || "Refund number cannot be empty"
            },
            onChange: () => handleFieldValidation("refundNumber")
          })}
          placeholder="ex: 007262709150"
          className={`font-lato-regular border-gray-300 transition-all duration-200 focus:ring-2 focus:ring-green-300/50
          ${errors.refundNumber ? "border-red-500" : ""}`}
        />
        {errors.refundNumber && (
          <p className="mt-1 text-sm text-red-500">{errors.refundNumber.message as any}</p>
        )}
      </div>
      <div className="mt-4 p-2 bg-gray-100 text-xs font-mono border rounded">
        <p className="font-bold text-gray-500">DEBUG WATCH:</p>
        <pre>{JSON.stringify(watch(), null, 2)}</pre>
      </div>
      <div className="mt-10 flex justify-between">
        <Button type="button" variant="outline" onClick={onPrev} disabled={isSubmitting}>
          Back
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Order"}
        </Button>
      </div>
    </div>
  )
}