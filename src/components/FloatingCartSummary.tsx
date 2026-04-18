"use client"

import { useCart } from "@/store/cartStore"
import { ShoppingBag, ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export function FloatingCartSummary() {
    const { totalItems, totalPrice } = useCart()
    const pathname = usePathname()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted || totalItems === 0) return null

    // Hide on checkout, cart, or admin pages
    if (pathname.includes("/admin") || pathname.includes("/checkout") || pathname === "/cart") {
        return null
    }

    const formattedPrice = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(totalPrice)

    return (
        <div className="md:hidden fixed bottom-[84px] left-4 right-4 z-40 animate-in slide-in-from-bottom-5 fade-in duration-300">
            <Link 
                href="/cart"
                className="flex items-center justify-between bg-neutral-900 text-white rounded-2xl px-4 py-3 shadow-2xl shadow-neutral-900/40 active:scale-[0.98] transition-all"
            >
                <div className="flex items-center gap-3">
                    <div className="relative bg-white/20 w-10 h-10 rounded-full flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-white" />
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center border border-neutral-900">
                            {totalItems}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-sm">Xem giỏ hàng</span>
                        <span className="text-xs text-neutral-300 font-medium">{totalItems} món</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">{formattedPrice}</span>
                    <ChevronRight className="w-5 h-5 text-neutral-400" />
                </div>
            </Link>
        </div>
    )
}
