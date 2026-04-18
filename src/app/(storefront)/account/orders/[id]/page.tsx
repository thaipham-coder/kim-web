import prisma from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { Check, Clock, Truck, ChefHat } from "lucide-react";
import Link from "next/link";
import StorefrontNavbar from "@/components/StorefrontNavbar";
import { verifySession } from "@/lib/dal";

export const revalidate = 10; // Auto refresh 10s

export default async function OrderStatusPage({ params }: { params: { id: string } }) {
   const session = await verifySession()
   if (!session?.user) redirect("/login");

   const { id } = await params;

   const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
         orderItems: {
            include: { product: true, modifiers: true }
         }
      }
   });

   if (!order) return notFound();

   // Progress logic ...
   const steps = [
      { status: "PENDING", label: "Chờ xác nhận", icon: Clock },
      { status: "PREPARING", label: "Đang làm món", icon: ChefHat },
      { status: "DELIVERING", label: "Đang giao", icon: Truck },
      { status: "COMPLETED", label: "Hoàn thành", icon: Check },
   ];

   const currentStepIndex = order.status === "CANCELLED" ? -1 : steps.findIndex(s => s.status === order.status);

   return (
         <div className="min-h-screen bg-neutral-50 pb-20">
            <StorefrontNavbar user={session.user} />

            <main className="max-w-2xl mx-auto px-4 py-8">
               <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-neutral-100 mb-6">
                  <div className="text-center mb-8">
                     <h1 className="text-2xl font-bold text-neutral-900">Chi tiết Đơn hàng</h1>
                     <p className="text-neutral-500 mt-1">Mã đơn: #{order.orderNumber}</p>
                  </div>

                  {order.status === "CANCELLED" ? (
                     <div className="bg-red-50 text-red-700 p-4 rounded-xl text-center font-medium border border-red-100 mb-8">
                        Đơn hàng này đã bị huỷ.
                     </div>
                  ) : (
                     <div className="mb-10 relative">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-neutral-100 -translate-y-1/2 z-0 rounded-full"></div>
                        <div
                           className="absolute top-1/2 left-0 h-1 bg-neutral-900 -translate-y-1/2 z-0 rounded-full transition-all duration-500"
                           style={{ width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%` }}
                        ></div>

                        <div className="flex justify-between relative z-10 w-full">
                           {steps.map((step, index) => {
                              const Icon = step.icon;
                              const isCompleted = index <= currentStepIndex;
                              const isCurrent = index === currentStepIndex;

                              return (
                                 <div key={step.status} className="flex flex-col items-center gap-2">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors border-2 ${isCompleted ? 'bg-neutral-900 border-neutral-900 text-white' : 'bg-white border-neutral-200 text-neutral-400'
                                       } ${isCurrent ? 'ring-4 ring-neutral-200' : ''}`}>
                                       <Icon className="w-5 h-5" />
                                    </div>
                                    <span className={`text-xs font-semibold hidden md:block ${isCompleted ? 'text-neutral-900' : 'text-neutral-400'}`}>
                                       {step.label}
                                    </span>
                                 </div>
                              );
                           })}
                        </div>
                     </div>
                  )}

                  <div className="space-y-4">
                     <h3 className="font-bold text-lg text-neutral-900">Thông tin giao hàng</h3>
                     <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100 text-sm">
                        <p><span className="text-neutral-500 w-24 inline-block">Người nhận:</span> <span className="font-medium text-neutral-900">{order.customerName}</span></p>
                        <p className="mt-2"><span className="text-neutral-500 w-24 inline-block">Điện thoại:</span> <span className="font-medium text-neutral-900">{order.customerPhone}</span></p>
                        <p className="mt-2"><span className="text-neutral-500 w-24 inline-block">Địa chỉ:</span> <span className="font-medium text-neutral-900">{order.customerAddress || "Lấy tại quán"}</span></p>
                        <p className="mt-2"><span className="text-neutral-500 w-24 inline-block">Ghi chú:</span> <span className="font-medium text-neutral-900">{order.customerNote || "Không có"}</span></p>
                     </div>
                  </div>

                  <div className="mt-8">
                     <h3 className="font-bold text-lg text-neutral-900 mb-4">Các món đã đặt</h3>
                     <div className="space-y-4">
                        {order.orderItems.map((item: any) => (
                           <div key={item.id} className="flex justify-between pb-4 border-b border-neutral-100 last:border-0">
                              <div>
                                 <div className="font-medium text-neutral-900"><span className="text-neutral-500 mr-2">{item.quantity}x</span> {item.product.name}</div>
                                 {item.modifiers.length > 0 && (
                                    <div className="text-xs text-neutral-500 mt-1 pl-6">
                                       {item.modifiers.map((m: any) => m.modifierName).join(", ")}
                                    </div>
                                 )}
                                 {item.note && (
                                    <div className="text-xs text-amber-600 mt-1 pl-6 italic">- {item.note}</div>
                                 )}
                              </div>
                              <div className="font-medium whitespace-nowrap ml-4">
                                 {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                                    (item.priceAtTime + item.modifiers.reduce((sum: number, m: any) => sum + m.modifierPrice, 0)) * item.quantity
                                 )}
                              </div>
                           </div>
                        ))}
                     </div>

                     <div className="pt-4 border-t border-neutral-200 mt-4">
                        <div className="flex justify-between items-center text-lg font-bold">
                           <span>Tổng thanh toán</span>
                           <span className="text-red-600">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}</span>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="text-center">
                  <Link href="/" className="inline-block px-6 py-3 bg-neutral-900 text-white font-medium rounded-xl hover:bg-neutral-800 transition-colors shadow-sm">
                     Tiếp tục đặt món
                  </Link>
               </div>
            </main>
         </div>

   );
}
