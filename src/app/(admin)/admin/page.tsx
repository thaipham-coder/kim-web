import { redirect } from "next/navigation";

export default function AdminDashboardPage() {
  // Redirect to menu management as default for F&B app
  redirect("/admin/menu");
}
