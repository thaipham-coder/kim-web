import { prisma } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Edit, CheckCircle2, XCircle } from "lucide-react";
import { deleteProduct, toggleProductAvailability } from "./actions";

import { columns, Products } from "./_components/columns"
import { ProductTable } from "./_components/data-table"

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      _count: {
        select: { modifiers: true }
      }
    },
    orderBy: { createdAt: "desc" },
  }) as unknown as Products[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/menu" className="p-2 text-neutral-500 hover:text-neutral-900 bg-white rounded-md border border-neutral-200">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h2 className="lg:text-2xl font-bold text-neutral-800 tracking-tight">Quản lý Sản phẩm</h2>
        </div>
        <Link
          href="/admin/menu/products/new"
          className="flex items-center gap-2 bg-neutral-900 text-white px-2 lg:px-4 py-1 lg:py-2 rounded-full lg:rounded-xl hover:bg-neutral-800 transition-all font-bold shadow-lg shadow-neutral-900/10 active:scale-[0.98]"
        >
          <Plus className="w-5 h-5" /> <span className="hidden md:block">Thêm Món mới</span>
        </Link>
      </div>

      {/* <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden"> */}
      <ProductTable columns={columns} data={products} />
      {/* </div> */}

      {products.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-neutral-200">
          <div className="text-neutral-400 mb-2">Chưa có sản phẩm nào</div>
          <Link href="/admin/menu/products/new" className="text-blue-600 font-bold hover:underline">Tạo sản phẩm đầu tiên</Link>
        </div>
      )}
    </div>
  );
}
