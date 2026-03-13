import Link from "next/link";
import { Coffee } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-200 mt-20">
      <div className="max-w-5xl mx-auto px-4 lg:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-neutral-900 text-white rounded-xl flex items-center justify-center">
                <Coffee className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl text-neutral-900 tracking-tight">Kim Coffee</span>
            </Link>
            <p className="text-neutral-500 text-sm leading-relaxed max-w-sm">
              Thưởng thức hương vị cà phê đậm đà và trà trái cây thanh mát. Không gian ly tưởng cho những giờ phút thư giãn của bạn.
            </p>
          </div>

          {/* Links 1 */}
          <div>
            <h3 className="font-bold text-neutral-900 mb-4">Về chúng tôi</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Giới thiệu</Link></li>
              <li><Link href="/" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Thực đơn</Link></li>
              <li><Link href="/" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Cửa hàng</Link></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h3 className="font-bold text-neutral-900 mb-4">Hỗ trợ khách hàng</h3>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Chính sách bảo mật</Link></li>
              <li><Link href="/terms" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Điều khoản dịch vụ</Link></li>
              <li><Link href="/" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Liên hệ</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-neutral-400">
            &copy; {new Date().getFullYear()} Kim Coffee & Fruit Tea.
          </div>
          <div className="text-sm text-neutral-400">
            Thiết kế bởi Đội ngũ Kim
          </div>
        </div>
      </div>
    </footer>
  );
}
