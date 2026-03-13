"use client"

import * as React from "react"
import {
    Coffee,
    LayoutDashboard,
    Settings,
    ShoppingBag,
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { NavAdmin } from "./nav-admin"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

export function AppSidebar({ user, ...props }: React.ComponentProps<typeof Sidebar> & { user: any }) {
    const pathname = usePathname()

    const navItems = [
        { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
        { title: "Menu", url: "/admin/menu", icon: Coffee },
        { title: "Orders", url: "/admin/orders", icon: ShoppingBag },
    ]

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-transparent">
                            <Link href="/admin">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-neutral-900 text-white group-data-[collapsible=icon]:mr-0">
                                    <Avatar>
                                        <AvatarImage src="https://res.cloudinary.com/duumeny9h/image/upload/v1772181740/logo-kim-2026_emx54a.jpg" />
                                        <AvatarFallback>K</AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none overflow-hidden group-data-[collapsible=icon]:hidden">
                                    <span className="font-semibold truncate">Kim Coffee</span>
                                    <span className="text-xs text-neutral-500 truncate">Admin Panel</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu className="px-2">
                    {navItems.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={pathname === item.url || pathname.startsWith(item.url + "/")}
                                tooltip={item.title}
                                className="transition-all duration-200"
                            >
                                <Link href={item.url}>
                                    <item.icon className="size-4" />
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                <NavAdmin user={user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
