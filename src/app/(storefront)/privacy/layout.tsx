import PolicyLayout from "@/components/PolicyLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chính sách bảo mật - Kim Coffee",
  description: "Chính sách bảo mật thông tin khách hàng tại Kim Coffee",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <PolicyLayout>{children}</PolicyLayout>;
}
