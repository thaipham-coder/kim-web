"use client";

import { useState } from "react";
import { MapPin, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateProfile } from "../actions";
import { toast } from "sonner";

interface ProfileFormProps {
  user: any;
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [coords, setCoords] = useState({
    lat: user.latitude || null,
    lng: user.longitude || null,
  });

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Trình duyệt của bạn không hỗ trợ định vị");
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsGettingLocation(false);
        toast.success("Đã lấy vị trí hiện tại");
      },
      (error) => {
        console.error("Location error:", error);
        setIsGettingLocation(false);
        toast.error("Không thể lấy vị trí. Vui lòng cấp quyền truy cập vị trí.");
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    formData.append("latitude", coords.lat?.toString() || "");
    formData.append("longitude", coords.lng?.toString() || "");

    const result = await updateProfile(formData);

    if (result.error) {
      toast.error(result.error);
      setIsSubmitting(false);
    } else {
      toast.success("Cập nhật hồ sơ thành công");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="space-y-4">
        {/* Name */}
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-semibold text-neutral-700">
            Họ và tên <span className="text-red-500">*</span>
          </label>
          <Input
            id="name"
            name="name"
            defaultValue={user.name || ""}
            placeholder="VD: Nguyễn Văn A"
            required
            className="rounded-xl border-neutral-200 focus:ring-neutral-900"
          />
        </div>

        {/* Email - Read Only */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-semibold text-neutral-700">
            Email
          </label>
          <Input
            id="email"
            defaultValue={user.email}
            readOnly
            className="rounded-xl border-neutral-200 bg-neutral-50 text-neutral-500 cursor-not-allowed"
          />
          <p className="text-[10px] text-neutral-400 italic">Email không thể thay đổi.</p>
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-semibold text-neutral-700">
            Số điện thoại <span className="text-red-500">*</span>
          </label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            pattern="[0-9]{10}"
            defaultValue={user.phone || ""}
            placeholder="Nhập 10 chữ số (VD: 0912345678)"
            required
            className="rounded-xl border-neutral-200 focus:ring-neutral-900"
          />
        </div>

        {/* Address */}
        <div className="space-y-2">
          <label htmlFor="defaultAddress" className="text-sm font-semibold text-neutral-700">
            Địa chỉ nhận hàng mặc định <span className="text-red-500">*</span>
          </label>
          <Input
            id="defaultAddress"
            name="defaultAddress"
            defaultValue={user.defaultAddress || ""}
            placeholder="Số nhà, tên đường, phường/xã..."
            required
            className="rounded-xl border-neutral-200 focus:ring-neutral-900"
          />
        </div>

        {/* Location */}
        <div className="space-y-2 p-4 bg-neutral-50 rounded-2xl border border-neutral-200 border-dashed">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-neutral-700">Tọa độ vị trí</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGetLocation}
              disabled={isGettingLocation}
              className="rounded-lg gap-2 text-xs"
            >
              {isGettingLocation ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <MapPin className="w-3 h-3 text-red-500" />
              )}
              {coords.lat ? "Cập nhật vị trí" : "Lấy vị trí hiện tại"}
            </Button>
          </div>
          
          {coords.lat ? (
            <div className="flex items-center gap-2 text-xs text-green-600 font-medium">
              <CheckCircle2 className="w-3 h-3" />
              Đã xác định tọa độ: {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
            </div>
          ) : (
            <p className="text-xs text-neutral-500 italic">
              Vui lòng cho phép truy cập vị trí để chúng tôi giao hàng chính xác hơn.
            </p>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-neutral-100 flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl px-8 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold transition-all h-11"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang lưu...
            </>
          ) : (
            "Lưu thay đổi"
          )}
        </Button>
      </div>
    </form>
  );
}
