import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createZaloPayOrder } from "@/lib/zalopay";
import { OrderStatus, PaymentMethod } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerPhone,
      isTakeaway,
      customerAddress,
      customerNote,
      cartItems,
    } = body;

    if (!customerName || !customerPhone || !cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: "Vui lòng nhập đầy đủ thông tin" },
        { status: 400 }
      );
    }

    const address = isTakeaway ? "Nhận tại quán" : customerAddress;
    const totalAmount = cartItems.reduce(
      (sum: number, item: any) => sum + item.itemTotal,
      0
    );

    // Generate Order Number
    const count = await prisma.order.count();
    const orderNumber = `ORD-${new Date().getTime().toString().slice(-4)}${(
      count + 1
    ).toString().padStart(3, "0")}`;

    // 0. Lấy session để gắn userId (cho phép đặt hàng khi chưa đăng nhập)
    const session = await auth.api.getSession({ headers: await headers() });

    // 1. Tạo đơn hàng PENDING trong database
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session?.user?.id || null,
        customerName,
        customerPhone,
        customerAddress: address,
        customerNote,
        totalAmount,
        paymentMethod: PaymentMethod.ZALOPAY,
        status: OrderStatus.PENDING,
        isPaid: false,
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
                modifierPrice: mod.modifierPrice,
              })),
            },
          })),
        },
      },
    });

    // 2. Chẩn bị data item cho ZaloPay
    const zpItems = cartItems.map((item: any) => ({
      itemid: String(item.product.id),
      itemname: item.product.name,
      itemprice: item.product.price,
      itemquantity: item.quantity,
    }));

    // 3. Gọi ZaloPay CreateOrder API
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const callbackUrl = `${appUrl}/api/zalopay/callback`;

    const zpResult = await createZaloPayOrder({
      amount: totalAmount,
      description: `Thanh toán đơn hàng ${orderNumber}`,
      items: zpItems,
      callbackUrl,
    });

    if (zpResult.return_code !== 1) {
      console.error("ZaloPay Create Order Failed:", zpResult);
      return NextResponse.json(
        { error: "Lỗi kết nối cổng thanh toán", details: zpResult },
        { status: 400 }
      );
    }

    // 4. Cập nhật appTransId vào database
    await prisma.order.update({
      where: { id: order.id },
      data: { appTransId: zpResult.app_trans_id },
    });

    // 5. Trả về order_url để frontend render QR Code
    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber,
      appTransId: zpResult.app_trans_id,
      orderUrl: zpResult.order_url,
    });
  } catch (error) {
    console.error("Create ZaloPay Order Error:", error);
    return NextResponse.json(
      { error: "Có lỗi khi tạo đơn hàng. Vui lòng thử lại!" },
      { status: 500 }
    );
  }
}
