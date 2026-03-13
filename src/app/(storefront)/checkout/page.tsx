import { Metadata } from 'next';
import { CartProvider } from "@/components/CartProvider";
import CheckoutClient from './CheckoutClient';

export const metadata: Metadata = {
  title: 'Thanh toán',
};

export default function CheckoutPage() {
  return (
    <CartProvider>
      <div className="max-w-7xl mx-auto px-4 py-8 mt-16 md:mt-24">
        <h1 className="text-3xl font-bold text-neutral-900 mb-8">Thanh toán đơn hàng</h1>
        <CheckoutClient />
      </div>
    </CartProvider>
  );
}
