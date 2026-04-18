"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { verifyAdmin } from "@/lib/dal";

export async function deleteProduct(id: number) {
  await verifyAdmin();
  try {
    await prisma.product.delete({
      where: { id },
    });
    revalidatePath("/admin/menu/products");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Không thể xóa sản phẩm này" };
  }
}

export async function toggleProductAvailability(id: number, currentStatus: boolean) {
  await verifyAdmin();
  try {
    await prisma.product.update({
      where: { id },
      data: { isAvailable: !currentStatus }
    });
    revalidatePath("/admin/menu/products");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Lỗi cập nhật trạng thái" };
  }
}

export async function saveProduct(formData: FormData) {
  await verifyAdmin();
  try {
    const id = formData.get("id") ? parseInt(formData.get("id") as string) : undefined;
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = (formData.get("description") as string) || null;
    const price = parseInt(formData.get("price") as string) || 0;
    const categoryId = parseInt(formData.get("categoryId") as string);
    const image = (formData.get("image") as string) || null;
    const isAvailable = formData.get("isAvailable") === "true";

    const modifiersJson = formData.get("modifiersJson") as string;
    const modifiers = modifiersJson ? JSON.parse(modifiersJson) : [];

    if (!name || !slug || !categoryId) return { error: "Vui lòng nhập đủ thông tin bắt buộc" };

    const productData = {
      name, slug, description, price, categoryId, image, isAvailable
    };

    if (id) {
      // Update existing
      await prisma.product.update({ where: { id }, data: productData });

      // For modifiers, the simplest approach is to delete all and recreate
      await prisma.modifierGroup.deleteMany({ where: { productId: id } });

      for (const mod of modifiers) {
        await prisma.modifierGroup.create({
          data: {
            name: mod.name,
            isRequired: mod.isRequired,
            minSelection: mod.minSelection,
            maxSelection: mod.maxSelection,
            productId: id,
            items: {
              create: mod.items.map((mi: any) => ({ name: mi.name, price: mi.price }))
            }
          }
        });
      }
    } else {
      // Create new
      const newProduct = await prisma.product.create({ data: productData });
      for (const mod of modifiers) {
        await prisma.modifierGroup.create({
          data: {
            name: mod.name,
            isRequired: mod.isRequired,
            minSelection: mod.minSelection,
            maxSelection: mod.maxSelection,
            productId: newProduct.id,
            items: {
              create: mod.items.map((mi: any) => ({ name: mi.name, price: mi.price }))
            }
          }
        });
      }
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Lỗi khi lưu sản phẩm. Vui lòng kiểm tra lại slug." };
  }
}
