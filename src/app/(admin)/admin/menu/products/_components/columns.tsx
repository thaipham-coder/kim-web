"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CheckCircle2, XCircle, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { toggleProductAvailability, deleteProduct } from "../actions"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { toast } from "sonner"
import { Checkbox } from "@/components/ui/checkbox"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type Products = {
    id: number
    name: string
    slug: string
    price: number
    image: string | null
    isAvailable: boolean
    category: {
        name: string
    } | null
    _count: {
        modifiers: number
    }
}

export const columns: ColumnDef<Products>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value: boolean | "indeterminate") => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value: boolean | "indeterminate") => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Sản phẩm
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const product = row.original
            return (
                <div className="flex items-center gap-3">
                    <div>
                        <div className="font-bold text-neutral-900">
                            <Link href={`/admin/menu/products/${product.id}/edit`}>
                                {product.name}
                            </Link>
                        </div>
                        <div className="text-[10px] text-neutral-400 font-mono uppercase tracking-wider">{product.slug}</div>
                    </div>
                </div>
            )
        }
    },
    {
        accessorKey: "category.name",
        header: "Danh mục",
        cell: ({ row }) => (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-neutral-100 text-neutral-600 border border-neutral-200/50">
                {row.original.category?.name || "N/A"}
            </span>
        )
    },
    {
        accessorKey: "price",
        header: "Giá bán",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("price"))
            const formatted = new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
            }).format(amount)
            return <div className="font-black text-neutral-900">{formatted}</div>
        },
    },
    {
        id: "modifiers",
        header: "Tùy chọn",
        cell: ({ row }) => (
            <div className="text-neutral-500 text-sm">
                {row.original._count?.modifiers || 0} nhóm
            </div>
        )
    },
    {
        accessorKey: "isAvailable",
        header: "Trạng thái",
        cell: ({ row }) => {
            const product = row.original
            return (
                <button
                    onClick={async () => {
                        const result = await toggleProductAvailability(product.id, product.isAvailable);
                        if (result?.success) {
                            toast.success(`Đã ${product.isAvailable ? 'tạm ẩn' : 'hiện'} sản phẩm`);
                        } else {
                            toast.error(result?.error || "Lỗi cập nhật trạng thái");
                        }
                    }}
                    className="hover:scale-110 transition-transform focus:outline-none"
                >
                    {product.isAvailable ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    ) : (
                        <XCircle className="w-6 h-6 text-neutral-300" />
                    )}
                </button>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const product = row.original

            async function onDelete() {
                if (!confirm(`Bạn có chắc muốn xoá sản phẩm "${product.name}"?`)) return;
                const result = await deleteProduct(product.id);
                if (result?.success) {
                    toast.success("Đã xoá sản phẩm");
                } else {
                    toast.error(result?.error || "Lỗi khi xoá sản phẩm");
                }
            }

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/menu/products/${product.id}/edit`}>
                                Sửa
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={onDelete} className="text-red-600 focus:text-red-600">
                            Xóa
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]