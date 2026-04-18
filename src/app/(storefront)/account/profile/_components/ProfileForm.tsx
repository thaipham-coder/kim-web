"use client";

import { useState } from "react";
import { MapPin, Loader2, Plus, Trash2, Star, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateProfile } from "../actions";
import { createAddress, updateAddress, deleteAddress, setDefaultAddress } from "../address-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Address {
  id: string;
  label: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  isDefault: boolean;
}

interface ProfileFormProps {
  user: any;
  addresses: Address[];
}

const MAX_ADDRESSES = 3;

export default function ProfileForm({ user, addresses }: ProfileFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Address form state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressSubmitting, setAddressSubmitting] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [coords, setCoords] = useState<{ lat: number | null; lng: number | null }>({ lat: null, lng: null });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const result = await updateProfile(formData);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Cập nhật hồ sơ thành công");
    }
    setIsSubmitting(false);
  };

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
      () => {
        setIsGettingLocation(false);
        toast.error("Không thể lấy vị trí. Vui lòng cấp quyền truy cập vị trí.");
      }
    );
  };

  const openAddForm = () => {
    setEditingAddress(null);
    setCoords({ lat: null, lng: null });
    setShowAddressForm(true);
  };

  const openEditForm = (addr: Address) => {
    setEditingAddress(addr);
    setCoords({ lat: addr.latitude, lng: addr.longitude });
    setShowAddressForm(true);
  };

  const closeAddressForm = () => {
    setShowAddressForm(false);
    setEditingAddress(null);
    setCoords({ lat: null, lng: null });
  };

  const handleAddressSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAddressSubmitting(true);

    const formData = new FormData(e.currentTarget);
    if (coords.lat) formData.append("latitude", coords.lat.toString());
    if (coords.lng) formData.append("longitude", coords.lng.toString());

    let result;
    if (editingAddress) {
      formData.append("id", editingAddress.id);
      result = await updateAddress(formData);
    } else {
      result = await createAddress(formData);
    }

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(editingAddress ? "Cập nhật địa chỉ thành công" : "Thêm địa chỉ thành công");
      closeAddressForm();
      router.refresh();
    }
    setAddressSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn chắc chắn muốn xóa địa chỉ này?")) return;
    const result = await deleteAddress(id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Đã xóa địa chỉ");
      router.refresh();
    }
  };

  const handleSetDefault = async (id: string) => {
    const result = await setDefaultAddress(id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Đã đặt làm địa chỉ mặc định");
      router.refresh();
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Profile Info Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
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

      {/* Saved Addresses Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-neutral-900">Địa chỉ đã lưu</h3>
            <p className="text-sm text-neutral-500">Tối đa {MAX_ADDRESSES} địa chỉ</p>
          </div>
          {addresses.length < MAX_ADDRESSES && !showAddressForm && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={openAddForm}
              className="rounded-lg gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Thêm địa chỉ
            </Button>
          )}
        </div>

        {/* Address Cards */}
        <div className="space-y-3">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`p-4 rounded-2xl border transition-colors ${
                addr.isDefault
                  ? "border-neutral-900 bg-neutral-50"
                  : "border-neutral-200 bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-neutral-900 text-sm">{addr.label}</span>
                    {addr.isDefault && (
                      <span className="text-[10px] font-bold bg-neutral-900 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Mặc định
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-600 line-clamp-2">{addr.address}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {!addr.isDefault && (
                    <button
                      type="button"
                      onClick={() => handleSetDefault(addr.id)}
                      className="p-1.5 text-neutral-400 hover:text-amber-500 transition-colors"
                      title="Đặt làm mặc định"
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => openEditForm(addr)}
                    className="p-1.5 text-neutral-400 hover:text-neutral-900 transition-colors"
                    title="Sửa"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(addr.id)}
                    className="p-1.5 text-neutral-400 hover:text-red-500 transition-colors"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {addresses.length === 0 && !showAddressForm && (
            <div className="text-center py-8 text-neutral-400 text-sm border border-dashed border-neutral-200 rounded-2xl">
              <MapPin className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
              Chưa có địa chỉ nào được lưu.
            </div>
          )}
        </div>

        {/* Add/Edit Address Form */}
        {showAddressForm && (
          <form onSubmit={handleAddressSubmit} className="space-y-4 p-5 bg-neutral-50 border border-neutral-200 rounded-2xl">
            <h4 className="font-semibold text-neutral-900 text-sm">
              {editingAddress ? "Sửa địa chỉ" : "Thêm địa chỉ mới"}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label className="block text-xs font-medium text-neutral-600 mb-1">Nhãn *</label>
                <Input
                  name="label"
                  required
                  defaultValue={editingAddress?.label || ""}
                  placeholder="VD: Nhà, Công ty"
                  className="rounded-lg text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-neutral-600 mb-1">Địa chỉ *</label>
                <Input
                  name="address"
                  required
                  defaultValue={editingAddress?.address || ""}
                  placeholder="Số nhà, tên đường, phường/xã..."
                  className="rounded-lg text-sm"
                />
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-neutral-200">
              <div className="text-xs text-neutral-500">
                {coords.lat ? (
                  <span className="text-green-600 font-medium">✓ Tọa độ: {coords.lat.toFixed(4)}, {coords.lng?.toFixed(4)}</span>
                ) : (
                  "Chưa có tọa độ"
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleGetLocation}
                disabled={isGettingLocation}
                className="text-xs gap-1.5 h-7"
              >
                {isGettingLocation ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <MapPin className="w-3 h-3 text-red-500" />
                )}
                Lấy vị trí
              </Button>
            </div>

            <div className="flex items-center gap-2 justify-end">
              <Button type="button" variant="ghost" size="sm" onClick={closeAddressForm} className="rounded-lg">
                Hủy
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={addressSubmitting}
                className="rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white"
              >
                {addressSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : editingAddress ? "Cập nhật" : "Thêm"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
