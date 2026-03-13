import { CartProvider } from "@/components/CartProvider";
import { CategoryList } from "@/components/CategoryList";
import { NavbarContainer } from "@/components/NavbarContainer";
import Footer from "@/components/Footer";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function StorefrontPage() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-neutral-50 flex flex-col">
        <Suspense fallback={<NavbarSkeleton />}>
          <NavbarContainer />
        </Suspense>

        <main className="flex-grow w-full max-w-5xl mx-auto px-4 lg:px-6 py-8">
          <Suspense fallback={<CategoryListSkeleton />}>
            <CategoryList />
          </Suspense>
        </main>
        
        <Footer />
      </div>
    </CartProvider>
  );
}

function NavbarSkeleton() {
  return (
    <div className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md px-4 py-3 h-16">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Skeleton className="h-10 w-32" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-48 hidden md:block" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function CategoryListSkeleton() {
  return (
    <div className="space-y-12">
      {[1, 2].map((i) => (
        <div key={i} className="space-y-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-px flex-1" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="space-y-3">
                <Skeleton className="aspect-square w-full rounded-xl" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
