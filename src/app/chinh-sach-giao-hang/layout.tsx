import PolicyLayout from "@/components/PolicyLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chính sách giao hàng - Kim Coffee",
  description: "Quy định về việc giao nhận, kiểm tra hàng hóa và trách nhiệm của các bên đối với dịch vụ F&B trực tuyến.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PolicyLayout
      breadcrumb={[
        { label: "Trang chủ", href: "/" },
        { label: "Chính sách giao hàng và kiểm hàng" },
      ]}
    >
      {children}
    </PolicyLayout>
  );
}
