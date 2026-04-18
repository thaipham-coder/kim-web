import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyCallback } from "@/lib/zalopay";
import { sendOrderEmails } from "@/lib/email";
import { sendPushToAdmins, formatVNDForPush } from "@/lib/push";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const dataStr = body.data;
    const reqMac = body.mac;

    const { isValid, data } = verifyCallback(dataStr, reqMac);

    if (!isValid) {
      console.error("ZaloPay Callback MAC Verification Failed");
      return NextResponse.json({ return_code: -1, return_message: "mac not equal" });
    }

    if (!data || !data.app_trans_id) {
       return NextResponse.json({ return_code: 0, return_message: "invalid data" });
    }

    console.log(`ZaloPay Callback Received for ${data.app_trans_id}`);

    // Update Order Status in Database
    const updatedOrder = await prisma.order.updateMany({
      where: { appTransId: data.app_trans_id },
      data: {
        isPaid: true,
        zpTransId: String(data.zp_trans_id),
      },
    });

    if (updatedOrder.count === 0) {
      console.error(`Order not found for appTransId: ${data.app_trans_id}`);
    } else {
      // Gửi email thông báo sau khi thanh toán thành công
      const order = await prisma.order.findFirst({
        where: { appTransId: data.app_trans_id },
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
      if (order) {
        sendOrderEmails(order);

        // Push notification cho admin
        sendPushToAdmins({
          title: `🔔 Thanh toán ZaloPay #${order.orderNumber}`,
          body: `${order.customerName} — ${formatVNDForPush(order.totalAmount)}`,
          url: "/admin/orders",
        });
      }
    }

    return NextResponse.json({
      return_code: 1,
      return_message: "success",
    });
  } catch (error: any) {
    console.error("ZaloPay Callback Error:", error);
    return NextResponse.json({
      return_code: 0,
      return_message: error.message || "exception",
    });
  }
}

