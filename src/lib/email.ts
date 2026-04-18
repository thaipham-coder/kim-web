import { Resend } from "resend";
import { OrderConfirmation } from "@/emails/order-confirmation";
import { NewOrderNotification } from "@/emails/new-order-notification";
import { OrderStatusUpdate } from "@/emails/order-status-update";
import { format } from "date-fns";

// ======================================
// Resend Client
// ======================================

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_ADDRESS = `${process.env.SHOP_NAME || "Kim Cafe"} <no-reply@notify.kimcafe.biz.vn>`;
const SHOP_NAME = process.env.SHOP_NAME || "Kim Cafe";
const SHOP_OWNER_EMAIL = process.env.SHOP_OWNER_EMAIL || "order@kimcafe.biz.vn";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// ======================================
// Types
// ======================================

interface OrderItemWithDetails {
  quantity: number;
  priceAtTime: number;
  note?: string | null;
  product: {
    name: string;
  };
  modifiers: Array<{
    modifierName: string;
    modifierPrice: number;
  }>;
}

interface OrderWithDetails {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  customerAddress?: string | null;
  customerNote?: string | null;
  totalAmount: number;
  paymentMethod: string;
  isPaid: boolean;
  status: string;
  createdAt: Date;
  user?: { email: string } | null;
  orderItems: OrderItemWithDetails[];
}

// ======================================
// Helper: Transform order items for email
// ======================================

function transformItems(orderItems: OrderItemWithDetails[]) {
  return orderItems.map((item) => ({
    productName: item.product.name,
    quantity: item.quantity,
    price: item.priceAtTime + item.modifiers.reduce((sum, m) => sum + m.modifierPrice, 0),
    modifiers: item.modifiers.map((m) => m.modifierName),
  }));
}

function getCustomerEmail(order: OrderWithDetails): string | null {
  return order.customerEmail || order.user?.email || null;
}

// ======================================
// Email #1: Order Confirmation → Customer
// ======================================

export async function sendOrderConfirmationEmail(order: OrderWithDetails) {
  const customerEmail = getCustomerEmail(order);
  if (!customerEmail) {
    console.log(`[Email] Skipping order confirmation for #${order.orderNumber}: no customer email`);
    return;
  }

  try {
    const { data, error } = await resend.emails.send(
      {
        from: FROM_ADDRESS,
        to: [customerEmail],
        subject: `✅ Xác nhận đơn hàng #${order.orderNumber} - ${SHOP_NAME}`,
        react: OrderConfirmation({
          shopName: SHOP_NAME,
          orderNumber: order.orderNumber,
          orderDate: format(order.createdAt, "dd/MM/yyyy HH:mm"),
          customerName: order.customerName,
          customerPhone: order.customerPhone,
          customerAddress: order.customerAddress || "Nhận tại quán",
          customerNote: order.customerNote || undefined,
          paymentMethod: order.paymentMethod,
          items: transformItems(order.orderItems),
          totalAmount: order.totalAmount,
        }),
      },
      { idempotencyKey: `order-confirm/${order.id}` }
    );

    if (error) {
      console.error(`[Email] Failed to send order confirmation #${order.orderNumber}:`, error.message);
    } else {
      console.log(`[Email] Order confirmation sent for #${order.orderNumber} to ${customerEmail} (${data?.id})`);
    }
  } catch (err) {
    console.error(`[Email] Exception sending order confirmation #${order.orderNumber}:`, err);
  }
}

// ======================================
// Email #2: New Order Notification → Shop Owner
// ======================================

export async function sendNewOrderNotification(order: OrderWithDetails) {
  try {
    const { data, error } = await resend.emails.send(
      {
        from: FROM_ADDRESS,
        to: [SHOP_OWNER_EMAIL],
        subject: `🔔 Đơn hàng mới #${order.orderNumber} - ${new Intl.NumberFormat("vi-VN").format(order.totalAmount)}đ`,
        react: NewOrderNotification({
          shopName: SHOP_NAME,
          orderNumber: order.orderNumber,
          orderDate: format(order.createdAt, "dd/MM/yyyy HH:mm"),
          customerName: order.customerName,
          customerPhone: order.customerPhone,
          customerEmail: getCustomerEmail(order) || undefined,
          customerAddress: order.customerAddress || "Nhận tại quán",
          customerNote: order.customerNote || undefined,
          paymentMethod: order.paymentMethod,
          isPaid: order.isPaid,
          items: transformItems(order.orderItems),
          totalAmount: order.totalAmount,
          adminUrl: `${APP_URL}/admin/orders`,
        }),
      },
      { idempotencyKey: `new-order/${order.id}` }
    );

    if (error) {
      console.error(`[Email] Failed to send new order notification #${order.orderNumber}:`, error.message);
    } else {
      console.log(`[Email] New order notification sent for #${order.orderNumber} to ${SHOP_OWNER_EMAIL} (${data?.id})`);
    }
  } catch (err) {
    console.error(`[Email] Exception sending new order notification #${order.orderNumber}:`, err);
  }
}

// ======================================
// Email #3: Order Status Update → Customer
// ======================================

const STATUS_SUBJECTS: Record<string, string> = {
  PREPARING: "👨‍🍳 Đơn hàng đang được chuẩn bị",
  DELIVERING: "🛵 Đơn hàng đang được giao",
  COMPLETED: "✅ Đơn hàng đã hoàn thành",
  CANCELLED: "❌ Đơn hàng đã bị huỷ",
};

export async function sendOrderStatusUpdateEmail(order: OrderWithDetails) {
  const customerEmail = getCustomerEmail(order);
  if (!customerEmail) {
    console.log(`[Email] Skipping status update for #${order.orderNumber}: no customer email`);
    return;
  }

  // Only send for these statuses
  const notifyStatuses = ["PREPARING", "DELIVERING", "COMPLETED", "CANCELLED"];
  if (!notifyStatuses.includes(order.status)) {
    return;
  }

  const subject = STATUS_SUBJECTS[order.status] || "Cập nhật đơn hàng";

  try {
    const { data, error } = await resend.emails.send(
      {
        from: FROM_ADDRESS,
        to: [customerEmail],
        subject: `${subject} #${order.orderNumber} - ${SHOP_NAME}`,
        react: OrderStatusUpdate({
          shopName: SHOP_NAME,
          orderNumber: order.orderNumber,
          status: order.status as "PREPARING" | "DELIVERING" | "COMPLETED" | "CANCELLED",
          customerName: order.customerName,
          items: order.orderItems.map((item) => ({
            productName: item.product.name,
            quantity: item.quantity,
            price: item.priceAtTime + item.modifiers.reduce((sum, m) => sum + m.modifierPrice, 0),
          })),
          totalAmount: order.totalAmount,
        }),
      },
      { idempotencyKey: `order-status-${order.status.toLowerCase()}/${order.id}` }
    );

    if (error) {
      console.error(`[Email] Failed to send status update #${order.orderNumber} (${order.status}):`, error.message);
    } else {
      console.log(`[Email] Status update sent for #${order.orderNumber} (${order.status}) to ${customerEmail} (${data?.id})`);
    }
  } catch (err) {
    console.error(`[Email] Exception sending status update #${order.orderNumber}:`, err);
  }
}

// ======================================
// Wrapper: Send all emails on order creation (fire-and-forget)
// ======================================

export function sendOrderEmails(order: OrderWithDetails) {
  // Fire-and-forget: run both in parallel, don't block
  Promise.allSettled([
    sendOrderConfirmationEmail(order),
    sendNewOrderNotification(order),
  ]).then((results) => {
    results.forEach((result, i) => {
      if (result.status === "rejected") {
        console.error(`[Email] Email ${i} failed:`, result.reason);
      }
    });
  });
}
