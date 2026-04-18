import PolicyLayout from "@/components/PolicyLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chính sách thanh toán - Kim Coffee",
  description: "Quy định về liên kết tài khoản ZaloPay, các phương thức thanh toán và cam kết an toàn dữ liệu khách hàng.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PolicyLayout
      breadcrumb={[
        { label: "Trang chủ", href: "/" },
        { label: "Chính sách thanh toán và Cam kết bảo mật" },
      ]}
    >
      {children}
    </PolicyLayout>
  );
}
