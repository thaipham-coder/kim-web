'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"

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

interface StorefrontSearchProps {
    products: Product[]
}

export function StorefrontSearch({ products }: StorefrontSearchProps) {
    const [open, setOpen] = React.useState(false)
    const [mounted, setMounted] = React.useState(false)
    const router = useRouter()

    React.useEffect(() => {
        setMounted(true)
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
            if (e.key === "/") {
                const activeElement = document.activeElement
                const isInput = activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA' || (activeElement as HTMLElement)?.isContentEditable
                if (!isInput) {
                    e.preventDefault()
                    setOpen(true)
                }
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false)
        command()
    }, [])

    if (!mounted) {
        return (
            <div className="w-full h-10 md:w-64 bg-neutral-100 rounded-full animate-pulse" />
        )
    }

    return (
        <>
            {/* Desktop Search Trigger */}
            <button
                onClick={() => setOpen(true)}
                className="hidden md:flex items-center gap-2 px-4 py-2 w-64 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 rounded-full text-neutral-500 transition-all text-sm group"
            >
                <Search className="w-4 h-4 group-hover:text-neutral-900" />
                <span className="flex-1 text-left">Tìm sản phẩm...</span>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-white px-1.5 font-mono text-[10px] font-medium text-neutral-400 opacity-100">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </button>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <Command>
                    <CommandInput placeholder="Nhập tên món hoặc loại đồ uống..." />
                    <CommandList>
                        <CommandEmpty>Không tìm thấy sản phẩm nào.</CommandEmpty>

                        {/* Group by Categories could be done here if needed */}
                        <CommandGroup heading="Sản phẩm">
                            {products.map((product) => (
                                <CommandItem
                                    key={product.id}
                                    onSelect={() => {
                                        runCommand(() => router.push(`/product/${product.slug}`))
                                    }}
                                    className="flex items-center gap-3 p-2 cursor-pointer"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-neutral-100 overflow-hidden flex-shrink-0">
                                        {product.image ? (
                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-neutral-300">
                                                <Search className="w-4 h-4" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <span className="font-bold text-neutral-900">{product.name}</span>
                                        <span className="text-xs text-neutral-500 uppercase tracking-wider">{product.category.name}</span>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="font-semibold text-sm">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                        </span>
                                        <Badge variant="outline" className="text-[10px] h-4 px-1 font-normal border-neutral-200">
                                            Còn hàng
                                        </Badge>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </CommandDialog>
        </>
    )
}
