"use client";

import { useCart } from "@/components/CartProvider";
import { Plus, Minus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPageClient() {
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();
  const router = useRouter();

  if (items.length === 0) {
     return (
        <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-neutral-100 flex flex-col items-center">
           <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
           </div>
           <h2 className="text-2xl font-bold text-neutral-900 mb-2">Giỏ hàng trống</h2>
           <p className="text-neutral-500 mb-8 max-w-sm">Hãy quay lại menu và chọn những món đồ uống thật ngon cho mình nhé.</p>
           <Link href="/" className="px-6 py-3 bg-neutral-900 text-white font-medium rounded-xl hover:bg-neutral-800 transition-colors shadow-sm">
              Xem Menu Quán
           </Link>
        </div>
     );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
       <div className="w-full lg:w-2/3 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-neutral-100">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
             Giỏ hàng của bạn <span className="text-sm font-medium text-neutral-500 bg-neutral-100 px-2 py-1 rounded-full">({totalItems} món)</span>
          </h2>

          <div className="space-y-6">
             {items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-6 border-b border-neutral-100 last:border-0 last:pb-0">
                   <div className="w-20 h-20 md:w-24 md:h-24 bg-neutral-100 rounded-2xl flex-shrink-0 overflow-hidden relative">
                      {item.product.image ? (
                         <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                      ) : (
                         <div className="w-full h-full flex items-center justify-center text-neutral-300">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                         </div>
                      )}
                   </div>
                   
                   <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                         <div>
                            <h3 className="font-bold text-neutral-900 line-clamp-2 md:line-clamp-1 pr-4">{item.product.name}</h3>
                            {item.selectedModifiers.length > 0 && (
                               <div className="text-sm text-neutral-500 mt-1">
                                  {item.selectedModifiers.map(m => m.modifierName).join(", ")}
                               </div>
                            )}
                            {item.note && (
                               <div className="text-sm text-amber-600 mt-1 italic">- {item.note}</div>
                            )}
                         </div>
                         <button onClick={() => removeFromCart(item.id)} className="text-neutral-300 hover:text-red-500 transition-colors p-1">
                            <Trash2 className="w-5 h-5" />
                         </button>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                         <div className="font-bold text-neutral-900">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.itemTotal)}
                         </div>

                         <div className="flex items-center gap-3">
                            <div className="flex items-center border border-neutral-200 rounded-lg p-0.5 bg-neutral-50">
                               <button 
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="w-8 h-8 flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 rounded-md transition-colors"
                               >
                                  <Minus className="w-3 h-3" />
                               </button>
                               <span className="w-8 text-center font-semibold text-sm">{item.quantity}</span>
                               <button 
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-8 h-8 flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 rounded-md transition-colors"
                               >
                                  <Plus className="w-3 h-3" />
                               </button>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             ))}
          </div>
       </div>

       {/* Checkout summary */}
       <div className="w-full lg:w-1/3 bg-white rounded-3xl p-6 shadow-sm border border-neutral-100 lg:sticky top-24">
          <h3 className="font-bold text-lg text-neutral-900 mb-4">Tổng quan</h3>
          <div className="space-y-3 pb-4 border-b border-neutral-100">
             <div className="flex justify-between text-neutral-600">
                <span>Tạm tính ({totalItems} món)</span>
                <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}</span>
             </div>
          </div>
          <div className="flex justify-between items-center py-4 font-bold text-lg text-neutral-900">
             <span>Tổng cộng</span>
             <span className="text-red-600">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}</span>
          </div>

          <Link href="/checkout" className="w-full block text-center py-3.5 bg-neutral-900 text-white font-medium rounded-xl hover:bg-neutral-800 transition-colors shadow-md">
             Tiếp tục thanh toán
          </Link>
       </div>
    </div>
  );
}
