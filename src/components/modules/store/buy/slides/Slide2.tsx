"use client"

import { merchData } from "@/components/data/merch";
import { casebook } from "@/components/data/casebook";
import { framework } from "@/components/data/framework";
import { bundle } from "@/components/data/bundle";
import { Button } from "@/components/elements/Form/button"
import { useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import ItemSection from "../components/ItemSection";
import { toast } from "sonner";
import { transformSelectionsToOrders } from "@/utils/store/transformOrder";

interface Slide2Props {
  isMerchOpen: boolean;
  onNext: () => void;
  onPrev: () => void;
  formatPrice: (price: number) => string;
}

interface SelectionItem {
  isSelected: boolean;
  orderVariants: {
    variantId: string;
    quantity: number;
    size: string;
  }[];
}

export default function Slide2({isMerchOpen, onNext, onPrev, formatPrice} : Slide2Props){
  const { setValue, watch } = useFormContext();
  const [hasAttemptedNext, setHasAttemptedNext] = useState(false);

  const savedSelections = watch('itemSelections') || {};

  const [selections, setSelection] = useState<Record<string, SelectionItem>>(savedSelections);

  const listItem = isMerchOpen ? 
    [...merchData, ...casebook, ...framework, ...bundle]
    :
    [...casebook, ...framework];

  const nameAndPrice = Object.fromEntries(
    listItem.map(item => [item.name, item.price])
  );

  useEffect(() => {
    if (savedSelections && Object.keys(selections).length > 0) {
      setSelection(savedSelections);
    }
  }, []);

  const handleSelectionChange = (itemName, isSelected, orderVariants) => {
    const newSelections = {
      ...selections,
      [itemName]: { isSelected, orderVariants }
    };

    setSelection(newSelections);
    
    setValue('itemSelections', newSelections, { shouldDirty: true });
  };

  const totalPrice = useMemo(() => {
    let hitungTotal = 0;
    
    Object.entries(selections).forEach(([namaItem, detailData]) => {
      if (detailData.isSelected) {
        const itemPrice = nameAndPrice[namaItem] || 0;
        const totalQty = detailData.orderVariants.reduce(
          (sum, variant) => sum + variant.quantity, 
          0
        );
        hitungTotal += (itemPrice * totalQty);
      }
    });
    
    return hitungTotal;
  }, [selections]);

  const orderArray = useMemo(() => {
    return transformSelectionsToOrders(selections, listItem );
  }, [selections]);

  useEffect(() => {
    setValue('totalPrice', totalPrice, { shouldDirty: true });
    setValue('order', orderArray, { shouldDirty: true });
  }, [totalPrice, setValue]);

  const handleNext = () => {
    setHasAttemptedNext(true);
    
    const hasSelectedItems = Object.values(selections).some(
      item => item.isSelected && item.orderVariants.some(v => v.quantity > 0)
    );
    
    if (!hasSelectedItems) {
      toast.error('Please select at least one item');
      return;
    }

    const hasInvalidVariants = orderArray.some(order => {
      if (order.variants) {
        return order.variants.some(v => !v.size || v.quantity < 1);
      }
      return false;
    });

    if (hasInvalidVariants) {
      toast.error('Please complete all size and color selections');
      return;
    }
    
    setValue('hasSelectedItem', true);
    onNext();
  };
  
  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="font-avenir-black mb-4 bg-gradient-to-r from-green-200 to-green-500 bg-clip-text text-center text-3xl text-transparent">
        Select Item
      </h2>
      <div className="rounded-xl border-[2px] border-[#77BA47] p-6 shadow-xs mb-4">
        <div className="mb-6 grid grid-cols-1 gap-4">
          {listItem.map((item, index) => {
            const savedSelection = selections[item.name];

            return (
              <ItemSection 
                key={index} 
                data={item}
                onSelectionChange={handleSelectionChange}
                formatPrice={formatPrice}
                initialIsSelected={savedSelection?.isSelected || false}
                initialVariants={savedSelection?.orderVariants || []}
              />
            );
          })}
        </div>
        <div className="mb-2 rounded-lg p-6 py-0">
          <h3 className="font-avenir-regular text-lg font-bold text-gray-700">Total</h3>
          <p className="font-avenir-black mt-2 text-3xl text-[#77BA47]">
            {formatPrice(totalPrice)}
          </p>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 rounded-lg bg-gray-100 p-4">
            <summary className="cursor-pointer font-semibold">Debug: Order Data</summary>
            <pre className="mt-2 text-xs overflow-auto">
              {JSON.stringify(orderArray, null, 2)}
            </pre>
          </details>
        )}
      </div>
      <div className="mt-10 flex justify-between">
        <Button type="button" variant="outline" onClick={onPrev}>
          Back
        </Button>
        <Button type="button" onClick={handleNext}>
          Checkout
        </Button>
      </div>
    </div>
  )
}