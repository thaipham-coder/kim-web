import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AddToCartForm from "./_components/AddToCartForm";
import StorefrontNavbar from "@/components/StorefrontNavbar";
import { CartProvider } from "@/components/CartProvider";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getProductBySlug, getProducts } from "@/lib/data";

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const [session, products] = await Promise.all([
    auth.api.getSession({ headers: await headers() }),
    getProducts(),
  ]);

  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product || !product.isAvailable) return notFound();

  return (
    <CartProvider>
      <div className="min-h-screen bg-neutral-50 flex flex-col">
        <StorefrontNavbar user={session?.user} products={products} />

        <main className="flex-1 max-w-5xl mx-auto w-full p-4 lg:p-6 pb-32">
          <Link href="/" className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-900 mb-6 font-medium transition-colors">
            <ArrowLeft className="w-5 h-5" /> Trở về Menu
          </Link>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-1/2 aspect-square md:aspect-[1/1] bg-neutral-200 rounded-3xl overflow-hidden shadow-sm relative sticky top-6">
              {product.image ? (
                <Image src={product.image} alt={product.name} fill className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-400">
                  <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
              )}
            </div>

            <div className="w-full md:w-1/2">
              <AddToCartForm product={product} />
            </div>
          </div>
        </main>
      </div>
    </CartProvider>
  );
}
