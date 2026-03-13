import { prisma } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { createCategory } from "./actions";
import { columns, Category } from "./_components/columns"
import { CategoryTable } from "./_components/data-table"

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  }) as unknown as Category[];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/menu" className="p-2 text-neutral-500 hover:text-neutral-900 bg-white rounded-md border border-neutral-200">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h2 className="text-2xl font-bold text-neutral-800 tracking-tight">Danh mục món ăn</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bảng Danh sách */}
        <div className="col-span-2 space-y-4">
          {/* <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden"> */}
          <CategoryTable columns={columns} data={categories} />
          {/* </div> */}
        </div>

        {/* Form thêm mới */}
        <div className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm self-start sticky top-24">
          <h3 className="text-lg font-bold text-neutral-900 mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-neutral-400" />
            Tạo danh mục mới
          </h3>
          <form action={async (formData) => { "use server"; await createCategory(formData); }} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-sm font-bold text-neutral-700 ml-1">Tên danh mục</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all"
                placeholder="VD: Cà phê, Trà sữa..."
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="slug" className="text-sm font-bold text-neutral-700 ml-1">Slug (Đường dẫn)</label>
              <input
                type="text"
                id="slug"
                name="slug"
                required
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all font-mono text-sm"
                placeholder="VD: ca-phe, tra-sua"
              />
              <p className="text-[10px] text-neutral-400 font-medium px-1">Dùng tiếng Việt không dấu, nối bằng dấu gạch ngang.</p>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="sortOrder" className="text-sm font-bold text-neutral-700 ml-1">Thứ tự hiển thị</label>
              <input
                type="number"
                id="sortOrder"
                name="sortOrder"
                defaultValue={0}
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-neutral-900 text-white px-4 py-3 rounded-xl hover:bg-neutral-800 transition-all font-bold mt-2 shadow-lg shadow-neutral-900/10 active:scale-[0.98]"
            >
              <Plus className="w-5 h-5" /> Thêm Danh mục
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
