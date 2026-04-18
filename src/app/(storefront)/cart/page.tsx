import CartPageClient from "./CartPageClient";
import StorefrontNavbar from "@/components/StorefrontNavbar";
import { getOptionalSession } from "@/lib/dal";

export default async function CartPage() {
  const session = await getOptionalSession()

  return (
      <div className="min-h-screen bg-neutral-50 pb-20">
        <StorefrontNavbar user={session?.user ?? undefined} />
        <main className="max-w-5xl mx-auto px-4 lg:px-6 py-8">
          <CartPageClient />
        </main>
      </div>

  );
}
