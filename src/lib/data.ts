
import prisma from "./db";
import { unstable_cache } from "next/cache";

/**
 * ⚠️ Dùng unstable_cache thay vì "use cache" vì PrismaNeon adapter
 * không tương thích với Cache environment của Next.js 16.
 * (PrismaNeon dùng HTTP/fetch nội bộ, bị lỗi ErrorEvent trong Cache worker)
 *
 * Khi Prisma hỗ trợ chính thức Cache env, có thể chuyển sang "use cache".
 */

/**
 * Lấy danh sách Categories kèm Products.
 */
export const getCategoriesWithProducts = unstable_cache(
    async () => {
        return await prisma.category.findMany({
            orderBy: { sortOrder: "asc" },
            include: {
                products: {
                    where: { isAvailable: true },
                    include: {
                        modifiers: { include: { items: true } },
                    },
                },
            },
        });
    },
    ["categories-with-products"],
    { tags: ["categories", "products"], revalidate: 3600 }
);

/**
 * Lấy chi tiết sản phẩm theo Slug.
 */
export const getProductBySlug = (slug: string) =>
    unstable_cache(
        async () => {
            return await prisma.product.findUnique({
                where: { slug },
                include: {
                    modifiers: { include: { items: true } },
                    category: true,
                },
            });
        },
        [`product-${slug}`],
        { tags: ["products", `product-${slug}`], revalidate: 3600 }
    )();

/**
 * Lấy toàn bộ sản phẩm cho thanh tìm kiếm.
 */
export const getProducts = unstable_cache(
    async () => {
        return await prisma.product.findMany({
            where: { isAvailable: true },
            select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                image: true,
                category: { select: { name: true } },
            },
        });
    },
    ["all-available-products"],
    { tags: ["products"], revalidate: 3600 }
);

/**
 * Lịch sử đơn hàng — không cache lâu vì dữ liệu thay đổi thường xuyên.
 * Dùng revalidate ngắn (60s) thay vì cache vô hạn.
 */
export const getOrdersByUserId = (userId: string) =>
    unstable_cache(
        async () => {
            if (!userId) return [];
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
        },
        [`user-orders-${userId}`],
        { tags: [`user-orders-${userId}`], revalidate: 60 }
    )();
