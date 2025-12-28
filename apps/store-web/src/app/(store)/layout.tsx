import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { StoreSidebar } from "@/components/layout/store-sidebar";
import { StoreHeader } from "@/components/layout/store-header";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <StoreSidebar />
      <SidebarInset>
        <StoreHeader />
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
