"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";

export function Logout() {
    const router = useRouter();

    const handleLogout = async () => {
        // Clear cart on logout
        localStorage.removeItem("fb_cart");
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/login"); // redirect to login page
                },
            },
        });
    };

    return (
        <Button onClick={handleLogout} variant="ghost" className="text-neutral-500 hover:text-red-600 transition p-1" title="Đăng xuất">
            <LogOut className="w-5 h-5" />
            Đăng xuất
        </Button>
    );
}