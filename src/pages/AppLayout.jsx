import { Outlet } from "react-router-dom";
import AppHeader from "../components/AppHeader";

function AppLayout() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-black text-white">
      <AppHeader />
      <Outlet />
    </div>
  );
}

export default AppLayout;
