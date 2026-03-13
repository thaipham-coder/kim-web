import 'server-only'

import { prisma } from "./db";
import { unstable_cache } from "next/cache";
import { cache } from "react";

/**
 * Lấy danh sách Categories kèm theo Products đã cache.
 * Sử dụng Request Memoization (React.cache) và Data Cache (unstable_cache).
 */
export const getCategoriesWithProducts = cache(async () => {
    return await unstable_cache(
        async () => {
            return await prisma.category.findMany({
                orderBy: { sortOrder: "asc" },
                include: {
                    products: {
                        where: { isAvailable: true },
                        include: {
                            modifiers: {
                                include: { items: true },
                            },
                        },
                    },
                },
            });
        },
        ["categories-with-products"],
        {
            tags: ["categories", "products"],
        }
    )();
});

/**
 * Lấy chi tiết sản phẩm theo Slug đã cache.
 */
export const getProductBySlug = cache(async (slug: string) => {
    return await unstable_cache(
        async () => {
            return await prisma.product.findUnique({
                where: { slug },
                include: {
                    modifiers: {
                        include: {
                            items: true,
                        },
                    },
                    category: true,
                },
            });
        },
        [`product-${slug}`],
        {
            tags: ["products", `product-${slug}`],
        }
    )();
});

/**
 * Lấy toàn bộ sản phẩm (không lọc category) cho công cụ tìm kiếm.
 */
export const getProducts = cache(async () => {
    return await unstable_cache(
        async () => {
            return await prisma.product.findMany({
                where: { isAvailable: true },
                include: {
                    category: true,
                },
            });
        },
        ["all-available-products"],
        {
            tags: ["products"],
        }
    )();
});
/**
 * Lấy lịch sử đơn hàng của người dùng.
 */
export const getOrdersByUserId = cache(async (userId: string) => {
    return await prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: {
            orderItems: {
                include: {
                    product: true,
                    modifiers: true,
                },
            },
        },
    });
});
