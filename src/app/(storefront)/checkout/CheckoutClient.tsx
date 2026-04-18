"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/store/cartStore";
import { PaymentMethod } from "@/generated/prisma";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, CheckCircle2, MapPin } from "lucide-react";
import Link from "next/link";
import { createOrder } from "../cart/actions";
import { getCheckoutUserInfo } from "./actions";

interface UserAddress {
  id: string;
  label: string;
  address: string;
  isDefault: boolean;
}

interface CheckoutUserInfo {
  name: string | null;
  phone: string | null;
  addresses: UserAddress[];
}

export default function CheckoutClient() {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const router = useRouter();

  const [isTakeaway, setIsTakeaway] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // User info state
  const [userInfo, setUserInfo] = useState<CheckoutUserInfo | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // Fetch user info on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const info = await getCheckoutUserInfo();
        if (info) {
          setUserInfo(info);
          // Chọn địa chỉ mặc định
          const defaultAddr = info.addresses.find((a: UserAddress) => a.isDefault);
          if (defaultAddr) setSelectedAddressId(defaultAddr.id);
          else if (info.addresses.length > 0) setSelectedAddressId(info.addresses[0].id);
        }
      } catch {
        // Cho phép checkout không cần đăng nhập
      } finally {
        setIsLoadingUser(false);
      }
    };
    fetchUser();
  }, []);

  if (items.length === 0 && !orderSuccess) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-neutral-100">
        <h2 className="text-2xl font-bold mb-4">Giỏ hàng của bạn đang trống</h2>
        <Link href="/" className="px-6 py-3 bg-neutral-900 text-white rounded-xl font-medium inline-block">
          Quay lại menu
        </Link>
      </div>
    );
  }

  // Khung hiển thị thành công
  if (orderSuccess) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-green-100 shadow-sm max-w-2xl mx-auto">
        <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-neutral-900 mb-4">Đặt hàng thành công!</h2>
        <p className="text-neutral-500 mb-8 max-w-md mx-auto">
          Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được tiếp nhận và đang được xử lý. Bạn sẽ thanh toán khi nhận hàng.
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
    formData.set("paymentMethod", PaymentMethod.COD);

    // Nếu giao tận nơi, lấy địa chỉ đã chọn
    if (!isTakeaway && selectedAddressId && userInfo) {
      const selected = userInfo.addresses.find((a) => a.id === selectedAddressId);
      if (selected) {
        formData.set("customerAddress", selected.address);
      }
    }

    try {
      const result = await createOrder(formData);
      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        clearCart();
        setOrderSuccess(true);
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
                <input
                  required
                  name="customerName"
                  type="text"
                  defaultValue={userInfo?.name || ""}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-shadow bg-neutral-50 focus:bg-white"
                  placeholder="Nguyễn Văn A"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Số điện thoại *</label>
                <input
                  required
                  name="customerPhone"
                  type="tel"
                  defaultValue={userInfo?.phone || ""}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-shadow bg-neutral-50 focus:bg-white"
                  placeholder="0901234567"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email <span className="text-neutral-400 font-normal">(để nhận thông báo đơn hàng)</span></label>
              <input
                name="customerEmail"
                type="email"
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-shadow bg-neutral-50 focus:bg-white"
                placeholder="email@example.com"
              />
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-4 mb-3">
                <label className="block text-sm font-medium text-neutral-700">Hình thức nhận</label>
                <div className="flex bg-neutral-100 p-1 rounded-lg">
                  <button type="button" onClick={() => setIsTakeaway(false)} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${!isTakeaway ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'}`}>Nhận tại quán</button>
                  <button type="button" onClick={() => setIsTakeaway(true)} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${isTakeaway ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'}`}>Giao tận nơi</button>
                </div>
              </div>

              {isTakeaway && (
                <div className="space-y-3">
                  {isLoadingUser ? (
                    <div className="flex items-center gap-2 text-neutral-400 text-sm py-4">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang tải địa chỉ...
                    </div>
                  ) : userInfo && userInfo.addresses.length > 0 ? (
                    <>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">Chọn địa chỉ giao hàng *</label>
                      <div className="space-y-2">
                        {userInfo.addresses.map((addr) => (
                          <label
                            key={addr.id}
                            className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${selectedAddressId === addr.id
                              ? "border-neutral-900 bg-neutral-50"
                              : "border-neutral-100 hover:border-neutral-300 bg-white"
                              }`}
                          >
                            <input
                              type="radio"
                              name="addressSelection"
                              value={addr.id}
                              checked={selectedAddressId === addr.id}
                              onChange={() => setSelectedAddressId(addr.id)}
                              className="mt-0.5 accent-neutral-900"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm text-neutral-900">{addr.label}</span>
                                {addr.isDefault && (
                                  <span className="text-[10px] font-bold bg-neutral-200 text-neutral-600 px-1.5 py-0.5 rounded-full">Mặc định</span>
                                )}
                              </div>
                              <p className="text-sm text-neutral-600 mt-0.5">{addr.address}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                      {/* Hidden input to hold selected address */}
                      <input type="hidden" name="customerAddress" value={userInfo.addresses.find(a => a.id === selectedAddressId)?.address || ""} />
                    </>
                  ) : (
                    <div className="p-4 rounded-xl border border-dashed border-neutral-200 bg-neutral-50 text-center">
                      <MapPin className="w-6 h-6 text-neutral-300 mx-auto mb-2" />
                      <p className="text-sm text-neutral-500 mb-3">
                        {userInfo ? "Bạn chưa có địa chỉ nào được lưu." : "Đăng nhập để sử dụng địa chỉ đã lưu."}
                      </p>
                      {userInfo ? (
                        <Link href="/account/profile" className="text-sm font-medium text-neutral-900 underline underline-offset-4 hover:text-neutral-700">
                          Thêm địa chỉ trong hồ sơ
                        </Link>
                      ) : (
                        <>
                          <label className="block text-sm font-medium text-neutral-700 mb-1.5 text-left mt-3">Địa chỉ nhận hàng *</label>
                          <input
                            required={isTakeaway}
                            name="customerAddress"
                            type="text"
                            className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-shadow bg-white focus:bg-white"
                            placeholder="Số 1, Đường 2, Phường 3..."
                          />
                        </>
                      )}
                    </div>
                  )}
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 cursor-pointer transition-all border-green-500 bg-green-50/30 group">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">💵</span>
                </div>
                <span className="font-medium text-center text-green-700">Thanh toán khi nhận hàng (COD)</span>
                <input type="radio" className="sr-only" name="paymentType" checked readOnly />
              </label>
            </div>
          </div>
        </form>
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
          </div>
          <div className="flex justify-between items-end pt-4 border-t border-neutral-100 mb-6">
            <span className="font-medium text-neutral-900">Tổng cộng</span>
            <span className="text-2xl font-bold text-red-600">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}</span>
          </div>

          <button
            type="submit"
            form="checkout-form"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-4 bg-neutral-900 text-white font-medium rounded-xl hover:bg-neutral-800 transition-colors shadow-md disabled:bg-neutral-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Đặt Hàng"}
          </button>
        </div>
      </div>
    </div>
  );
}
