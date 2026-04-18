import prisma from "@/lib/db";
import { columns, Order } from "./_components/columns"
import { OrderTable } from "./_components/data-table"
import { ChefHat } from "lucide-react";

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
   }) as unknown as Order[];

   return (
      <div className="space-y-6">
         <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-neutral-800">Quản lý Đơn hàng</h2>
         </div>

         <OrderTable columns={columns} data={orders} />

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
   );
}
