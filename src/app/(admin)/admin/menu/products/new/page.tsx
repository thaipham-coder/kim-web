import prisma from "@/lib/db";
import ProductForm from "../_components/ProductForm";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" }
  });

  return <ProductForm categories={categories} />;
}
