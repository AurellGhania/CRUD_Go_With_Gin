import { SidebarProvider } from "../context/SidebarContext";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";

const AppHeaderLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen">
        <AppHeader />
        <div className="p-4 mx-auto max-w-screen-2xl md:p-6">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppHeaderLayout;
