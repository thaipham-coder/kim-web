import { Metadata } from 'next';
import CheckoutClient from './CheckoutClient';

export const metadata: Metadata = {
  title: 'Thanh toán',
};

export default function CheckoutPage() {
  return (
      <div className="max-w-7xl mx-auto px-4 py-8 mt-16">
        <h1 className="text-3xl font-bold text-neutral-900 mb-8">Thanh toán đơn hàng</h1>
        <CheckoutClient />
      </div>
  );
}
