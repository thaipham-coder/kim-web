"use server";

import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getCheckoutUserInfo() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) return null;

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        phone: true,
        addresses: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    return user;
  } catch {
    return null;
  }
}
