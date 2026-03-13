"use client";

import { authClient } from "@/lib/auth-client";
import { Coffee } from "lucide-react";
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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-amber-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-20 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-yellow-200/20 rounded-full blur-2xl" />
      </div>

      {/* Login card */}
      <div className="relative max-w-sm w-full">
        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl shadow-amber-900/5 border border-white/60 text-center">
          {/* Logo */}
          <div className="relative mx-auto mb-6 w-20 h-20">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl rotate-6 opacity-20" />
            <div className="relative w-full h-full bg-gradient-to-br from-amber-600 to-orange-700 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/25">
              <Coffee className="w-10 h-10 text-white" strokeWidth={1.5} />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-bold text-neutral-900 mb-1 tracking-tight">
            Chào mừng bạn đến
          </h1>
          <p className="text-lg font-semibold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent mb-2">
            KIM Coffee & Fruit Tea
          </p>
          <p className="text-neutral-500 text-sm mb-8 leading-relaxed">
            Đăng nhập để đặt món yêu thích nhanh chóng
            <br />
            <span className="text-amber-700/60">☕ Thơm vị cà phê — mát lành trái cây</span>
          </p>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent" />
            <span className="text-xs text-neutral-400 uppercase tracking-widest font-medium">Đăng nhập</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent" />
          </div>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="group w-full bg-white hover:bg-neutral-50 text-neutral-700 rounded-2xl py-3.5 px-4 font-semibold text-[15px] transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-70 border border-neutral-200 hover:border-neutral-300 shadow-sm hover:shadow-md active:scale-[0.98]"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-amber-300 border-t-amber-600 rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            )}
            {isLoading ? "Đang kết nối..." : "Tiếp tục với Google"}
          </button>

          {/* Terms */}
          <p className="text-[11px] text-neutral-400 mt-6 leading-relaxed">
            Đăng nhập đồng nghĩa bạn đồng ý với{" "}
            <span className="text-amber-700/70 hover:text-amber-700 cursor-pointer transition-colors">
              Điều khoản
            </span>{" "}
            và{" "}
            <span className="text-amber-700/70 hover:text-amber-700 cursor-pointer transition-colors">
              Chính sách bảo mật
            </span>{" "}
            của chúng tôi.
          </p>
        </div>

        {/* Bottom branding */}
        <p className="text-center text-xs text-amber-800/40 mt-6 font-medium tracking-wide">
          © 2026 KIM Coffee & Fruit Tea
        </p>
      </div>
    </div>
  );
}
