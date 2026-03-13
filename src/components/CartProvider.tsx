"use client";

import { createContext, useContext, useState, useEffect } from "react";

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

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "id">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, newQuantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedCart = localStorage.getItem("fb_cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("fb_cart", JSON.stringify(items));
    }
  }, [items, isClient]);

  const addToCart = (item: Omit<CartItem, "id">) => {
    // Basic check for exact same item to increment quantity instead of new row
    const existingIndex = items.findIndex(
      (i) => i.product.id === item.product.id && 
             JSON.stringify(i.selectedModifiers) === JSON.stringify(item.selectedModifiers) &&
             i.note === item.note
    );

    if (existingIndex >= 0) {
      const newItems = [...items];
      newItems[existingIndex].quantity += item.quantity;
      newItems[existingIndex].itemTotal = (newItems[existingIndex].product.price + newItems[existingIndex].selectedModifiers.reduce((sum, m) => sum + m.modifierPrice, 0)) * newItems[existingIndex].quantity;
      setItems(newItems);
    } else {
      setItems([...items, { ...item, id: Date.now().toString() }]);
    }
  };

  const removeFromCart = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(id);
    setItems(items.map((i) => {
      if (i.id === id) {
        const unitPrice = i.product.price + i.selectedModifiers.reduce((sum, m) => sum + m.modifierPrice, 0);
        return { ...i, quantity, itemTotal: unitPrice * quantity };
      }
      return i;
    }));
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem("fb_cart");
  };

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.itemTotal, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) throw new Error("useCart must be used within a CartProvider");
  return context;
}
