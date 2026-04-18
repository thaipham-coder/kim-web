"use client"

import { useState } from "react"
import { useCart } from "@/store/cartStore"
import { useRouter } from "next/navigation"
import { Plus, Minus } from "lucide-react"
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { cn } from "@/lib/utils"

interface QuickAddDrawerProps {
    product: any; // Full product with modifiers
    trigger: React.ReactNode;
}

export function QuickAddDrawer({ product, trigger }: QuickAddDrawerProps) {
    const router = useRouter()
    const { addToCart } = useCart()
    
    const [open, setOpen] = useState(false)
    const [quantity, setQuantity] = useState(1)
    const [selections, setSelections] = useState<Record<number, number[]>>({})

    const toggleSelection = (groupId: number, itemId: number, maxSelection: number, minSelection: number) => {
        setSelections(prev => {
            const current = prev[groupId] || [];
            if (current.includes(itemId)) {
                if (current.length <= minSelection && minSelection > 0) return prev;
                return { ...prev, [groupId]: current.filter(id => id !== itemId) };
            } else {
                if (maxSelection === 1) {
                    return { ...prev, [groupId]: [itemId] };
                } else if (current.length < maxSelection) {
                    return { ...prev, [groupId]: [...current, itemId] };
                }
                return prev;
            }
        });
    };

    const calculateTotal = () => {
        let modifierTotal = 0;
        product.modifiers?.forEach((group: any) => {
            const selectedIds = selections[group.id] || [];
            group.items.forEach((item: any) => {
                if (selectedIds.includes(item.id)) modifierTotal += item.price;
            });
        });
        return (product.price + modifierTotal) * quantity;
    };

    const getSelectedModifiersData = () => {
        const mods: any[] = [];
        product.modifiers?.forEach((group: any) => {
            const selectedIds = selections[group.id] || [];
            group.items.forEach((item: any) => {
                if (selectedIds.includes(item.id)) {
                    mods.push({
                        modifierItemId: item.id,
                        modifierName: item.name,
                        modifierPrice: item.price,
                        groupName: group.name
                    });
                }
            });
        });
        return mods;
    };

    const handleAddToCart = () => {
        for (const group of (product.modifiers || [])) {
            const selected = selections[group.id] || [];
            if (group.isRequired && selected.length < group.minSelection) {
                alert(`Vui lòng chọn ít nhất ${group.minSelection} mục cho ${group.name}`);
                return;
            }
        }

        addToCart({
            product: { id: product.id, name: product.name, price: product.price, image: product.image },
            quantity,
            selectedModifiers: getSelectedModifiersData(),
            note: "",
            itemTotal: calculateTotal()
        });

        // Đóng Drawer và reset
        setOpen(false)
        setQuantity(1)
        setSelections({})
    };

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                {trigger}
            </DrawerTrigger>
            <DrawerContent className="max-h-[85vh] fixed bottom-0 left-0 right-0 z-[100] rounded-t-3xl md:hidden">
                <DrawerHeader className="text-left py-4 border-b border-neutral-100 flex flex-col gap-1">
                    <DrawerTitle className="text-xl font-bold">{product.name}</DrawerTitle>
                    <DrawerDescription className="text-lg font-bold text-neutral-900">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                    </DrawerDescription>
                </DrawerHeader>

                <div className="overflow-y-auto p-4 space-y-6 pb-28">
                    {product.modifiers?.map((group: any) => (
                        <div key={group.id} className="pb-4">
                            <div className="flex justify-between items-center mb-3">
                                <div>
                                    <h3 className="font-bold text-neutral-900">{group.name}</h3>
                                    {group.maxSelection > 1 && (
                                        <p className="text-xs text-neutral-500">Chọn tối đa {group.maxSelection}</p>
                                    )}
                                </div>
                                {group.isRequired && (selections[group.id]?.length || 0) < group.minSelection && (
                                    <span className="text-[10px] bg-red-50 text-red-600 px-2 py-1 rounded font-bold uppercase tracking-wider">Bắt buộc</span>
                                )}
                            </div>

                            <div className="space-y-2">
                                {group.items.map((item: any) => {
                                    const isSelected = (selections[group.id] || []).includes(item.id);
                                    return (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => toggleSelection(group.id, item.id, group.maxSelection, group.minSelection)}
                                            className={cn(
                                                "w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left",
                                                isSelected
                                                    ? "bg-neutral-900 border-neutral-900 text-white"
                                                    : "bg-white border-neutral-200 text-neutral-700"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-5 h-5 rounded-full flex items-center justify-center border",
                                                    isSelected ? "bg-white border-white text-neutral-900" : "bg-neutral-50 border-neutral-300"
                                                )}>
                                                    {isSelected && <Plus className="w-3.5 h-3.5 rotate-45 stroke-[3]" />}
                                                </div>
                                                <span className="font-semibold text-sm">{item.name}</span>
                                            </div>
                                            {item.price > 0 && (
                                                <span className={cn(
                                                    "text-xs font-bold px-2 py-1 rounded-lg",
                                                    isSelected ? "bg-white/20" : "bg-neutral-100 text-neutral-500"
                                                )}>
                                                    +{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                    
                    {(!product.modifiers || product.modifiers.length === 0) && (
                        <div className="py-8 text-center text-neutral-500 text-sm">
                            Sản phẩm này không có tùy chọn (Size, Topping...). Bạn có thể chọn số lượng và thêm vào giỏ.
                        </div>
                    )}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-neutral-100 flex items-center gap-4 pb-safe shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center border border-neutral-200 rounded-2xl p-1 bg-neutral-50">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center text-neutral-500 hover:text-neutral-900">
                            <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-bold text-neutral-900">{quantity}</span>
                        <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center text-neutral-500 hover:text-neutral-900">
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        className="flex-1 bg-neutral-900 text-white rounded-2xl py-3.5 font-bold text-base hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                    >
                        <span>Thêm</span>
                        <span>•</span>
                        <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(calculateTotal())}</span>
                    </button>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
