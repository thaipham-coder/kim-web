"use server";

import prisma from "@/lib/db";
import { OrderStatus } from "@/generated/prisma";
import { revalidatePath } from "next/cache";
import { verifyAdmin } from "@/lib/dal";
import { sendOrderStatusUpdateEmail } from "@/lib/email";

export async function updateOrderStatus(id: number, status: OrderStatus) {
  await verifyAdmin();
  try {
    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        user: { select: { email: true } },
        orderItems: {
          include: {
            product: true,
            modifiers: true,
          },
        },
      },
    });

    // Gửi email thông báo trạng thái cho khách hàng (fire-and-forget)
    sendOrderStatusUpdateEmail(order);

    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Không thể cập nhật trạng thái đơn hàng." };
  }
}

export async function deleteOrder(id: number) {
  await verifyAdmin();
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

