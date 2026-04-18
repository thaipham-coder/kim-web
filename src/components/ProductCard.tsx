"use client";

import Link from "next/link";
import { Plus, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CldImage } from 'next-cloudinary';
import { QuickAddDrawer } from "./QuickAddDrawer";

interface ProductCardProps {
    product: any; // Include modifiers
    className?: string;
    priority?: boolean;
}

export function ProductCard({ product, className, priority = false }: ProductCardProps) {
    const formattedPrice = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(product.price);

    return (
        <div
            className={cn(
                "group relative bg-white border-b border-neutral-100 md:border md:border-neutral-200 md:rounded-2xl overflow-hidden md:hover:shadow-lg transition-all duration-300 flex flex-row md:flex-col h-full items-center md:items-stretch py-4 md:py-0 gap-4 md:gap-0",
                className
            )}
        >
            <Link href={`/product/${product.slug}`} className="contents">
                {/* Product Image Container */}
                <div className="w-[96px] h-[96px] md:w-full md:h-auto md:aspect-[1/1] bg-neutral-100 relative overflow-hidden rounded-xl md:rounded-none shrink-0 cursor-pointer">
                    {product.image ? (
                        <CldImage
                            src={product.image}
                            alt={product.name}
                            loading={priority ? "eager" : "lazy"}
                            width={400}
                            height={400}
                            crop="fill"
                            sizes="(max-width: 768px) 96px, 100vw"
                            gravity="center"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-300">
                            <ShoppingBag className="w-8 h-8 md:w-12 md:h-12 stroke-[1.5]" />
                        </div>
                    )}

                    {/* Availability Badge */}
                    {!product.isAvailable && (
                        <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-[2px] flex items-center justify-center">
                            <Badge variant="destructive" className="px-1 md:px-3 py-0.5 md:py-1 text-[10px] md:text-sm font-bold uppercase tracking-wider text-center leading-tight">Hết món</Badge>
                        </div>
                    )}
                </div>

                {/* Product Details */}
                <div className="p-0 md:p-4 flex-1 flex flex-col w-full h-full justify-start cursor-pointer pr-10 md:pr-0">
                    <div className="space-y-1 mt-1 md:mt-0">
                        <h3 className="font-semibold text-neutral-900 group-hover:text-amber-800 transition-colors line-clamp-2 md:line-clamp-1 text-base md:text-lg">
                            {product.name}
                        </h3>
                        {product.description && (
                            <p className="text-sm text-neutral-500 line-clamp-1 md:line-clamp-2 md:min-h-[40px] leading-relaxed">
                                {product.description}
                            </p>
                        )}
                    </div>

                    <div className="mt-2 md:mt-auto md:pt-3 flex flex-col">
                        <span className="font-bold text-neutral-900 text-base md:text-lg">
                            {formattedPrice}
                        </span>
                    </div>
                </div>
            </Link>

            {/* Quick Add Button / Drawer Trigger */}
            <div className="absolute bottom-4 right-4 z-10 flex items-center justify-end">
                {product.isAvailable ? (
                    <QuickAddDrawer
                        product={product}
                        trigger={
                            <button
                                type="button"
                                className={cn(
                                    "w-12 h-12 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm",
                                    "bg-neutral-100 text-neutral-800 hover:bg-neutral-900 hover:text-white hover:rotate-90 hover:shadow-lg active:scale-95"
                                )}
                                aria-label="Thêm vào giỏ"
                            >
                                <Plus className="w-5 h-5 md:w-6 md:h-6" />
                            </button>
                        }
                    />
                ) : (
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-neutral-100 text-neutral-300 opacity-50 cursor-not-allowed">
                        <Plus className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                )}
            </div>
        </div>
    );
}
