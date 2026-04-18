"use client";

import { useEffect, useRef } from "react";
import { useSpeech } from "@/hooks/useSpeech";

const SESSION_KEY = "kim-startup-announced";

/**
 * OrderAnnouncer — Hệ thống thoại tự động cho Admin Dashboard
 *
 * 1. Startup: Phát câu chào khi PWA khởi động (1 lần/session)
 * 2. Connection: Check DB health → phát xác nhận kết nối
 * 3. Push: Đọc to nội dung đơn hàng từ push notification
 */
export function OrderAnnouncer() {
  const { speak, speakEvent } = useSpeech();
  const hasRunStartup = useRef(false);

  // ======================================
  // Startup + Connection Speech
  // ======================================
  useEffect(() => {
    if (hasRunStartup.current) return;
    if (!("speechSynthesis" in window)) return;

    // Chỉ phát 1 lần mỗi session (tắt máy → mở lại = session mới)
    if (sessionStorage.getItem(SESSION_KEY)) return;

    hasRunStartup.current = true;

    const runStartupSequence = async () => {
      // Bước 1: "Hệ thống đang thiết lập kết nối, vui lòng chờ ít phút"
      await speakEvent("APP_STARTUP");

      // Bước 2: Kiểm tra kết nối DB thật
      try {
        const res = await fetch("/api/health");
        const data = await res.json();

        if (data.status === "ok") {
          // Bước 3: "Liên kết hoàn tất. Cơ sở dữ liệu đã trực tuyến"
          await speakEvent("CONNECTION_READY");
        }
      } catch (error) {
        console.warn("[Startup] Health check failed:", error);
      }

      // Đánh dấu đã phát trong session này
      sessionStorage.setItem(SESSION_KEY, "done");
    };

    runStartupSequence();
  }, [speakEvent]);

  // ======================================
  // Push Notification Speech (giữ nguyên)
  // ======================================
  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("speechSynthesis" in window)) {
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type !== "PUSH_RECEIVED") return;

      const { title, body } = event.data;
      const text = `${title}. ${body}`;

      speak(text);
    };

    navigator.serviceWorker.addEventListener("message", handleMessage);

    return () => {
      navigator.serviceWorker.removeEventListener("message", handleMessage);
    };
  }, [speak]);

  return null; // Invisible component
}
