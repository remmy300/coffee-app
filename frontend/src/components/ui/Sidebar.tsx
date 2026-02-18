import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const Sidebar = () => {
  const { logout } = useAuth();

  return (
    <aside className="w-64 border-r bg-white p-4">
      <h2 className="text-xl font-semibold mb-6">Admin</h2>

      <div className="flex flex-col gap-2">
        <Link to="/admin/dashboard">
          <Button variant="ghost" className="w-full justify-start">
            Dashboard
          </Button>
        </Link>

        <Link to="/admin/products">
          <Button variant="ghost" className="w-full justify-start">
            Products
          </Button>
        </Link>

        <Link to="/admin/orders">
          <Button variant="ghost" className="w-full justify-start">
            Orders
          </Button>
        </Link>

        <Button variant="destructive" className="mt-6" onClick={logout}>
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
