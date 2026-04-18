"use client"

import { useState } from "react"
import { Order } from "./columns"
import { OrderStatus } from "@/generated/prisma"
import { updateOrderStatus, deleteOrder } from "../actions"
import { toast } from "sonner"
import { Check, Clock, X, Truck, ChefHat, Trash2, MapPin, Phone, User, StickyNote, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"

function StatusBadge({ status }: { status: string }) {
    switch (status) {
        case "PENDING":
            return <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 flex items-center gap-1.5 w-max"><Clock className="w-3.5 h-3.5" /> Chờ xác nhận</span>
        case "PREPARING":
            return <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 flex items-center gap-1.5 w-max"><ChefHat className="w-3.5 h-3.5" /> Đang làm món</span>
        case "DELIVERING":
            return <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 flex items-center gap-1.5 w-max"><Truck className="w-3.5 h-3.5" /> Đang giao hàng</span>
        case "COMPLETED":
            return <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center gap-1.5 w-max"><Check className="w-3.5 h-3.5" /> Hoàn thành</span>
        case "CANCELLED":
            return <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-red-100 text-red-800 flex items-center gap-1.5 w-max"><X className="w-3.5 h-3.5" /> Đã huỷ</span>
        default:
            return <span className="px-3 py-1.5 rounded-full text-xs bg-neutral-100 text-neutral-800 w-max">{status}</span>
    }
}

export function OrderDetailDrawer({ order, children }: { order: Order; children: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const [isPending, setIsPending] = useState(false)

    const paymentLabel = order.paymentMethod === "COD" ? "Tiền mặt" : order.paymentMethod === "ZALOPAY" ? "ZaloPay" : "Chuyển khoản"

    async function handleUpdateStatus(newStatus: OrderStatus) {
        setIsPending(true)
        const result = await updateOrderStatus(order.id, newStatus)
        setIsPending(false)
        if (result?.success) {
            toast.success("Đã cập nhật trạng thái đơn hàng")
        } else {
            toast.error(result?.error || "Lỗi cập nhật trạng thái")
        }
    }

    async function handleDelete() {
        if (!confirm("Bạn có chắc chắn muốn xoá vĩnh viễn đơn hàng này?")) return
        setIsPending(true)
        const result = await deleteOrder(order.id)
        setIsPending(false)
        if (result?.success) {
            toast.success("Đã xoá đơn hàng")
            setOpen(false)
        } else {
            toast.error(result?.error || "Lỗi khi xoá đơn hàng")
        }
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                {children}
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="border-b pb-4">
                    <div className="flex items-center justify-between">
                        <DrawerTitle className="text-xl font-bold">
                            Đơn hàng #{order.orderNumber}
                        </DrawerTitle>
                        <StatusBadge status={order.status} />
                    </div>
                    <DrawerDescription>
                        {new Date(order.createdAt).toLocaleString("vi-VN")}
                    </DrawerDescription>
                </DrawerHeader>

                <div className="p-4 space-y-6 flex-1 overflow-y-auto">
                    {/* Customer Info */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider">Thông tin khách hàng</h3>
                        <div className="bg-neutral-50 rounded-lg p-4 space-y-2.5 border border-neutral-100">
                            <div className="flex items-center gap-2.5 text-sm">
                                <User className="w-4 h-4 text-neutral-400 shrink-0" />
                                <span className="font-semibold text-neutral-800">{order.customerName}</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-sm">
                                <Phone className="w-4 h-4 text-neutral-400 shrink-0" />
                                <span className="text-neutral-600">{order.customerPhone}</span>
                            </div>
                            {order.customerAddress && (
                                <div className="flex items-start gap-2.5 text-sm">
                                    <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                                    <span className="text-neutral-600">{order.customerAddress}</span>
                                </div>
                            )}
                            {order.customerNote && (
                                <div className="flex items-start gap-2.5 text-sm">
                                    <StickyNote className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                    <span className="text-amber-700 font-medium">{order.customerNote}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider">Chi tiết món</h3>
                        <div className="space-y-2">
                            {order.orderItems.map((item) => (
                                <div key={item.id} className="flex justify-between items-start p-3 bg-white rounded-lg border border-neutral-100">
                                    <div className="flex-1">
                                        <div className="text-sm font-semibold text-neutral-800">
                                            <span className="text-neutral-500 mr-1.5">{item.quantity}x</span>
                                            {item.product.name}
                                        </div>
                                        {item.modifiers.length > 0 && (
                                            <div className="text-xs text-neutral-500 mt-0.5">
                                                {item.modifiers.map(m => m.modifierName).join(", ")}
                                            </div>
                                        )}
                                        {item.note && (
                                            <div className="text-xs text-amber-600 mt-0.5 italic">Ghi chú: {item.note}</div>
                                        )}
                                    </div>
                                    <div className="text-sm font-bold text-neutral-900 ml-4 shrink-0">
                                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                                            (item.priceAtTime + item.modifiers.reduce((s, m) => s + m.modifierPrice, 0)) * item.quantity
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    {/* Payment Summary */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2 text-sm text-neutral-500">
                                <CreditCard className="w-4 h-4" />
                                Thanh toán
                            </div>
                            <div className="text-sm font-medium text-neutral-800">
                                {paymentLabel}
                                {order.paymentMethod === "ZALOPAY" && (
                                    <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${order.isPaid ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                                        {order.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-base font-bold text-neutral-800">Tổng cộng</span>
                            <span className="text-xl font-black text-red-600">
                                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(order.totalAmount)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <DrawerFooter className="border-t">
                    <div className="space-y-2 w-full flex flex-wrap">
                        {order.status === "PENDING" && (
                            <Button
                                onClick={() => handleUpdateStatus(OrderStatus.PREPARING)}
                                disabled={isPending}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                <ChefHat className="w-4 h-4 mr-2" /> Xác nhận & Làm món
                            </Button>
                        )}
                        {order.status === "PREPARING" && (
                            <Button
                                onClick={() => handleUpdateStatus(OrderStatus.DELIVERING)}
                                disabled={isPending}
                                className="bg-purple-600 hover:bg-purple-700"
                            >
                                <Truck className="w-4 h-4 mr-2" /> Giao cho khách
                            </Button>
                        )}
                        {order.status === "DELIVERING" && (
                            <Button
                                onClick={() => handleUpdateStatus(OrderStatus.COMPLETED)}
                                disabled={isPending}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                <Check className="w-4 h-4 mr-2" /> Hoàn thành Đơn
                            </Button>
                        )}
                        {(order.status === "PENDING" || order.status === "PREPARING") && (
                            <Button
                                onClick={() => handleUpdateStatus(OrderStatus.CANCELLED)}
                                disabled={isPending}
                                variant="outline"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                                <X className="w-4 h-4 mr-2" /> Huỷ đơn
                            </Button>
                        )}

                        <Separator />

                        <div className="flex gap-2">
                            <Button
                                onClick={handleDelete}
                                disabled={isPending}
                                variant="ghost"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                size="sm"
                            >
                                <Trash2 className="w-4 h-4 mr-1" /> Xoá
                            </Button>
                            <DrawerClose asChild>
                                <Button variant="outline" className="ml-auto" size="sm">
                                    Đóng
                                </Button>
                            </DrawerClose>
                        </div>
                    </div>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
