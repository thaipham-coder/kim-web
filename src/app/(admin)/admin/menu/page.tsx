export default function MenuManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-neutral-800">Quản lý Thực đơn</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <a href="/admin/menu/categories" className="block p-6 bg-white border border-neutral-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-neutral-800 mb-2">Danh mục món (Categories)</h3>
          <p className="text-neutral-500 text-sm">Quản lý các nhóm món ăn như "Cà phê", "Trà sữa", "Ăn vặt".</p>
        </a>
        <a href="/admin/menu/products" className="block p-6 bg-white border border-neutral-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-neutral-800 mb-2">Sản phẩm (Products)</h3>
          <p className="text-neutral-500 text-sm">Quản lý chi tiết từng món ăn, giá tiền, hình ảnh và tuỳ chọn kèm theo.</p>
        </a>
      </div>
    </div>
  );
}
