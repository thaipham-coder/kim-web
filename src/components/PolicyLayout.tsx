import { NavbarContainer } from "@/components/NavbarContainer";
import { CartProvider } from "@/components/CartProvider";
import Footer from "@/components/Footer";
import { Suspense } from "react";

export default function PolicyLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="min-h-screen bg-neutral-50 flex flex-col">
        <Suspense fallback={<div className="h-16 border-b bg-white" />}>
          <NavbarContainer />
        </Suspense>
        
        <main className="flex-grow max-w-4xl mx-auto w-full px-4 lg:px-6 py-12 pt-8 md:pt-16">
          <div className="bg-white p-6 md:p-12 lg:p-16 rounded-[2rem] border border-neutral-100 shadow-sm">
            {children}
          </div>
        </main>
        
        <Footer />
      </div>
    </CartProvider>
  );
}
