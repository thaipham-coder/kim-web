import ProfileForm from "./_components/ProfileForm";
import { getUser } from "@/lib/dal";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";

export default async function ProfilePage() {
  const user = await getUser()

  if (!user) redirect("/login")

  const addresses = await prisma.address.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-neutral-900">Thông tin cá nhân</h2>
        <p className="text-sm text-neutral-500">Quản lý thông tin hồ sơ và địa chỉ của bạn.</p>
      </div>

      <ProfileForm user={user} addresses={addresses} />
    </div>
  );
}
