export interface OrderVariant {
  variantId?: string;
  size: string;
  quantity: number;
  color?: string;
}

type Item = {
  name: string;
  price: number;
  imagePath: string;
  details?: string[];
  size?: string[];
  color?: string[];
  type: 'merch' | 'digital' | 'bundle';
};

export interface Order {
  name: string;
  type: 'merch' | 'digital' | 'bundle';
  price: number;
  quantity?: number;
  variants?: OrderVariant[];
  color?: string;
}

interface SelectionItem {
  isSelected: boolean;
  orderVariants: {
    variantId: string;
    quantity: number;
    size?: string;
    color?: string;
  }[];
}

// Helper function to check if item needs variants
const needsVariants = (name: string) => {
  return name === "T-shirt" || name === "Sweater" || name === "Wear It Bundle - Sweater, T-shirt, Keychain";
};

/**
 * Transform selections object menjadi Order array
 */
export const transformSelectionsToOrders = (
  selections: Record<string, SelectionItem>,
  listItem : Item[],
): Order[] => {
  const orders: Order[] = [];

  Object.entries(selections).forEach(([itemName, selection]) => {
    // Skip jika tidak selected
    if (!selection.isSelected) return;

    // Cari data item dari listItem
    const itemInfo = listItem.find(item => item.name === itemName);
    if (!itemInfo) return;

    // Jika item butuh variants (ada size/color)
    if (needsVariants(itemName) && selection.orderVariants.length > 0) {
      // Transform variants
      const transformedVariants: OrderVariant[] = selection.orderVariants.map(v => ({
        variantId: v.variantId,
        size: v.size || '',
        quantity: v.quantity,
        ...(v.color && { color: v.color })
      }));

      orders.push({
        name: itemName,
        type: itemInfo.type,
        price: itemInfo.price,
        variants: transformedVariants
      });
    } else {
      // Item tanpa variants (Lanyard, Keychain, Stickers, dll)
      // Hitung total quantity dari semua variants
      const totalQuantity = selection.orderVariants.reduce(
        (sum, v) => sum + v.quantity,
        0
      );

      orders.push({
        name: itemName,
        type: itemInfo.type,
        price: itemInfo.price,
        quantity: totalQuantity,
        ...(selection.orderVariants[0]?.color && { 
          color: selection.orderVariants[0].color 
        })
      });
    }
  });

  return orders;
};