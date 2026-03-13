import CartPageClient from "./CartPageClient";
import StorefrontNavbar from "@/components/StorefrontNavbar";
import { CartProvider } from "@/components/CartProvider";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/dal";

export default async function CartPage() {
  const session = await verifySession()
  if (!session?.user) redirect("/login");

  return (
    <CartProvider>
      <div className="min-h-screen bg-neutral-50 pb-20">
        <StorefrontNavbar user={session.user} />
        <main className="max-w-5xl mx-auto px-4 lg:px-6 py-8">
          <CartPageClient />
        </main>
      </div>
    </CartProvider>
  );
}
