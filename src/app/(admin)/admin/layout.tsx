import { verifyAdmin } from "@/lib/dal";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { PushNotificationToggle } from "@/components/PushNotificationToggle";
import { OrderAnnouncer } from "@/components/OrderAnnouncer";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Protect the admin route with Role-based checking
  const session = await verifyAdmin();

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" user={session.user} />
      <SidebarInset>
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
          <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mx-2 data-[orientation=vertical]:h-4"
            />
            <h1 className="text-base font-medium">Admin Dashboard</h1>
            <div className="ml-auto">
              <PushNotificationToggle />
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto bg-neutral-50/50">
          <div className="p-4 md:p-8">
            {children}
          </div>
        </main>
      </SidebarInset>
      <OrderAnnouncer />
    </SidebarProvider>
  );
}
