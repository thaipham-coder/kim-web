import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ProfileForm from "./_components/ProfileForm";

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-neutral-900">Thông tin cá nhân</h2>
        <p className="text-sm text-neutral-500">Quản lý thông tin hồ sơ và địa chỉ mặc định của bạn.</p>
      </div>

      <ProfileForm user={session.user} />
    </div>
  );
}
