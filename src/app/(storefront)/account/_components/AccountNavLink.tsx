"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function AccountNavLink({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors",
        isActive 
          ? "bg-neutral-900 text-white shadow-sm" 
          : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
      )}
    >
      <span className={cn(isActive ? "text-white" : "text-neutral-400")}>{icon}</span>
      {children}
    </Link>
  );
}
