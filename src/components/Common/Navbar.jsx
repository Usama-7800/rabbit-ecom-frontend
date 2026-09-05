import { Link, useLocation } from "react-router-dom";
import { FiUser, FiShoppingBag } from "react-icons/fi";
import { HiBars3BottomRight } from "react-icons/hi2";
import SearchBar from "./SearchBar";
import CartDrower from "../Layout/CartDrower";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";

export default function Navbar() {
  // Navigation Links configuration
  const navLinks = [
    // { name: "MEN", path: "/men" },
    { name: "MEN", path: "/collections/all?gender=Male" },
    { name: "WOMEN", path: "/collections/all?gender=Female" },
    { name: "TOP WEAR", path: "/collections/all?category=Top Wear" },
    { name: "BOTTOM WEAR", path: "/collections/all?category=Bottom Wear" },
  ];
  // states
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navMenu, setNavMenu] = useState(false);
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  // console.log("🔥 CART in Navbar:", cart);
  const cartItemCount =
    cart?.products?.reduce((total, product) => total + product.quantity, 0) ||
    0;

  // functions
  const toggleCartDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  const toggleNavMenu = () => {
    setNavMenu(!navMenu);
  };
  return (
    <>
      <nav className="w-full bg-white font-sans tracking-wide">
        <div className="max-w-7xl mx-auto h-16 px-4 md:px-8 flex items-center justify-between relative">
          {/* Left Side: rabbit-red Logo */}
          <div className="flex shrink-0">
            <Link
              to="/"
              className="text-xl font-bold text-gray-900 tracking-normal"
            >
              Rabbit
            </Link>
          </div>

          {/* Center: Navigation Links */}
          {/* Hidden on small mobile screens, perfectly aligned on desktop */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => {
              const linkUrl = new URL(link.path, window.location.origin);

              const isActive =
                linkUrl.pathname === location.pathname &&
                linkUrl.search === location.search;

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-[11px] font-semibold transition-colors duration-200 py-2 ${
                    isActive
                      ? "text-rabbit-red"
                      : "text-gray-700 hover:text-rabbit-red"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right Side: Action Icons */}
          <div className="flex items-center gap-4 text-gray-800">
            {user && user.role == "admin" && (
              <Link
                to="/admin"
                className="block bg-black px-2 py-0.5 rounded text-sm text-white"
              >
                Admin
              </Link>
            )}

            <Link
              to="/profile"
              className="p-1 hover:text-rabbit-red transition-colors"
              aria-label="Profile"
            >
              <FiUser size={20} strokeWidth={1.8} />
            </Link>
            <button
              className="p-1 hover:text-rabbit-red transition-colors relative inline-block"
              aria-label="Shopping Bag"
              onClick={toggleCartDrawer}
            >
              <FiShoppingBag size={19} strokeWidth={1.8} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rabbit-red text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full z-10">
                  {cartItemCount}
                </span>
              )}
              {/* Badge Element */}
              {/* {cartProducts.length > 0 && (
                
              )} */}
            </button>

            {/* serach  */}
            <div className="overflow-hidden">
              <SearchBar />
            </div>
            <button
              className="p-1 hover:text-rabbit-red transition-colors cursor-pointer block md:hidden"
              aria-label="Menu"
              onClick={toggleNavMenu}
            >
              <HiBars3BottomRight size={19} strokeWidth={0.5} />
            </button>
          </div>
        </div>
      </nav>
      <CartDrower drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />

      <div
        className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${navMenu ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* close button */}
        <div className="flex justify-end p-4">
          <button
            onClick={toggleNavMenu}
            className="flex items-center justify-center w-8 h-8   transition-colors"
          >
            <IoMdClose size={24} className="text-gray-900 cursor-pointer" />
          </button>
        </div>
        <div className="px-4 py-2">
          <h2>Menu</h2>
          {navLinks.map((link) => {
            const linkUrl = new URL(link.path, window.location.origin);
            const isActive =
              linkUrl.pathname === location.pathname &&
              linkUrl.search === location.search;

            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setNavMenu(false)}
                className={`block text-[11px] font-semibold transition-colors duration-200 py-2 ${
                  isActive
                    ? "text-rabbit-red"
                    : "text-gray-700 hover:text-rabbit-red"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
