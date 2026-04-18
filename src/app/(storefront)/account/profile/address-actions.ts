"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/dal";

const MAX_ADDRESSES = 3;

export async function getUserAddresses() {
  const session = await verifySession();
  if (!session?.user) return [];

  return prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "asc" },
  });
}

export async function createAddress(formData: FormData) {
  const session = await verifySession();
  if (!session?.user) return { error: "Bạn cần đăng nhập" };

  const count = await prisma.address.count({ where: { userId: session.user.id } });
  if (count >= MAX_ADDRESSES) {
    return { error: `Bạn chỉ được lưu tối đa ${MAX_ADDRESSES} địa chỉ` };
  }

  const label = (formData.get("label") as string)?.trim();
  const address = (formData.get("address") as string)?.trim();
  const latitude = formData.get("latitude") ? parseFloat(formData.get("latitude") as string) : null;
  const longitude = formData.get("longitude") ? parseFloat(formData.get("longitude") as string) : null;

  if (!label || !address) {
    return { error: "Vui lòng nhập nhãn và địa chỉ" };
  }

  // Nếu đây là địa chỉ đầu tiên, đặt làm mặc định
  const isDefault = count === 0;

  try {
    await prisma.address.create({
      data: {
        userId: session.user.id,
        label,
        address,
        latitude,
        longitude,
        isDefault,
      },
    });

    revalidatePath("/account/profile");
    revalidatePath("/checkout");
    return { success: true };
  } catch (error) {
    console.error("Create address error:", error);
    return { error: "Đã có lỗi xảy ra khi thêm địa chỉ" };
  }
}

export async function updateAddress(formData: FormData) {
  const session = await verifySession();
  if (!session?.user) return { error: "Bạn cần đăng nhập" };

  const id = formData.get("id") as string;
  const label = (formData.get("label") as string)?.trim();
  const address = (formData.get("address") as string)?.trim();
  const latitude = formData.get("latitude") ? parseFloat(formData.get("latitude") as string) : null;
  const longitude = formData.get("longitude") ? parseFloat(formData.get("longitude") as string) : null;

  if (!label || !address) {
    return { error: "Vui lòng nhập nhãn và địa chỉ" };
  }

  try {
    // Kiểm tra quyền sở hữu
    const existing = await prisma.address.findFirst({
      where: { id, userId: session.user.id },
    });
    if (!existing) return { error: "Không tìm thấy địa chỉ" };

    await prisma.address.update({
      where: { id },
      data: { label, address, latitude, longitude },
    });

    revalidatePath("/account/profile");
    revalidatePath("/checkout");
    return { success: true };
  } catch (error) {
    console.error("Update address error:", error);
    return { error: "Đã có lỗi xảy ra khi cập nhật địa chỉ" };
  }
}

export async function deleteAddress(id: string) {
  const session = await verifySession();
  if (!session?.user) return { error: "Bạn cần đăng nhập" };

  try {
    const existing = await prisma.address.findFirst({
      where: { id, userId: session.user.id },
    });
    if (!existing) return { error: "Không tìm thấy địa chỉ" };

    await prisma.address.delete({ where: { id } });

    // Nếu xóa địa chỉ mặc định, đặt địa chỉ đầu tiên còn lại làm mặc định
    if (existing.isDefault) {
      const first = await prisma.address.findFirst({
        where: { userId: session.user.id },
        orderBy: { createdAt: "asc" },
      });
      if (first) {
        await prisma.address.update({
          where: { id: first.id },
          data: { isDefault: true },
        });
      }
    }

    revalidatePath("/account/profile");
    revalidatePath("/checkout");
    return { success: true };
  } catch (error) {
    console.error("Delete address error:", error);
    return { error: "Đã có lỗi xảy ra khi xóa địa chỉ" };
  }
}

export async function setDefaultAddress(id: string) {
  const session = await verifySession();
  if (!session?.user) return { error: "Bạn cần đăng nhập" };

  try {
    const existing = await prisma.address.findFirst({
      where: { id, userId: session.user.id },
    });
    if (!existing) return { error: "Không tìm thấy địa chỉ" };

    // Bỏ mặc định tất cả
    await prisma.address.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false },
    });

    // Đặt mặc định mới
    await prisma.address.update({
      where: { id },
      data: { isDefault: true },
    });

    revalidatePath("/account/profile");
    revalidatePath("/checkout");
    return { success: true };
  } catch (error) {
    console.error("Set default address error:", error);
    return { error: "Đã có lỗi xảy ra" };
  }
}
