"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Upload } from "lucide-react";
import Link from "next/link";
import { CldUploadButton } from "next-cloudinary";
import { saveProduct } from "../actions";
import { toSlug } from "@/lib/utils";

type Category = { id: number; name: string };
type ModifierItem = { id?: number; name: string; price: number };
type ModifierGroup = { id?: number; name: string; isRequired: boolean; minSelection: number; maxSelection: number; items: ModifierItem[] };

interface ProductFormProps {
  categories: Category[];
  initialData?: any; // The product data if editing
}

export default function ProductForm({ categories, initialData }: ProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [isAutoGenerateSlug, setIsAutoGenerateSlug] = useState(!initialData?.id);

  const [modifiers, setModifiers] = useState<ModifierGroup[]>(
    initialData?.modifiers || []
  );
  const [image, setImage] = useState(initialData?.image || "");

  const addModifierGroup = () => {
    setModifiers([...modifiers, { name: "", isRequired: false, minSelection: 0, maxSelection: 1, items: [{ name: "", price: 0 }] }]);
  };

  const removeModifierGroup = (index: number) => {
    const newMods = [...modifiers];
    newMods.splice(index, 1);
    setModifiers(newMods);
  };

  const addModifierItem = (groupIndex: number) => {
    const newMods = [...modifiers];
    newMods[groupIndex].items.push({ name: "", price: 0 });
    setModifiers(newMods);
  };

  const removeModifierItem = (groupIndex: number, itemIndex: number) => {
    const newMods = [...modifiers];
    newMods[groupIndex].items.splice(itemIndex, 1);
    setModifiers(newMods);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !slug) {
      alert("Vui lòng nhập đầy đủ Tên món ăn và Slug");
      return;
    }
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    formData.append("modifiersJson", JSON.stringify(modifiers));
    if (initialData?.id) {
      formData.append("id", initialData.id.toString());
    }

    const result = await saveProduct(formData);
    if (result?.error) {
      alert(result.error);
      setIsSubmitting(false);
    } else {
      router.push("/admin/menu/products");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/menu/products" className="p-2 text-neutral-500 hover:text-neutral-900 bg-white rounded-md border border-neutral-200">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h2 className="lg:text-2xl font-bold text-neutral-800">
            {initialData ? "Chỉnh sửa Sản phẩm" : "Thêm Sản phẩm mới"}
          </h2>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-neutral-900 text-white px-6 py-2 rounded-md hover:bg-neutral-800 transition-colors font-medium disabled:opacity-50"
        >
          {isSubmitting ? "Đang lưu..." : "Lưu"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Basic Info */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-sm space-y-4">
            <h3 className="text-lg font-semibold text-neutral-800 border-b pb-2 mb-4">Thông tin cơ bản</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Tên món ăn <span className="text-red-500">*</span></label>
                <input
                  required
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => {
                    const newName = e.target.value;
                    setName(newName);
                    if (isAutoGenerateSlug) {
                      setSlug(toSlug(newName));
                    }
                  }}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-neutral-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Slug (Đường dẫn tĩnh) <span className="text-red-500">*</span></label>
                <input
                  required
                  type="text"
                  name="slug"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setIsAutoGenerateSlug(false);
                  }}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-neutral-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Giá bán (VNĐ) <span className="text-red-500">*</span></label>
                <input required type="number" name="price" defaultValue={initialData?.price || 0} min="0" className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-neutral-900 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Danh mục <span className="text-red-500">*</span></label>
                <select name="categoryId" required defaultValue={initialData?.categoryId || ""} className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-neutral-900 focus:outline-none bg-white">
                  <option value="" disabled>-- Chọn danh mục --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Mô tả ngắn</label>
              <textarea name="description" rows={3} defaultValue={initialData?.description} className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-neutral-900 focus:outline-none"></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Hình ảnh sản phẩm</label>
              <div className="flex flex-wrap gap-4 items-start">
                {image ? (
                  <div className="relative group w-40 h-40 border-2 border-neutral-200 rounded-xl overflow-hidden bg-neutral-50 shadow-sm">
                    <img
                      src={image}
                      alt="Product preview"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => setImage("")}
                        className="bg-white p-2 rounded-full text-red-600 hover:bg-red-50 transition-colors shadow-lg"
                        title="Xóa ảnh"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-40 h-40 border-2 border-dashed border-neutral-300 rounded-xl flex flex-col items-center justify-center bg-neutral-50 text-neutral-400">
                    <Upload className="w-8 h-8 mb-1" />
                    <span className="text-xs font-medium italic">Trống</span>
                  </div>
                )}

                <div className="flex-1 min-w-[200px]">
                  <CldUploadButton
                    signatureEndpoint="/api/sign-cloudinary-params"
                    uploadPreset="ml_default"
                    onSuccess={(result: any) => {
                      if (result?.info?.secure_url) {
                        setImage(result.info.secure_url);
                      }
                    }}
                    className="flex items-center gap-2 bg-white border border-neutral-300 px-4 py-2 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:border-neutral-400 transition-all shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    {image ? "Thay đổi hình ảnh" : "Tải lên từ thiết bị"}
                  </CldUploadButton>
                  <p className="mt-2 text-xs text-neutral-500 max-w-xs">
                    Hỗ trợ định dạng JPG, PNG, WEBP. Ảnh sẽ được tự động tối ưu hóa dung lượng.
                  </p>
                  <input type="hidden" name="image" value={image} />
                </div>
              </div>
            </div>

            <label className="flex items-center gap-2 mt-4 cursor-pointer">
              <input type="checkbox" name="isAvailable" value="true" defaultChecked={initialData ? initialData.isAvailable : true} className="w-4 h-4 text-neutral-900 border-neutral-300 rounded focus:ring-neutral-900" />
              <span className="text-sm font-medium text-neutral-700">Đang có sẵn (Mở bán)</span>
            </label>
          </div>

          {/* Modifiers Info */}
          <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h3 className="text-lg font-semibold text-neutral-800">Các Tuỳ chọn kèm theo (Size, Topping)</h3>
              <button type="button" onClick={addModifierGroup} className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"><Plus className="w-4 h-4" /> Thêm Nhóm</button>
            </div>

            {modifiers.length === 0 && <p className="text-neutral-500 text-sm text-center py-4">Món ăn này chưa có tuỳ chọn nào.</p>}

            {modifiers.map((group, groupIndex) => (
              <div key={groupIndex} className="border border-neutral-200 bg-neutral-50 rounded-md p-4 space-y-4 relative">
                <button type="button" onClick={() => removeModifierGroup(groupIndex)} className="absolute top-4 right-4 text-neutral-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pr-8">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-neutral-600 uppercase mb-1">Tên Nhóm (VD: Kích cỡ)</label>
                    <input required type="text" value={group.name} onChange={(e) => {
                      const newMods = [...modifiers]; newMods[groupIndex].name = e.target.value; setModifiers(newMods);
                    }} className="w-full px-2 py-1.5 border border-neutral-300 rounded text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 uppercase mb-1">Chọn tối thiểu</label>
                    <input required type="number" min="0" value={group.minSelection} onChange={(e) => {
                      const newMods = [...modifiers]; newMods[groupIndex].minSelection = parseInt(e.target.value); newMods[groupIndex].isRequired = parseInt(e.target.value) > 0; setModifiers(newMods);
                    }} className="w-full px-2 py-1.5 border border-neutral-300 rounded text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 uppercase mb-1">Chọn tối đa</label>
                    <input required type="number" min="1" value={group.maxSelection} onChange={(e) => {
                      const newMods = [...modifiers]; newMods[groupIndex].maxSelection = parseInt(e.target.value); setModifiers(newMods);
                    }} className="w-full px-2 py-1.5 border border-neutral-300 rounded text-sm" />
                  </div>
                </div>

                {/* Items */}
                <div className="pl-4 border-l-2 border-neutral-200 space-y-2 mt-4">
                  <h4 className="text-xs font-semibold text-neutral-600 uppercase flex justify-between items-center">
                    Danh sách lựa chọn
                    <button type="button" onClick={() => addModifierItem(groupIndex)} className="text-blue-600 hover:underline">Thêm dòng</button>
                  </h4>
                  {group.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center gap-2">
                      <input required type="text" placeholder="Tên (VD: Size S, Trân châu)" value={item.name} onChange={(e) => {
                        const newMods = [...modifiers]; newMods[groupIndex].items[itemIndex].name = e.target.value; setModifiers(newMods);
                      }} className="flex-1 px-2 py-1 border border-neutral-300 rounded text-sm" />
                      <input required type="number" placeholder="Giá cộng thêm" value={item.price} onChange={(e) => {
                        const newMods = [...modifiers]; newMods[groupIndex].items[itemIndex].price = parseInt(e.target.value) || 0; setModifiers(newMods);
                      }} className="w-32 px-2 py-1 border border-neutral-300 rounded text-sm" />
                      <button type="button" onClick={() => removeModifierItem(groupIndex, itemIndex)} className="p-1 text-neutral-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
}
