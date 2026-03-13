"use client";

import Link from "next/link";
import { Plus, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CldImage } from 'next-cloudinary';

interface ProductCardProps {
    product: {
        id: number;
        name: string;
        slug: string;
        description: string | null;
        price: number;
        image: string | null;
        isAvailable: boolean;
    };
    className?: string;
    priority?: boolean;
}

export function ProductCard({ product, className, priority = false }: ProductCardProps) {
    const formattedPrice = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(product.price);

    return (
        <Link
            href={`/product/${product.slug}`}
            className={cn(
                "group relative bg-white border border-neutral-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-neutral-300 flex flex-col h-full",
                className
            )}
        >
            {/* Product Image Container */}
            <div className="aspect-[1/1] bg-neutral-100 relative overflow-hidden">
                {product.image ? (
                    <CldImage
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        width={400}
                        height={400}
                        crop="fill"
                        sizes="100vw"
                        gravity="center"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-300">
                        <ShoppingBag className="w-12 h-12 stroke-[1.5]" />
                    </div>
                )}

                {/* Availability Badge */}
                {!product.isAvailable && (
                    <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-[2px] flex items-center justify-center">
                        <Badge variant="destructive" className="px-3 py-1 text-sm font-bold uppercase tracking-wider">Tạm hết món</Badge>
                    </div>
                )}
            </div>

            {/* Product Details */}
            <div className="p-4 flex-1 flex flex-col">
                <div className="space-y-1">
                    <h3 className="font-semibold text-neutral-900 group-hover:text-amber-800 transition-colors line-clamp-1">
                        {product.name}
                    </h3>
                    {product.description && (
                        <p className="text-sm text-neutral-500 line-clamp-2 min-h-[40px] leading-relaxed">
                            {product.description}
                        </p>
                    )}
                </div>

                {/* Pricing and Action */}
                <div className="mt-auto pt-3 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="font-bold text-neutral-900">
                            {formattedPrice}
                        </span>
                    </div>

                    <div
                        className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                            "bg-neutral-100 text-neutral-800 group-hover:bg-neutral-900 group-hover:text-white group-hover:rotate-90 group-hover:shadow-lg"
                        )}
                    >
                        <Plus className="w-6 h-6" />
                    </div>
                </div>
            </div>
        </Link>
    );
}
