import { getOrdersByUserId } from "@/lib/data";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { verifySession } from "@/lib/dal";

export default async function OrdersPage() {
  const session = await verifySession()

  if (!session?.user) redirect("/login");

  const orders = await getOrdersByUserId(session.user.id);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-neutral-900">Lịch sử đơn hàng</h2>
        <p className="text-sm text-neutral-500">Xem lại các đơn hàng bạn đã đặt.</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-neutral-100 rounded-3xl">
          <p className="text-neutral-500 italic">Bạn chưa có đơn hàng nào.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="group p-5 border border-neutral-100 rounded-2xl hover:border-neutral-200 hover:shadow-sm transition-all bg-white"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-neutral-900">{order.orderNumber}</span>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="text-xs text-neutral-400">
                    {format(new Date(order.createdAt), "HH:mm, dd MMMM yyyy", { locale: vi })}
                  </p>
                </div>

                <div className="flex items-center justify-between md:text-right gap-8">
                  <div className="space-y-0.5">
                    <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Tổng cộng</p>
                    <p className="font-bold text-neutral-900">
                      {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(order.totalAmount)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-neutral-50">
                <p className="text-sm text-neutral-600 line-clamp-1">
                  {order.orderItems.map(item => `${item.quantity}x ${item.product.name}`).join(", ")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { label: string; className: string }> = {
    PENDING: { label: "Chờ xác nhận", className: "bg-amber-50 text-amber-600 border-amber-100" },
    PREPARING: { label: "Đang chuẩn bị", className: "bg-blue-50 text-blue-600 border-blue-100" },
    DELIVERING: { label: "Đang giao hàng", className: "bg-purple-50 text-purple-600 border-purple-100" },
    COMPLETED: { label: "Đã hoàn thành", className: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    CANCELLED: { label: "Đã hủy", className: "bg-neutral-50 text-neutral-400 border-neutral-100" },
  };

  const config = statusConfig[status] || statusConfig.PENDING;

  return (
    <Badge variant="outline" className={`rounded-lg px-2 py-0 border ${config.className}`}>
      {config.label}
    </Badge>
  );
}
