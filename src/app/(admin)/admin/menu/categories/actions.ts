"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const sortOrder = parseInt((formData.get("sortOrder") as string) || "0");

  if (!name || !slug) return { error: "Vui lòng nhập tên và slug của danh mục" };

  try {
    await prisma.category.create({
      data: {
        name,
        slug,
        sortOrder,
      },
    });
    revalidatePath("/admin/menu/categories");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Có lỗi xảy ra, slug có thể đã tồn tại" };
  }
}

export async function deleteCategory(id: number) {
  try {
    await prisma.category.delete({
      where: { id },
    });
    revalidatePath("/admin/menu/categories");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Không thể xóa danh mục đang chứa sản phẩm" };
  }
}
