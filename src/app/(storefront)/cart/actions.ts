"use server";

import prisma from "@/lib/db";
import { OrderStatus, PaymentMethod } from "@/generated/prisma";
import { verifySession } from "@/lib/dal";

export async function createOrder(formData: FormData) {
  try {
    const customerName = formData.get("customerName") as string;
    const customerPhone = formData.get("customerPhone") as string;
    const isTakeaway = formData.get("isTakeaway") === "true";
    const customerAddress = isTakeaway ? "Nhận tại quán" : (formData.get("customerAddress") as string);
    const customerNote = formData.get("customerNote") as string;
    const paymentMethod = formData.get("paymentMethod") as PaymentMethod;

    const cartItemsRaw = formData.get("cartItems") as string;
    const cartItems = JSON.parse(cartItemsRaw);

    if (!customerName || !customerPhone || cartItems.length === 0) {
      return { error: "Vui lòng nhập đầy đủ thông tin" };
    }

    const totalAmount = cartItems.reduce((sum: number, item: any) => sum + item.itemTotal, 0);

    // Generate Order Number
    const count = await prisma.order.count();
    const orderNumber = `ORD-${new Date().getTime().toString().slice(-4)}${(count + 1).toString().padStart(3, '0')}`;

    // Lấy session để gắn userId (cho phép đặt hàng khi chưa đăng nhập)
    const session = await verifySession()

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session?.user?.id || null,
        customerName,
        customerPhone,
        customerAddress,
        customerNote,
        totalAmount,
        paymentMethod,
        status: OrderStatus.PENDING,
        orderItems: {
          create: cartItems.map((item: any) => ({
            productId: item.product.id,
            quantity: item.quantity,
            priceAtTime: item.product.price,
            note: item.note,
            modifiers: {
              create: item.selectedModifiers.map((mod: any) => ({
                modifierItemId: mod.modifierItemId,
                modifierName: mod.modifierName,
                modifierPrice: mod.modifierPrice
              }))
            }
          }))
        }
      }
    });

    return { success: true, orderId: order.id, orderNumber: order.orderNumber };

  } catch (error) {
    console.error(error);
    return { error: "Có lỗi khi tạo đơn hàng. Vui lòng thử lại!" };
  }
}
