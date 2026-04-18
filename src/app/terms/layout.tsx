import PolicyLayout from "@/components/PolicyLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Điều khoản dịch vụ - Kim Coffee",
  description: "Điều khoản và điều kiện khi sử dụng dịch vụ tại Kim Coffee",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PolicyLayout
      breadcrumb={[
        { label: "Trang chủ", href: "/" },
        { label: "Điều khoản dịch vụ" },
      ]}
    >
      {children}
    </PolicyLayout>
  );
}
