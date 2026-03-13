import { prisma } from "@/lib/db";
import ProductForm from "../../_components/ProductForm";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const productId = parseInt(id);

  if (isNaN(productId)) return notFound();

  const [categories, product] = await Promise.all([
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.product.findUnique({
      where: { id: productId },
      include: {
        modifiers: {
          include: {
            items: true
          }
        }
      }
    })
  ]);

  if (!product) return notFound();

  return <ProductForm categories={categories} initialData={product} />;
}
