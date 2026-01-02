import React, { Fragment, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Search, User, Heart, ShoppingBag, X } from "lucide-react";
import { fetchAllOptions } from "../../action/common.action.js";
import { useSessionStorage } from "../../Contaxt/SessionStorageContext.jsx";
import { useServerWishList } from "../../Contaxt/ServerWishListContext.jsx";
import { useServerAuth } from "../../Contaxt/AuthContext.jsx";
import SearchComponent from "./Search.jsx";
import ProductCatView from "./Submenu/ProductCatView.jsx";
import Profile from "./Submenu/Profile";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import MNavbar from "./MobileNav/MNavbar";

const Navbar = () => {
  const { user } = useServerAuth();
  const dispatch = useDispatch();
  const location = useLocation();

  const [currentWishListCount, setWishListCount] = useState(0);
  const [currentBagCount, setBagCount] = useState(0);
  const { sessionData, sessionBagData } = useSessionStorage();
  const { wishlist, bag } = useServerWishList();
  const { options } = useSelector((state) => state.AllOptions);

  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Fetch options on mount
  useEffect(() => {
    dispatch(fetchAllOptions());
  }, [dispatch]);

  // Update counts
  useEffect(() => {
    if (user) {
      setWishListCount(wishlist?.orderItems?.length || 0);
      setBagCount(bag?.orderItems?.length || 0);
    } else {
      setWishListCount(sessionData?.length || 0);
      setBagCount(sessionBagData?.length || 0);
    }
  }, [wishlist, bag, user, sessionData, sessionBagData]);

  const handleMenuHover = (menuName, show) => {
    if (show) {
      setActiveMenu(menuName);
    } else {
      setActiveMenu(null);
    }
  };

  const navLinks = [
    { name: "HOME", path: "/" },
    { name: "PRODUCTS", path: "/products", hasSubmenu: true },
    { name: "ABOUT", path: "/about" },
    { name: "CONTACT", path: "/contact" },
  ];

  return (
    <Fragment>
      {/* Mobile Navbar */}
      <div className="lg:hidden">
        <MNavbar />
      </div>

      {/* Desktop Navbar */}
      <header className="hidden lg:block sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <h1 className="text-3xl font-extrabold tracking-tighter text-gray-900 group-hover:text-gray-700 transition-colors">
              ON U
            </h1>
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <div
                key={link.name}
                className="relative h-20 flex items-center"
                onMouseEnter={() => link.hasSubmenu && handleMenuHover("products", true)}
                onMouseLeave={() => link.hasSubmenu && handleMenuHover("products", false)}
              >
                <Link
                  to={link.path}
                  className={`text-sm font-medium tracking-wide transition-colors hover:text-black ${location.pathname === link.path ? "text-black" : "text-gray-700"
                    }`}
                >
                  {link.name}
                </Link>
                {link.hasSubmenu && (
                  <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 transition-all duration-200 ${activeMenu === "products" ? "opacity-100 visible" : "opacity-0 invisible"}`}>
                    {/* Submenu container handled by ProductCatView */}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              {isSearchVisible ? (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-80 bg-white shadow-lg rounded-lg p-2 border">
                  <SearchComponent toggleSearchBar={() => setIsSearchVisible(false)} />
                  <button onClick={() => setIsSearchVisible(false)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Button variant="ghost" size="icon" className="h-10 w-10 [&_svg]:size-6" onClick={() => setIsSearchVisible(true)}>
                  <Search />
                </Button>
              )}
            </div>

            {/* Wishlist */}
            <Link to="/my_wishlist">
              <Button variant="ghost" size="icon" className="relative h-10 w-10 [&_svg]:size-6">
                <Heart />
                {currentWishListCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]">
                    {currentWishListCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Bag */}
            <Link to="/bag">
              <Button variant="ghost" size="icon" className="relative h-10 w-10 [&_svg]:size-6">
                <ShoppingBag />
                {currentBagCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]">
                    {currentBagCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Profile */}
            <div
              className="relative"
              onMouseEnter={() => setShowProfileMenu(true)}
              onMouseLeave={() => setShowProfileMenu(false)}
            >
              <Link to={user ? "/dashboard" : "/Login"}>
                <Button variant="ghost" size="icon" className="h-10 w-10 [&_svg]:size-6">
                  <User />
                </Button>
              </Link>
              <Profile
                user={user}
                show={showProfileMenu}
                CMenu={showProfileMenu ? "block" : "hidden"}
                parentCallback={(menu, show) => setShowProfileMenu(show)}
              />
            </div>
          </div>
        </div>

        {/* Mega Menu Overlay */}
        {options && options.length > 0 && (
          <ProductCatView
            show={activeMenu === "products"}
            CMenu={activeMenu === "products" ? "block" : "hidden"}
            parentCallback={(menu, show) => handleMenuHover("products", show)}
            options={options}
          />
        )}
      </header>
    </Fragment>
  );
};

export default Navbar;
