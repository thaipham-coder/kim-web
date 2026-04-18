import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// GET: Return VAPID public key
export async function GET() {
  return NextResponse.json({
    publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  });
}

// POST: Save push subscription
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only allow ADMIN users
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { endpoint, keys } = body;

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return NextResponse.json(
        { error: "Invalid subscription data" },
        { status: 400 }
      );
    }

    // Upsert: create or update existing subscription
    await prisma.pushSubscription.upsert({
      where: { endpoint },
      create: {
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
        userId: session.user.id,
      },
      update: {
        p256dh: keys.p256dh,
        auth: keys.auth,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Web Push] Subscribe error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE: Remove push subscription
export async function DELETE(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { endpoint } = body;

    if (!endpoint) {
      return NextResponse.json(
        { error: "Missing endpoint" },
        { status: 400 }
      );
    }

    await prisma.pushSubscription.deleteMany({
      where: {
        endpoint,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Web Push] Unsubscribe error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
