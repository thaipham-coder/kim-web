import prisma from "@/lib/db";
import { updateOrderStatus, deleteOrder } from "./actions";
import { Check, Clock, X, Truck, ChefHat, Trash2 } from "lucide-react";
import Link from "next/link";
import { OrderStatus } from "@/generated/prisma";
import { OrderActions } from "./_components/OrderActions";

export const revalidate = 10; // Auto refresh every 10 seconds

export default async function AdminOrdersPage() {
   const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
         orderItems: {
            include: {
               product: true,
               modifiers: true
            }
         }
      }
   });

   const getStatusBadge = (status: string) => {
      switch (status) {
         case "PENDING": return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 flex items-center gap-1 w-max"><Clock className="w-3 h-3" /> Chờ xác nhận</span>;
         case "PREPARING": return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 flex items-center gap-1 w-max"><ChefHat className="w-3 h-3" /> Đang làm món</span>;
         case "DELIVERING": return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 flex items-center gap-1 w-max"><Truck className="w-3 h-3" /> Đang đi giao</span>;
         case "COMPLETED": return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center gap-1 w-max"><Check className="w-3 h-3" /> Hoàn thành</span>;
         case "CANCELLED": return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 flex items-center gap-1 w-max"><X className="w-3 h-3" /> Đã huỷ</span>;
         default: return <span className="px-2.5 py-1 rounded-full text-xs bg-neutral-100 text-neutral-800 w-max">{status}</span>;
      }
   };

   return (
      <div className="space-y-6">
         <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-neutral-800">Quản lý Đơn hàng</h2>
         </div>

         <div className="grid grid-cols-1 gap-6">
            {orders.map((order: any) => (
               <div key={order.id} className="bg-white rounded-lg border border-neutral-200 overflow-hidden shadow-sm flex flex-col md:flex-row">
                  {/* Lệ trái: Thông tin hiển thị */}
                  <div className="p-6 flex-1 border-b md:border-b-0 md:border-r border-neutral-200">
                     <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                           <span className="font-bold text-lg text-neutral-900 border border-neutral-300 px-2 py-0.5 rounded bg-neutral-50">#{order.orderNumber}</span>
                           {getStatusBadge(order.status)}
                        </div>
                        <span className="text-sm font-medium text-neutral-500">
                           {new Date(order.createdAt).toLocaleString('vi-VN')}
                        </span>
                     </div>

                     <div className="mb-4 bg-neutral-50 p-3 rounded-md border border-neutral-100">
                        <div className="font-semibold text-neutral-800 mb-1">{order.customerName} - {order.customerPhone}</div>
                        <div className="text-sm text-neutral-600">📍 {order.customerAddress}</div>
                        {order.customerNote && <div className="text-sm text-amber-600 mt-2 font-medium">Ghi chú: {order.customerNote}</div>}
                     </div>

                     <div className="space-y-2">
                        <div className="text-xs font-semibold text-neutral-500 uppercase">Chi tiết món:</div>
                        {order.orderItems.map((item: any) => (
                           <div key={item.id} className="text-sm text-neutral-800">
                              <span className="font-medium mr-2">{item.quantity}x</span> {item.product.name}
                              {item.modifiers.length > 0 && (
                                 <span className="text-neutral-500 ml-2">({item.modifiers.map((m: any) => m.modifierName).join(", ")})</span>
                              )}
                              {item.note && <span className="text-amber-600 ml-2 block sm:inline italic">- Note: {item.note}</span>}
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Lệ phải: Trạng thái và Action */}
                  <div className="p-6 md:w-80 bg-neutral-50 flex flex-col justify-between space-y-4">
                     <div>
                        <div className="flex justify-between items-center mb-1">
                           <span className="text-sm text-neutral-600">Tổng tiền:</span>
                           <span className="text-xl font-bold text-red-600">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-sm text-neutral-600">Thanh toán:</span>
                           <span className="text-sm font-medium text-neutral-800">
                              {order.paymentMethod === "COD" ? "Tiền mặt" : order.paymentMethod === "ZALOPAY" ? "ZaloPay" : "Chuyển khoản"}
                              {order.paymentMethod === "ZALOPAY" && (
                                 <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${order.isPaid ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                                    {order.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                                 </span>
                              )}
                           </span>
                        </div>
                     </div>

                     <OrderActions orderId={order.id} status={order.status} />
                  </div>
               </div>
            ))}

            {orders.length === 0 && (
               <div className="bg-white p-12 rounded-lg border border-neutral-200 text-center text-neutral-500 shadow-sm flex flex-col items-center">
                  <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                     <ChefHat className="w-8 h-8 text-neutral-400" />
                  </div>
                  <p className="text-lg font-medium text-neutral-800">Chưa có đơn hàng nào.</p>
                  <p>Cửa hàng chưa có khách đặt món.</p>
               </div>
            )}
         </div>
      </div>
   );
}
