"use client";

import { atom, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export type CartItem = {
  id: string; // unique cart item id (e.g. timestamp)
  product: any;
  quantity: number;
  selectedModifiers: {
    modifierItemId: number;
    modifierName: string;
    modifierPrice: number;
    groupName: string;
  }[];
  note: string;
  itemTotal: number;
};

// Atom chính — tự động persist vào localStorage với key "fb_cart"
const cartItemsAtom = atomWithStorage<CartItem[]>("fb_cart", []);

// Derived atoms (read-only)
const totalItemsAtom = atom((get) =>
  get(cartItemsAtom).reduce((sum, i) => sum + i.quantity, 0)
);

const totalPriceAtom = atom((get) =>
  get(cartItemsAtom).reduce((sum, i) => sum + i.itemTotal, 0)
);

// Hook giữ nguyên API cũ để consumer không cần đổi logic
export function useCart() {
  const [items, setItems] = useAtom(cartItemsAtom);
  const [totalItems] = useAtom(totalItemsAtom);
  const [totalPrice] = useAtom(totalPriceAtom);

  const addToCart = (item: Omit<CartItem, "id">) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) =>
          i.product.id === item.product.id &&
          JSON.stringify(i.selectedModifiers) ===
            JSON.stringify(item.selectedModifiers) &&
          i.note === item.note
      );

      if (existingIndex >= 0) {
        const newItems = [...prev];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + item.quantity,
          itemTotal:
            (newItems[existingIndex].product.price +
              newItems[existingIndex].selectedModifiers.reduce(
                (sum, m) => sum + m.modifierPrice,
                0
              )) *
            (newItems[existingIndex].quantity + item.quantity),
        };
        return newItems;
      }

      return [...prev, { ...item, id: Date.now().toString() }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) => {
        if (i.id === id) {
          const unitPrice =
            i.product.price +
            i.selectedModifiers.reduce((sum, m) => sum + m.modifierPrice, 0);
          return { ...i, quantity, itemTotal: unitPrice * quantity };
        }
        return i;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  };
}
