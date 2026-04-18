"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Check, Clock, X, Truck, ChefHat, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { OrderStatus } from "@/generated/prisma"
import { OrderDetailDrawer } from "./OrderDetailDrawer"

export type Order = {
    id: number
    orderNumber: string
    customerName: string
    customerPhone: string
    customerAddress: string | null
    customerNote: string | null
    totalAmount: number
    status: OrderStatus
    paymentMethod: string
    isPaid: boolean
    createdAt: string
    orderItems: {
        id: number
        quantity: number
        priceAtTime: number
        note: string | null
        product: { name: string }
        modifiers: { modifierName: string; modifierPrice: number }[]
    }[]
}

function StatusBadge({ status }: { status: string }) {
    switch (status) {
        case "PENDING":
            return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 flex items-center gap-1 w-max"><Clock className="w-3 h-3" /> Chờ xác nhận</span>
        case "PREPARING":
            return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 flex items-center gap-1 w-max"><ChefHat className="w-3 h-3" /> Đang làm</span>
        case "DELIVERING":
            return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 flex items-center gap-1 w-max"><Truck className="w-3 h-3" /> Đang giao</span>
        case "COMPLETED":
            return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center gap-1 w-max"><Check className="w-3 h-3" /> Hoàn thành</span>
        case "CANCELLED":
            return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 flex items-center gap-1 w-max"><X className="w-3 h-3" /> Đã huỷ</span>
        default:
            return <span className="px-2.5 py-1 rounded-full text-xs bg-neutral-100 text-neutral-800 w-max">{status}</span>
    }
}

export const columns: ColumnDef<Order>[] = [
    {
        accessorKey: "orderNumber",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Mã đơn
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const order = row.original
            return (
                <OrderDetailDrawer order={order}>
                    <button className="font-bold text-neutral-900 border border-neutral-300 px-2 py-0.5 rounded bg-neutral-50 text-sm hover:bg-neutral-100 hover:border-neutral-400 transition-colors cursor-pointer">
                        #{order.orderNumber}
                    </button>
                </OrderDetailDrawer>
            )
        },
    },
    {
        id: "customer",
        header: "Khách hàng",
        cell: ({ row }) => {
            const order = row.original
            return (
                <div>
                    <div className="font-semibold text-neutral-800 text-sm">{order.customerName}</div>
                    <div className="text-xs text-neutral-500">{order.customerPhone}</div>
                </div>
            )
        },
    },
    {
        accessorKey: "totalAmount",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Tổng tiền
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const amount = row.getValue("totalAmount") as number
            const formatted = new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
            }).format(amount)
            return <div className="font-black text-neutral-900">{formatted}</div>
        },
    },
    {
        id: "payment",
        header: "Thanh toán",
        cell: ({ row }) => {
            const order = row.original
            const label = order.paymentMethod === "COD" ? "Tiền mặt" : order.paymentMethod === "ZALOPAY" ? "ZaloPay" : "Chuyển khoản"
            return (
                <div className="text-sm">
                    <div className="text-neutral-800 font-medium">{label}</div>
                    {order.paymentMethod === "ZALOPAY" && (
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${order.isPaid ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                            {order.isPaid ? "Đã TT" : "Chưa TT"}
                        </span>
                    )}
                </div>
            )
        },
    },
    {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
]
