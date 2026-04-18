"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, ShoppingBag, User, Search } from "lucide-react"
import { useCart } from "@/store/cartStore"
import { cn } from "@/lib/utils"
import { useEffect, useState, useMemo, useCallback } from "react"

// Danh sách các prefix route cần ẩn bottom nav
const HIDDEN_ROUTES = ["/admin", "/checkout", "/product", "/login"]

export function MobileBottomNav() {
    const pathname = usePathname()
    const { totalItems } = useCart()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Kiểm tra route cần ẩn
    const shouldHide = useMemo(
        () => HIDDEN_ROUTES.some(route => pathname.includes(route)),
        [pathname]
    )

    // Mở search dialog bằng cách dispatch keyboard event (Ctrl+K)
    const openSearch = useCallback((e: React.MouseEvent) => {
        e.preventDefault()
        document.dispatchEvent(
            new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true })
        )
    }, [])

    const navItems = useMemo(() => [
        {
            label: "Trang chủ",
            icon: Home,
            href: "/",
            isActive: pathname === "/",
        },
        {
            label: "Tìm kiếm",
            icon: Search,
            href: "#search",
            isActive: false,
            onClick: openSearch,
        },
        {
            label: "Giỏ hàng",
            icon: ShoppingBag,
            href: "/cart",
            isActive: pathname === "/cart",
            badge: totalItems > 0 ? totalItems : null,
        },
        {
            label: "Tài khoản",
            icon: User,
            href: "/account/profile",
            isActive: pathname.includes("/account"),
        },
    ], [pathname, totalItems, openSearch])

    if (shouldHide) return null

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200 pb-safe shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
            <div className="flex items-center justify-around h-[68px] pb-1">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = item.isActive
                    const sharedClass = cn(
                        "relative flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
                        isActive ? "text-neutral-900" : "text-neutral-400 hover:text-neutral-600"
                    )

                    const content = (
                        <>
                            <div className="relative">
                                <Icon className={cn("w-[22px] h-[22px]", isActive && "stroke-[2.5]")} />
                                {mounted && item.badge && (
                                    <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center border border-white">
                                        {item.badge}
                                    </span>
                                )}
                            </div>
                            <span className={cn("text-[10px] font-medium", isActive && "font-bold")}>
                                {item.label}
                            </span>
                        </>
                    )

                    if (item.onClick) {
                        return (
                            <button key={item.label} type="button" onClick={item.onClick} className={sharedClass}>
                                {content}
                            </button>
                        )
                    }

                    return (
                        <Link key={item.label} href={item.href} className={sharedClass}>
                            {content}
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
