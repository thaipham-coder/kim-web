"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Coffee, Mail, Lock, User, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

const GoogleIcon = () => (
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
);

type AuthMode = "select" | "login" | "register";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<AuthMode>("select");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Reset loading state khi user quay lại trang (back từ Google OAuth)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        setIsLoading(false);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // Clear cart on login
      localStorage.removeItem("fb_cart");
      await authClient.signIn.social({
        provider: "google",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      localStorage.removeItem("fb_cart");
      const result = await authClient.signIn.email({
        email,
        password,
      });
      if (result.error) {
        setError(result.error.message || "Email hoặc mật khẩu không đúng");
      }
    } catch {
      setError("Đã xảy ra lỗi, vui lòng thử lại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự");
      return;
    }

    setIsLoading(true);
    try {
      localStorage.removeItem("fb_cart");
      const result = await authClient.signUp.email({
        name,
        email,
        password,
      });
      if (result.error) {
        setError(result.error.message || "Không thể tạo tài khoản");
      }
    } catch {
      setError("Đã xảy ra lỗi, vui lòng thử lại");
    } finally {
      setIsLoading(false);
    }
  };

  const resetToSelect = () => {
    setMode("select");
    setError("");
    setShowPassword(false);
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
            {mode === "select" && (
              <>
                Đăng nhập để đặt món yêu thích nhanh chóng
                <br />
                <span className="text-amber-700/60">☕ Thơm vị cà phê — mát lành trái cây</span>
              </>
            )}
            {mode === "login" && "Đăng nhập bằng email và mật khẩu"}
            {mode === "register" && "Tạo tài khoản mới để bắt đầu"}
          </p>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}

          {/* ======= SELECT MODE ======= */}
          {mode === "select" && (
            <>
              {/* Divider */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent" />
                <span className="text-xs text-neutral-400 uppercase tracking-widest font-medium">Đăng nhập</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent" />
              </div>

              {/* Google Login */}
              <Button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full bg-white hover:bg-neutral-50 text-neutral-700 rounded-full transition-all duration-200 disabled:opacity-70 border border-neutral-200 hover:border-neutral-300 shadow-sm hover:shadow-md active:scale-[0.98] mb-3"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-amber-300 border-t-amber-600 rounded-full animate-spin" />
                ) : (
                  <GoogleIcon />
                )}
                {isLoading ? "Đang kết nối..." : "Tiếp tục với Google"}
              </Button>

              {/* Email Login Button */}
              <Button
                onClick={() => setMode("login")}
                variant="outline"
                className="w-full rounded-full transition-all duration-200 border-neutral-200 hover:border-amber-300 hover:bg-amber-50/50 active:scale-[0.98]"
              >
                <Mail className="w-4 h-4" />
                Đăng nhập bằng Email
              </Button>

              {/* Register link */}
              <p className="text-sm text-neutral-500 mt-4">
                Chưa có tài khoản?{" "}
                <button
                  onClick={() => setMode("register")}
                  className="text-amber-700 hover:text-amber-800 font-medium transition-colors"
                >
                  Đăng ký
                </button>
              </p>
            </>
          )}

          {/* ======= LOGIN MODE ======= */}
          {mode === "login" && (
            <>
              <form onSubmit={handleEmailLogin} className="space-y-3 text-left">
                {/* Email */}
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    id="login-email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition-all"
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-11 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-full shadow-md shadow-amber-500/20 transition-all duration-200 active:scale-[0.98] disabled:opacity-70"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : null}
                  {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                </Button>
              </form>

              {/* Switch to register */}
              <p className="text-sm text-neutral-500 mt-4">
                Chưa có tài khoản?{" "}
                <button
                  onClick={() => { setMode("register"); setError(""); }}
                  className="text-amber-700 hover:text-amber-800 font-medium transition-colors"
                >
                  Đăng ký
                </button>
              </p>

              {/* Back */}
              <button
                onClick={resetToSelect}
                className="flex items-center gap-1.5 mx-auto mt-3 text-sm text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Quay lại
              </button>
            </>
          )}

          {/* ======= REGISTER MODE ======= */}
          {mode === "register" && (
            <>
              <form onSubmit={handleRegister} className="space-y-3 text-left">
                {/* Name */}
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    id="register-name"
                    type="text"
                    placeholder="Họ và tên"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition-all"
                  />
                </div>

                {/* Email */}
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    id="register-email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition-all"
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mật khẩu (ít nhất 8 ký tự)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full pl-10 pr-11 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-full shadow-md shadow-amber-500/20 transition-all duration-200 active:scale-[0.98] disabled:opacity-70"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : null}
                  {isLoading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
                </Button>
              </form>

              {/* Switch to login */}
              <p className="text-sm text-neutral-500 mt-4">
                Đã có tài khoản?{" "}
                <button
                  onClick={() => { setMode("login"); setError(""); }}
                  className="text-amber-700 hover:text-amber-800 font-medium transition-colors"
                >
                  Đăng nhập
                </button>
              </p>

              {/* Back */}
              <button
                onClick={resetToSelect}
                className="flex items-center gap-1.5 mx-auto mt-3 text-sm text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Quay lại
              </button>
            </>
          )}

          {/* Terms */}
          <p className="text-[11px] text-neutral-400 mt-6 leading-relaxed">
            Đăng nhập đồng nghĩa bạn đồng ý với{" "}
            <Link href="/terms" className="text-amber-700/70 hover:text-amber-700 cursor-pointer transition-colors">
              Điều khoản
            </Link>{" "}
            và{" "}
            <Link href="/privacy" className="text-amber-700/70 hover:text-amber-700 cursor-pointer transition-colors">
              Chính sách bảo mật
            </Link>{" "}
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
