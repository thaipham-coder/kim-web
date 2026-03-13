"use client";

import { useState } from "react";
import { updateOrderStatus, deleteOrder } from "../actions";
import { OrderStatus } from "@/generated/prisma";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderActionsProps {
  orderId: number;
  status: OrderStatus;
}

export function OrderActions({ orderId, status }: OrderActionsProps) {
  const [isPending, setIsPending] = useState(false);

  async function handleUpdateStatus(newStatus: OrderStatus) {
    setIsPending(true);
    const result = await updateOrderStatus(orderId, newStatus);
    setIsPending(false);

    if (result?.success) {
      toast.success("Đã cập nhật trạng thái đơn hàng");
    } else {
      toast.error(result?.error || "Lỗi cập nhật trạng thái");
    }
  }

  async function handleDelete() {
    if (!confirm("Bạn có chắc chắn muốn xoá vĩnh viễn đơn hàng này?")) return;

    setIsPending(true);
    const result = await deleteOrder(orderId);
    setIsPending(false);

    if (result?.success) {
      toast.success("Đã xoá đơn hàng");
    } else {
      toast.error(result?.error || "Lỗi khi xoá đơn hàng");
    }
  }

  return (
    <div className="space-y-2 relative h-full flex flex-col justify-end">
      {status === "PENDING" && (
        <button
          onClick={() => handleUpdateStatus(OrderStatus.PREPARING)}
          disabled={isPending}
          className="w-full py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition disabled:opacity-50"
        >
          Xác nhận & Làm món
        </button>
      )}
      {status === "PREPARING" && (
        <button
          onClick={() => handleUpdateStatus(OrderStatus.DELIVERING)}
          disabled={isPending}
          className="w-full py-2 bg-purple-600 text-white rounded-md font-medium hover:bg-purple-700 transition disabled:opacity-50"
        >
          Giao cho khách
        </button>
      )}
      {status === "DELIVERING" && (
        <button
          onClick={() => handleUpdateStatus(OrderStatus.COMPLETED)}
          disabled={isPending}
          className="w-full py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition disabled:opacity-50"
        >
          Hoàn thành Đơn
        </button>
      )}
      {(status === "PENDING" || status === "PREPARING") && (
        <button
          onClick={() => handleUpdateStatus(OrderStatus.CANCELLED)}
          disabled={isPending}
          className="w-full py-2 bg-red-100 text-red-700 rounded-md font-medium hover:bg-red-200 transition disabled:opacity-50"
        >
          Huỷ đơn
        </button>
      )}

      <div className="absolute top-0 right-0 md:static flex justify-end mt-4">
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="p-2 text-neutral-400 hover:text-red-600 rounded-full hover:bg-red-50 transition border border-transparent hover:border-red-100 disabled:opacity-50"
          title="Xoá vĩnh viễn"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
