"use client";

import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useSpeech } from "@/hooks/useSpeech";
import { Bell, BellOff, BellRing, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function PushNotificationToggle() {
  const {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    subscribe,
    unsubscribe,
  } = usePushNotifications();
  const { speakEvent } = useSpeech();

  if (!isSupported) {
    return null;
  }

  const handleToggle = async () => {
    if (isSubscribed) {
      const success = await unsubscribe();
      if (success) {
        toast.success("Đã tắt thông báo đẩy");
      } else {
        toast.error("Không thể tắt thông báo");
      }
    } else {
      const success = await subscribe();
      if (success) {
        toast.success("Đã bật thông báo đẩy! Bạn sẽ nhận thông báo khi có đơn hàng mới.");
        // Phát câu thoại "Cảm ơn quý khách"
        speakEvent("NOTIFICATION_ENABLED");
      } else if (permission === "denied") {
        toast.error("Bạn đã chặn thông báo. Vui lòng mở cài đặt trình duyệt để cho phép.");
      } else {
        toast.error("Không thể bật thông báo");
      }
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      title={
        isSubscribed
          ? "Tắt thông báo đẩy"
          : permission === "denied"
            ? "Thông báo đã bị chặn"
            : "Bật thông báo đẩy"
      }
      className={`
        relative flex items-center justify-center w-9 h-9 rounded-lg
        transition-all duration-200
        ${isSubscribed
          ? "bg-green-100 text-green-700 hover:bg-green-200"
          : permission === "denied"
            ? "bg-red-50 text-red-400 cursor-not-allowed"
            : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
        }
        disabled:opacity-50
      `}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isSubscribed ? (
        <BellRing className="w-4 h-4" />
      ) : permission === "denied" ? (
        <BellOff className="w-4 h-4" />
      ) : (
        <Bell className="w-4 h-4" />
      )}

      {/* Active indicator dot */}
      {isSubscribed && !isLoading && (
        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
      )}
    </button>
  );
}
