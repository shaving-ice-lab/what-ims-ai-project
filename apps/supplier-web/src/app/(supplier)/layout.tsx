import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SupplierSidebar } from "@/components/layout/supplier-sidebar";
import { SupplierHeader } from "@/components/layout/supplier-header";

export default function SupplierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <SupplierSidebar />
      <SidebarInset>
        <SupplierHeader />
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
