"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/cartStore";
import { Plus, Minus, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddToCartFormProps {
  product: any; // Include modifiers and items
}

export default function AddToCartForm({ product }: AddToCartFormProps) {
  const router = useRouter();
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  // Store selected modifier item IDs grouped by group ID
  const [selections, setSelections] = useState<Record<number, number[]>>({});

  const toggleSelection = (groupId: number, itemId: number, maxSelection: number, minSelection: number) => {
    setSelections(prev => {
      const current = prev[groupId] || [];
      if (current.includes(itemId)) {
        // Hủy chọn
        if (current.length <= minSelection && minSelection > 0) return prev;
        return { ...prev, [groupId]: current.filter(id => id !== itemId) };
      } else {
        // Chọn
        if (maxSelection === 1) {
          return { ...prev, [groupId]: [itemId] }; // Radio behavior
        } else if (current.length < maxSelection) {
          return { ...prev, [groupId]: [...current, itemId] }; // Checkbox behavior
        }
        return prev;
      }
    });
  };

  const calculateTotal = () => {
    let modifierTotal = 0;
    product.modifiers.forEach((group: any) => {
      const selectedIds = selections[group.id] || [];
      group.items.forEach((item: any) => {
        if (selectedIds.includes(item.id)) modifierTotal += item.price;
      });
    });
    return (product.price + modifierTotal) * quantity;
  };

  const getSelectedModifiersData = () => {
    const mods: any[] = [];
    product.modifiers.forEach((group: any) => {
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
    for (const group of product.modifiers) {
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
      note,
      itemTotal: calculateTotal()
    });

    router.push("/");
  };

  return (
    <div className="bg-white p-6 rounded-t-3xl md:rounded-3xl shadow-lg border border-neutral-100 flex-1 sticky top-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-900 leading-tight">{product.name}</h2>
        {product.description && <p className="text-neutral-500 mt-2">{product.description}</p>}
        <div className="text-xl font-extrabold text-neutral-900 mt-3">
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
        </div>
      </div>

      <div className="space-y-8">
        {product.modifiers.map((group: any) => (
          <div key={group.id} className="pb-6 border-b border-neutral-50 last:border-0 last:pb-0">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold text-neutral-900 flex items-center gap-2">
                  {group.name}
                  {group.isRequired && (
                    <span className="text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Bắt buộc</span>
                  )}
                </h3>
                {group.maxSelection > 1 && (
                  <p className="text-xs text-neutral-400 mt-0.5 font-medium">Chọn tối đa {group.maxSelection}</p>
                )}
              </div>
              {group.isRequired && (selections[group.id]?.length || 0) < group.minSelection && (
                <span className="text-[10px] font-bold text-red-400 animate-pulse">Chưa chọn</span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-2">
              {group.items.map((item: any) => {
                const isSelected = (selections[group.id] || []).includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleSelection(group.id, item.id, group.maxSelection, group.minSelection)}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-xl border transition-all duration-200 text-left",
                      isSelected
                        ? "bg-neutral-900 border-neutral-900 text-white shadow-md shadow-neutral-900/10"
                        : "bg-white border-neutral-200 text-neutral-700 hover:border-neutral-900/30"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center border transition-colors",
                        isSelected ? "bg-white border-white text-neutral-900" : "bg-neutral-50 border-neutral-300"
                      )}>
                        {isSelected && <Plus className="w-3.5 h-3.5 rotate-45 stroke-[3]" />}
                      </div>
                      <span className="font-bold text-sm tracking-tight">{item.name}</span>
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

        {/* <div className="pt-2">
          <h3 className="font-bold text-neutral-900 mb-3 text-sm uppercase tracking-wider">Ghi chú cho quán</h3>
          <textarea
            placeholder="Ví dụ: Ít đá, nhiều sữa, không lấy ống hút..."
            rows={3}
            value={note}
            onChange={e => setNote(e.target.value)}
            className="w-full border border-neutral-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-neutral-900 focus:border-transparent focus:outline-none bg-neutral-50 transition-all placeholder:text-neutral-400"
          ></textarea>
        </div> */}

        <div className="flex items-center gap-4 py-4 md:pt-6">
          <div className="flex items-center border border-neutral-200 rounded-2xl p-1 bg-neutral-100/50 backdrop-blur-sm">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-11 h-11 flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:bg-white rounded-xl transition-all hover:shadow-sm"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-10 text-center font-black text-xl text-neutral-900">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-11 h-11 flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:bg-white rounded-xl transition-all hover:shadow-sm"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex-1 bg-neutral-900 text-white rounded-2xl py-4 font-black text-lg hover:bg-neutral-800 transition-all shadow-xl shadow-neutral-900/20 active:scale-[0.98] flex items-center justify-center gap-3"
          >
            Thêm • {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(calculateTotal())}
          </button>
        </div>
      </div>
    </div>
  );
}
