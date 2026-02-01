import { Label } from "@/components/elements/Form/label";
import { Checkbox } from "@/components/elements/Form/checkbox";
import { useEffect, useState } from "react"
import { OrderVariant } from "../BuyForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/elements/Form/select";
import { Plus, X } from 'lucide-react';
import Image from "next/image";

type Type = "merch" | "digital" | "bundle";

interface Item {
  name: string;
  type: Type;
  price: number;
  imagePath: string;
  details?: Array<string>;
  sizeChartImagePath?: string;
  size?: Array<string>;
  color?: Array<string>;
  
  // Khusus Wear it bundle
  detailsSweater?: Array<string>;
  detailsTshirt?: Array<string>;
  colorSweater?: Array<string>;
}

interface ItemSectionProps {
  data: Item; 
  onSelectionChange?: (merchName: string, isSelected: boolean, orderVariants: OrderVariant[]) => void;
  formatPrice;
  initialIsSelected?: boolean;
  initialVariants?: OrderVariant[];
}

// Helper function to check if item needs size
const needsSize = (name: string) => {
  return name === "T-shirt" || name === "Sweater" || name === "Wear It Bundle - Sweater, T-shirt, Keychain";
};

// Helper function to check if item needs color
const needsColor = (name: string) => {
  return name === "Sweater" || name === "Wear It Bundle - Sweater, T-shirt, Keychain";
};

// Helper function to check if item can have variants
const canHaveVariants = (name: string) => {
  return needsSize(name);
};

export default function ItemSection({ 
  data, 
  onSelectionChange, 
  formatPrice ,
  initialIsSelected = false,
  initialVariants = []
} : ItemSectionProps ){
  const [isSelected, setIsSelected ] = useState(initialIsSelected);
  const [variants, setVariants] = useState<OrderVariant[]>(initialVariants)
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      setIsSelected(initialIsSelected);
      setVariants(initialVariants.length > 0 ? initialVariants : []);
      setIsInitialized(true);
    }
  }, [initialIsSelected, initialVariants, isInitialized]);

  const handleCheckboxChange = (checked: boolean | 'indeterminate') => {
    const isChecked = checked === true;
    setIsSelected(isChecked);
    
    if (isChecked) {
      const initialVariant: OrderVariant = {
        variantId: `variant-${Date.now()}`,
        quantity: 1,
        ...(needsSize(data.name) && { size: '' }),
        ...(needsColor(data.name) && { color: '' })
      };
      setVariants([initialVariant]);
      onSelectionChange?.(data.name, true, [initialVariant]);
    } else {
      // Clear all variants
      setVariants([]);
      onSelectionChange?.(data.name, false, []);
    }
  };

  const handleAddVariant = () => {
    const newVariant: OrderVariant = {
      variantId: `variant-${Date.now()}`,
      quantity: 1,
      ...(needsSize(data.name) && { size: '' }),
      ...(needsColor(data.name) && { color: '' })
    };
    const updatedVariants = [...variants, newVariant];
    setVariants(updatedVariants);
    onSelectionChange?.(data.name, true, updatedVariants);
  };

  const handleRemoveVariant = (variantId: string) => {
    const updatedVariants = variants.filter(v => v.variantId !== variantId);
    setVariants(updatedVariants);
    
    if (updatedVariants.length === 0) {
      setIsSelected(false);
      onSelectionChange?.(data.name, false, []);
    } else {
      onSelectionChange?.(data.name, true, updatedVariants);
    }
  };

  const handleVariantChange = (variantId: string, field: keyof OrderVariant, value: any) => {
    const updatedVariants = variants.map(v => 
      v.variantId === variantId ? { ...v, [field]: value } : v
    );
    setVariants(updatedVariants);
    onSelectionChange?.(data.name, true, updatedVariants);
  };

  return(
    <div className={`rounded-lg border-2 p-4 transition-all ${
      isSelected ? 'border-[#77BA47]/20 bg-gray-50' : 'border-gray-200 bg-white'
    }`}>
      {/* Header Section */}
      <div className="mb-4 flex items-start gap-4">
        {/* Image Placeholder */}
        <div className="h-24 w-24 flex-shrink-0 rounded-md bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
          {data.imagePath ? (
            <Image 
              src={data.imagePath}
              width={96}
              height={96}
              alt="Preview Image"
            />
          ) : (
            <span>No Image</span>
          )}
        </div>

        {/* Info Section */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">{data.name}</h3>
              <p className="text-lg font-bold text-[#77BA47]">{formatPrice(data.price)}</p>
              {data.details && data.details.length > 0 && (
                <ul className="mt-1 text-xs text-gray-600">
                  {data.details.map((detail, idx) => (
                    <li key={idx}>• {detail}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Checkbox */}
            <div className="flex items-center gap-2">
              <Checkbox
                id={`merch-${data.name}`}
                checked={isSelected}
                onCheckedChange={handleCheckboxChange}
              />
              <Label
                htmlFor={`merch-${data.name}`}
                className="text-sm font-medium cursor-pointer"
              >
                Select
              </Label>
            </div>
          </div>
        </div>
      </div>

      {/* Variants Section */}
      {isSelected && (
        <div className="space-y-4 border-t pt-4">
          {variants.map((variant, index) => (
            <div
              key={variant.variantId}
              className="relative rounded-md border border-gray-300 bg-white p-4"
            >
              {/* Remove Button (except first variant) */}
              {index > 0 && (
                <button
                  onClick={() => handleRemoveVariant(variant.variantId)}
                  className="absolute right-2 top-2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500"
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {/* Quantity */}
                <div>
                  <Label htmlFor={`quantity-${variant.variantId}`} className="mb-1 block text-sm font-medium text-gray-700">
                    Quantity <span className="text-red-500">*</span>
                  </Label>
                  <input
                    id={`quantity-${variant.variantId}`}
                    type="number"
                    min="1"
                    value={variant.quantity}
                    onChange={(e) => handleVariantChange(variant.variantId, 'quantity', parseInt(e.target.value) || 1)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Size (if needed) */}
                {needsSize(data.name) && (
                  <div>
                    <Label htmlFor={`size-${variant.variantId}`} className="mb-1 block text-sm font-medium text-gray-700">
                      Size <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={variant.size || ''}
                      onValueChange={(value) => handleVariantChange(variant.variantId, 'size', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        {data.size?.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Color (if needed) */}
                {needsColor(data.name) && (
                  <div>
                    <Label htmlFor={`color-${variant.variantId}`} className="mb-1 block text-sm font-medium text-gray-700">
                      Color <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={variant.color || ''}
                      onValueChange={(value) => handleVariantChange(variant.variantId, 'color', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent>
                        {(data.color || data.colorSweater)?.map((color) => (
                          <SelectItem key={color} value={color}>
                            {color}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Add Variant Button */}
          {canHaveVariants(data.name) && (
            <button
              onClick={handleAddVariant}
              className="flex w-full items-center justify-center gap-2 rounded-md border-2 border-dashed border-gray-300 py-3 text-sm font-medium text-gray-600 transition-colors hover:border-[#77BA47] "
              type="button"
            >
              <Plus className="h-4 w-4" />
              Add Variant
            </button>
          )}
        </div>
      )}
    </div>
  )
}