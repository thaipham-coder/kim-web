'use client'

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "./CartProvider";
import { StorefrontSearch } from "./StorefrontSearch";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { NavUser } from "./nav-user";
import { Button } from "./ui/button";

interface Product {
  id: number
  name: string
  slug: string
  price: number
  image: string | null
  category: {
    name: string
  }
}

export default function StorefrontNavbar({
  user,
  products = []
}: {
  user?: { name?: string | null, image?: string | null },
  products?: Product[]
}) {
  const { totalItems, totalPrice } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-5xl mx-auto px-4 lg:px-6 h-auto py-3 md:py-0 md:h-16 flex flex-col md:flex-row md:items-center justify-between gap-0 md:gap-4">
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link href="/" className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src="https://res.cloudinary.com/duumeny9h/image/upload/v1772181740/logo-kim-2026_emx54a.jpg" />
              <AvatarFallback>K</AvatarFallback>
            </Avatar>
            <span className="font-bold text-xl text-neutral-900 tracking-tight">Kim Coffee & Fruit Tea</span>
          </Link>

          <div className="flex items-center gap-2 md:hidden">
            <Link href="/cart" className="relative p-2 rounded-full hover:bg-neutral-100 transition-colors">
              <ShoppingBag className="w-6 h-6 text-neutral-800" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {totalItems}
                </span>
              )}
            </Link>
            {user ? (
              <NavUser user={user} />
            ) : (
              <Link href="/login" className="text-xs font-medium">Đăng nhập</Link>
            )}
          </div>
        </div>

        {/* Search - Mobile below, Desktop right of logo */}
        <div className="flex-1 w-full">
          <StorefrontSearch products={products} />
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Button asChild variant="ghost" size="lg">
            <Link href="/cart" className="">
              <div className="relative">
                <ShoppingBag className="h-6! w-6! text-neutral-800" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                    {totalItems}
                  </span>
                )}
              </div>
              {totalPrice > 0 && (
                <span className="font-medium text-sm hidden sm:inline-block">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
                </span>
              )}
            </Link>
          </Button>
          {user ? (
            <NavUser user={user} />
          ) : (
            <Link href="/login" className="text-sm font-medium text-neutral-800 hover:underline">
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
