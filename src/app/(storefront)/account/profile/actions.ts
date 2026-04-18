"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/dal";

export async function updateProfile(formData: FormData) {
  const session = await verifySession()

  if (!session?.user) {
    return { error: "Bạn cần đăng nhập để thực hiện hành động này" };
  }

  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;

  // Validation
  if (!name || name.trim().length === 0) {
    return { error: "Vui lòng nhập họ tên" };
  }

  if (!phone || !/^\d{10}$/.test(phone)) {
    return { error: "Số điện thoại phải đúng 10 chữ số" };
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        phone,
      },
    });

    revalidatePath("/account/profile");
    return { success: true };
  } catch (error) {
    console.error("Update profile error:", error);
    return { error: "Đã có lỗi xảy ra khi cập nhật hồ sơ" };
  }
}
