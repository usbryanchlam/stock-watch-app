import { Outlet } from "react-router-dom";
import AppHeader from "../components/AppHeader";

function AppLayout() {
  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-black text-white">
      <AppHeader />
      <Outlet />
    </div>
  );
}

export default AppLayout;
