"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/components/CartProvider";
import { PaymentMethod } from "@/generated/prisma";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { HandCoins, Landmark, QrCode, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { createOrder } from "../cart/actions";

export default function CheckoutClient() {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const router = useRouter();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.COD);
  const [isTakeaway, setIsTakeaway] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // ZaloPay QR State
  const [orderUrl, setOrderUrl] = useState<string | null>(null);
  const [appTransId, setAppTransId] = useState<string | null>(null);
  const [zpStatus, setZpStatus] = useState<"pending" | "success" | "failed" | null>(null);

  // Polling for ZaloPay Status
  useEffect(() => {
    if (!appTransId || zpStatus === "success") return;

    const queryStatus = async () => {
      try {
        const res = await fetch("/api/zalopay/query-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ appTransId }),
        });
        const data = await res.json();
        
        if (data.return_code === 1) {
          setZpStatus("success");
          clearCart();
        } else if (data.return_code === 2) {
          setZpStatus("failed");
        }
      } catch (e) {
        console.error("Polling error", e);
      }
    };

    const intervalId = setInterval(queryStatus, 3000);
    return () => clearInterval(intervalId);
  }, [appTransId, zpStatus, clearCart]);

  if (items.length === 0 && !orderUrl && zpStatus !== "success") {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-neutral-100">
        <h2 className="text-2xl font-bold mb-4">Giỏ hàng của bạn đang trống</h2>
        <Link href="/" className="px-6 py-3 bg-neutral-900 text-white rounded-xl font-medium inline-block">
          Quay lại menu
        </Link>
      </div>
    );
  }

  // Khung hiển thị thành công (sau callback thành công)
  if (zpStatus === "success") {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-green-100 shadow-sm max-w-2xl mx-auto">
        <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-neutral-900 mb-4">Thanh toán thành công!</h2>
        <p className="text-neutral-500 mb-8 max-w-md mx-auto">
          Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được thanh toán qua ZaloPay và đang được xử lý.
        </p>
        <Link href="/" className="px-8 py-3.5 bg-neutral-900 text-white rounded-xl font-medium inline-block hover:bg-neutral-800 transition-colors">
          Quay lại trang chủ
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append("cartItems", JSON.stringify(items));
    formData.append("isTakeaway", String(isTakeaway));

    try {
      if (paymentMethod === PaymentMethod.ZALOPAY) {
        // Dùng API Route mới cho ZaloPay
        const jsonData = Object.fromEntries(formData.entries());
        jsonData.cartItems = items as any;
        jsonData.isTakeaway = isTakeaway as any;

        const res = await fetch("/api/zalopay/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(jsonData),
        });

        const data = await res.json();
        if (data.success) {
          setOrderUrl(data.orderUrl);
          setAppTransId(data.appTransId);
          setZpStatus("pending");
        } else {
          setError(data.error || "Có lỗi khi tạo mã QR");
        }
      } else {
        // Flow cũ cho COD, Chuyển khoản
        const result = await createOrder(formData);
        if (result?.error) {
           setError(result.error);
        } else if (result?.success) {
           clearCart();
           // Hiện tại hệ thống chưa có trang checkout success riêng cho COD
           router.push("/"); 
        }
      }
    } catch (err: any) {
      setError("Có lỗi kết nối. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Form Area */}
      <div className="w-full lg:w-2/3">
        {orderUrl ? (
          <div className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-sm flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
              <QrCode className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Thanh toán qua ZaloPay</h2>
            <p className="text-neutral-500 mb-8 text-center max-w-sm">
              Sử dụng ứng dụng Zalo hoặc ZaloPay để quét mã QR bên dưới và hoàn tất thanh toán.
            </p>
            
            <div className="p-4 bg-white border-2 border-dashed border-blue-200 rounded-3xl mb-8">
               <QRCodeSVG value={orderUrl} size={256} className="rounded-xl" />
            </div>

            <div className="flex items-center gap-3 text-blue-600 bg-blue-50 px-4 py-3 rounded-xl font-medium">
               <Loader2 className="w-5 h-5 animate-spin" />
               Đang chờ Quý khách thanh toán...
            </div>

            {zpStatus === "failed" && (
              <div className="mt-6 text-red-600 bg-red-50 p-4 rounded-xl text-center w-full max-w-md">
                Giao dịch bị từ chối hoặc thất bại. Vui lòng thử lại.
              </div>
            )}
            
            <button 
              onClick={() => { setOrderUrl(null); setZpStatus(null); }}
              className="mt-8 text-neutral-500 hover:text-neutral-900 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Chọn phương thức khác
            </button>
          </div>
        ) : (
          <form id="checkout-form" onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-sm space-y-8">
            {error && (
              <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
              </div>
            )}

            <div>
              <h2 className="text-xl font-bold text-neutral-900 mb-6">Thông tin giao hàng</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Họ tên *</label>
                  <input required name="customerName" type="text" className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-shadow bg-neutral-50 focus:bg-white" placeholder="Nguyễn Văn A" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Số điện thoại *</label>
                  <input required name="customerPhone" type="tel" className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-shadow bg-neutral-50 focus:bg-white" placeholder="0901234567" />
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-4 mb-3">
                  <label className="block text-sm font-medium text-neutral-700">Hình thức nhận</label>
                  <div className="flex bg-neutral-100 p-1 rounded-lg">
                    <button type="button" onClick={() => setIsTakeaway(false)} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${!isTakeaway ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'}`}>Giao tận nơi</button>
                    <button type="button" onClick={() => setIsTakeaway(true)} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${isTakeaway ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'}`}>Nhận tại quán</button>
                  </div>
                </div>

                {!isTakeaway && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Địa chỉ nhận hàng *</label>
                    <input required={!isTakeaway} name="customerAddress" type="text" className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-shadow bg-neutral-50 focus:bg-white" placeholder="Số 1, Đường 2, Phường 3..." />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Ghi chú thêm</label>
                <textarea name="customerNote" rows={3} className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-shadow bg-neutral-50 focus:bg-white resize-none" placeholder="Ví dụ: Lấy nhiều đá, giao qua hẻm..." />
              </div>
            </div>

            {/* Payment Method Section */}
            <div>
              <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">Phương thức thanh toán</h2>
              <input type="hidden" name="paymentMethod" value={paymentMethod} />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === PaymentMethod.COD ? 'border-neutral-900 bg-neutral-50/50' : 'border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50/50'} group`}>
                  <HandCoins className={`w-8 h-8 mb-3 transition-colors ${paymentMethod === PaymentMethod.COD ? 'text-neutral-900' : 'text-neutral-400 group-hover:text-neutral-600'}`} />
                  <span className={`font-medium text-center ${paymentMethod === PaymentMethod.COD ? 'text-neutral-900' : 'text-neutral-500'}`}>Tiền mặt (COD)</span>
                  <input type="radio" className="sr-only" name="paymentType" checked={paymentMethod === PaymentMethod.COD} onChange={() => setPaymentMethod(PaymentMethod.COD)} />
                </label>
                
                <label className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === PaymentMethod.BANK_TRANSFER ? 'border-neutral-900 bg-neutral-50/50' : 'border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50/50'} group`}>
                  <Landmark className={`w-8 h-8 mb-3 transition-colors ${paymentMethod === PaymentMethod.BANK_TRANSFER ? 'text-neutral-900' : 'text-neutral-400 group-hover:text-neutral-600'}`} />
                  <span className={`font-medium text-center ${paymentMethod === PaymentMethod.BANK_TRANSFER ? 'text-neutral-900' : 'text-neutral-500'}`}>Chuyển khoản</span>
                  <input type="radio" className="sr-only" name="paymentType" checked={paymentMethod === PaymentMethod.BANK_TRANSFER} onChange={() => setPaymentMethod(PaymentMethod.BANK_TRANSFER)} />
                </label>

                <label className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === PaymentMethod.ZALOPAY ? 'border-blue-500 bg-blue-50/30' : 'border-neutral-100 hover:border-blue-200 hover:bg-blue-50/10'} group`}>
                  <span className={`absolute top-0 right-0 py-0.5 px-2.5 bg-red-500 text-white text-[10px] font-bold tracking-wider rounded-bl-xl rounded-tr-xl uppercase shadow-sm ${paymentMethod === PaymentMethod.ZALOPAY ? '' : 'opacity-80'}`}>Hot</span>
                  <QrCode className={`w-8 h-8 mb-3 transition-colors ${paymentMethod === PaymentMethod.ZALOPAY ? 'text-blue-600' : 'text-blue-300 group-hover:text-blue-500'}`} />
                  <span className={`font-medium text-center ${paymentMethod === PaymentMethod.ZALOPAY ? 'text-blue-700' : 'text-neutral-500 group-hover:text-blue-600'}`}>ZaloPay QR</span>
                  <input type="radio" className="sr-only" name="paymentType" checked={paymentMethod === PaymentMethod.ZALOPAY} onChange={() => setPaymentMethod(PaymentMethod.ZALOPAY)} />
                </label>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Summary Sidebar */}
      <div className="w-full lg:w-1/3">
        <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-sm sticky top-24">
          <h3 className="font-bold text-lg text-neutral-900 mb-4 flex items-center justify-between">
            Đơn hàng của bạn
            <Link href="/cart" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">Sửa</Link>
          </h3>
          
          <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3 items-start">
                <div className="flex-1">
                  <div className="font-medium text-neutral-900 text-sm">{item.quantity} x {item.product.name}</div>
                  {item.selectedModifiers.length > 0 && (
                    <div className="text-xs text-neutral-500 line-clamp-1">
                      {item.selectedModifiers.map(m => m.modifierName).join(", ")}
                    </div>
                  )}
                </div>
                <div className="font-medium text-sm text-neutral-900">
                  {new Intl.NumberFormat('vi-VN').format(item.itemTotal)}đ
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3 pt-4 border-t border-neutral-100 pb-4">
             <div className="flex justify-between text-neutral-600 text-sm">
                <span>Tạm tính ({totalItems} món)</span>
                <span>{new Intl.NumberFormat('vi-VN').format(totalPrice)}đ</span>
             </div>
             <div className="flex justify-between text-neutral-600 text-sm">
                <span>Phí vận chuyển</span>
                <span>Đang tính...</span>
             </div>
          </div>
          <div className="flex justify-between items-end pt-4 border-t border-neutral-100 mb-6">
             <span className="font-medium text-neutral-900">Tổng cộng</span>
             <span className="text-2xl font-bold text-red-600">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}</span>
          </div>

          {!orderUrl && (
            <button 
              type="submit" 
              form="checkout-form"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-4 bg-neutral-900 text-white font-medium rounded-xl hover:bg-neutral-800 transition-colors shadow-md disabled:bg-neutral-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Đặt Hàng & Thanh toán"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
