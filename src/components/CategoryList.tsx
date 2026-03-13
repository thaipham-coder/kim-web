import { getCategoriesWithProducts } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";

export async function CategoryList() {
  const categories = await getCategoriesWithProducts();

  return (
    <div className="space-y-12">
      {categories.map((category) => (
        <div key={category.id} id={`cat-${category.slug}`} className="scroll-mt-24">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
            {category.name}
            <div className="h-px bg-neutral-200 flex-1 relative top-1"></div>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {category.products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                priority={index < 4} // Optimization for LCP
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
