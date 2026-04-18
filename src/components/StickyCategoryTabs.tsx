"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"

interface Category {
    id: number
    name: string
    slug: string
}

// Offset tính từ top viewport đến vị trí bắt đầu nội dung (navbar + tabs)
const SCROLL_OFFSET = 130

export function StickyCategoryTabs({ categories }: { categories: Category[] }) {
    const [activeSlug, setActiveSlug] = useState<string>(categories[0]?.slug || "")
    const tabsRef = useRef<HTMLDivElement>(null)
    const activeTabRef = useRef<Map<string, HTMLAnchorElement>>(new Map())
    const isScrollingRef = useRef(false)

    // Auto-scroll thanh tab để active tab luôn hiển thị
    const scrollActiveTabIntoView = useCallback((slug: string) => {
        const tab = activeTabRef.current.get(slug)
        const container = tabsRef.current
        if (!tab || !container) return

        const tabLeft = tab.offsetLeft
        const tabWidth = tab.offsetWidth
        const containerWidth = container.offsetWidth
        const scrollLeft = container.scrollLeft

        // Nếu tab nằm ngoài vùng nhìn thấy -> cuộn đến giữa
        if (tabLeft < scrollLeft || tabLeft + tabWidth > scrollLeft + containerWidth) {
            container.scrollTo({
                left: tabLeft - containerWidth / 2 + tabWidth / 2,
                behavior: "smooth"
            })
        }
    }, [])

    useEffect(() => {
        let ticking = false

        const handleScroll = () => {
            if (isScrollingRef.current) return
            if (ticking) return
            ticking = true

            requestAnimationFrame(() => {
                // Sử dụng getBoundingClientRect cho kết quả chính xác hơn offsetTop
                let currentSlug = categories[0]?.slug || ""

                for (const category of categories) {
                    const el = document.getElementById(`cat-${category.slug}`)
                    if (el) {
                        const rect = el.getBoundingClientRect()
                        // Section đang nằm trong viewport (tính offset cho sticky header)
                        if (rect.top <= SCROLL_OFFSET && rect.bottom > SCROLL_OFFSET) {
                            currentSlug = category.slug
                        }
                    }
                }

                setActiveSlug(prev => {
                    if (prev !== currentSlug) {
                        scrollActiveTabIntoView(currentSlug)
                        return currentSlug
                    }
                    return prev
                })

                ticking = false
            })
        }

        window.addEventListener("scroll", handleScroll, { passive: true })
        handleScroll() // Chạy 1 lần khi mount để set đúng active tab ban đầu
        return () => window.removeEventListener("scroll", handleScroll)
    }, [categories, scrollActiveTabIntoView])

    const scrollToCategory = useCallback((e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
        e.preventDefault()
        const element = document.getElementById(`cat-${slug}`)
        if (!element) return

        // Tạm tắt scroll listener để tránh xung đột khi smooth scroll
        isScrollingRef.current = true
        setActiveSlug(slug)
        scrollActiveTabIntoView(slug)

        const y = element.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET
        window.scrollTo({ top: y, behavior: "smooth" })

        // Bật lại scroll listener sau khi animation kết thúc
        setTimeout(() => {
            isScrollingRef.current = false
        }, 600)
    }, [scrollActiveTabIntoView])

    const setTabRef = useCallback((slug: string) => (el: HTMLAnchorElement | null) => {
        if (el) {
            activeTabRef.current.set(slug, el)
        } else {
            activeTabRef.current.delete(slug)
        }
    }, [])

    return (
        <div
            ref={tabsRef}
            className="sticky top-[52px] md:top-16 z-40 w-full bg-white/95 backdrop-blur-md border-b border-neutral-100 py-3 mb-6 -mx-4 px-4 lg:-mx-6 lg:px-6 flex gap-2 overflow-x-auto custom-scrollbar"
        >
            {categories.map(c => (
                <a
                    key={c.id}
                    ref={setTabRef(c.slug)}
                    href={`#cat-${c.slug}`}
                    onClick={(e) => scrollToCategory(e, c.slug)}
                    className={cn(
                        "whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold transition-all shrink-0",
                        activeSlug === c.slug
                            ? "bg-neutral-900 text-white shadow-md shadow-neutral-900/10"
                            : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                    )}
                >
                    {c.name}
                </a>
            ))}
        </div>
    )
}
