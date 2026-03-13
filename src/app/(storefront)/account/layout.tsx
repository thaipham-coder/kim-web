import { NavbarContainer } from "@/components/NavbarContainer";
import { Suspense } from "react";
import { User, ShoppingBag } from "lucide-react";
import { AccountNavLink } from "./_components/AccountNavLink";
import { CartProvider } from "@/components/CartProvider";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="min-h-screen bg-neutral-50 pb-20">
        <Suspense fallback={<div className="h-16 border-b bg-white" />}>
          <NavbarContainer />
        </Suspense>

        <main className="max-w-5xl mx-auto px-4 lg:px-6 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <aside className="w-full md:w-64 space-y-2">
              <h1 className="text-2xl font-bold mb-6 px-2 text-neutral-900">Tài khoản</h1>
              <nav className="space-y-1">
                <AccountNavLink href="/account/profile" icon={<User className="w-4 h-4" />}>
                  Thông tin cá nhân
                </AccountNavLink>
                <AccountNavLink href="/account/orders" icon={<ShoppingBag className="w-4 h-4" />}>
                  Lịch sử đơn hàng
                </AccountNavLink>
              </nav>
            </aside>

            {/* Content */}
            <div className="flex-1 bg-white rounded-2xl border border-neutral-200 p-6 md:p-8 shadow-sm">
              {children}
            </div>
          </div>
        </main>
      </div>
    </CartProvider>
  );
}
