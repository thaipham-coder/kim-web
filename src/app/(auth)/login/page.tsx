"use client";

import { authClient } from "@/lib/auth-client";
import { MessageCircle } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
      });
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl shadow-neutral-200/50 border border-neutral-100 text-center">
        <div className="w-16 h-16 bg-neutral-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
          <MessageCircle className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Đăng nhập tài khoản</h1>
        <p className="text-neutral-500 text-sm mb-8">
          Sử dụng Google để bắt đầu đặt món nhanh chóng tại KIM Cà Phê.
        </p>

        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full bg-[#0068FF] hover:bg-[#0054cc] text-white rounded-xl py-3.5 px-4 font-semibold text-base transition-colors flex items-center justify-center gap-3 disabled:opacity-70"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M21.5 12a9.5 9.5 0 10-9.5 9.5c1.16 0 2.29-.21 3.32-.61l4.06 1.13-1.25-3.8A9.45 9.45 0 0021.5 12z" />
            </svg>
          )}
          {isLoading ? "Đang kết nối..." : "Đăng nhập bằng Google"}
        </button>

        <p className="text-xs text-neutral-400 mt-6">
          Đăng nhập đồng nghĩa bạn đồng ý với Điều khoản và Chính sách của chúng tôi.
        </p>
      </div>
    </div>
  );
}
