import { Link } from "react-router-dom";
import { Sheet, SheetTrigger, SheetContent } from "./ui/sheet";

import CartModal from "./CartModal";
import { Menu } from "lucide-react";

const NavBar = () => {
  return (
    <div
      className="
        scrolled bg-white backdrop-blur-sm
        flex justify-between items-center shadow-sm rounded p-4 
        top-0 left-0 sticky z-50 transition-colors duration-300
        border-b border-gray-100
      "
    >
      <Link to="/" className="flex items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          <span className="text-amber-700">Roaster</span>
          <span>Bros</span>
        </h1>
      </Link>

      {/* Desktop nav */}
      <nav className="hidden md:flex justify-around items-center space-x-8 w-full max-w-lg">
        {["Home", "About", "Shop", "Contact"].map((item) => (
          <Link
            key={item}
            to={`/${item.toLowerCase()}`}
            className="
              relative pb-1 text-base font-medium text-gray-600
              hover:text-amber-700 transition-colors duration-200
              group
            "
          >
            {item}
            <span
              className="
                absolute left-0 bottom-0 w-0 h-0.5 bg-amber-700
                transition-all duration-300 ease-out
                group-hover:w-full
              "
            />
          </Link>
        ))}
      </nav>
      <div className="z-[60]">
        <CartModal />
      </div>

      {/* Mobile */}
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger className="focus:outline-none focus:ring-2 focus:ring-amber-700/50 rounded">
            <Menu size={24} className="text-gray-600 hover:text-amber-700" />
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] sm:w-[300px]">
            <div className="flex flex-col gap-6 mt-10 text-lg font-medium items-start px-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-amber-700 w-full py-2 border-b border-gray-100"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-amber-700 w-full py-2 border-b border-gray-100"
              >
                About Us
              </Link>
              <Link
                to="/shop"
                className="text-gray-700 hover:text-amber-700 w-full py-2 border-b border-gray-100"
              >
                Shop
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-amber-700 w-full py-2 border-b border-gray-100"
              >
                Contact Us
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default NavBar;
