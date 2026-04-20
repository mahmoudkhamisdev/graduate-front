import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "../../components/Sidebar/DashboardSidebar";
import { SidebarProvider } from "../../components/ui/sidebar";
import { Header } from "../../components/Dashboard/Header";

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      {/* {language !== "ar" && <AppSidebar />} */}
      <DashboardSidebar />
      <main className="w-full">
        <Header />
        <div className="p-5"> 
          <Outlet />
        </div>
      </main>
      {/* {language === "ar" && <AppSidebar />} */}
    </SidebarProvider>
  );
}
