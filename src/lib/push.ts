import webpush from "web-push";
import prisma from "@/lib/db";

// ======================================
// Web Push Configuration
// ======================================

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://kimcafe.biz.vn";

webpush.setVapidDetails(
  `mailto:order@kimcafe.biz.vn`,
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

// ======================================
// Types
// ======================================

interface PushPayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
}

// ======================================
// Send Push to all Admin users
// ======================================

export async function sendPushToAdmins(payload: PushPayload) {
  try {
    // Query all push subscriptions belonging to ADMIN users
    const subscriptions = await prisma.pushSubscription.findMany({
      where: {
        user: {
          role: "ADMIN",
        },
      },
    });

    if (subscriptions.length === 0) {
      console.log("[Push] No admin subscriptions found");
      return;
    }

    const pushPayload = JSON.stringify({
      title: payload.title,
      body: payload.body,
      url: payload.url || "/admin/orders",
      tag: payload.tag || `order-${Date.now()}`,
    });

    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.p256dh,
                auth: sub.auth,
              },
            },
            pushPayload
          );
        } catch (error: any) {
          // 410 Gone or 404 = subscription expired, clean up
          if (error.statusCode === 410 || error.statusCode === 404) {
            console.log(`[Push] Removing expired subscription: ${sub.id}`);
            await prisma.pushSubscription.delete({
              where: { id: sub.id },
            });
          } else {
            throw error;
          }
        }
      })
    );

    const sent = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;
    console.log(`[Push] Sent to ${sent} admins, ${failed} failed`);
  } catch (error) {
    console.error("[Push] Error sending push notifications:", error);
  }
}

// ======================================
// Helper: Format VND for push body
// ======================================

export function formatVNDForPush(amount: number): string {
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}
