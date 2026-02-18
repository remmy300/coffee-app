import Sidebar from "../../components/ui/Sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  console.log("AdminLayout mounted");

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 bg-muted/40">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
