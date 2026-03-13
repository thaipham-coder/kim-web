"use server";

import prisma from "@/lib/db";
import { OrderStatus } from "@/generated/prisma";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(id: number, status: OrderStatus) {
  try {
    await prisma.order.update({
      where: { id },
      data: { status }
    });
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Không thể cập nhật trạng thái đơn hàng." };
  }
}

export async function deleteOrder(id: number) {
  try {
    await prisma.order.delete({
      where: { id }
    });
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Không thể xóa đơn hàng." };
  }
}
