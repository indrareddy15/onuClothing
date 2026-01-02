import React, { Fragment, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Menu, Search, ShoppingBag, User, X, ChevronRight, Heart } from 'lucide-react';
import { Allproduct } from '../../../action/productaction';
import MProductsBar from './Msubmenu/ProductsBar';
import MMen from './Msubmenu/Men';
import MWoMen from './Msubmenu/Women';
import MKids from './Msubmenu/Kids';
import Mhome from './Msubmenu/Home';
import Mbeauty from './Msubmenu/Beauty';
import { useSessionStorage } from '../../../Contaxt/SessionStorageContext';
import MKeywoardSerach from './MKeywoardSerach';
import { useLocalStorage } from '../../../Contaxt/LocalStorageContext';
import { useServerWishList } from '../../../Contaxt/ServerWishListContext';
import { useServerAuth } from '../../../Contaxt/AuthContext';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';

const MNavbar = () => {
    const { user } = useServerAuth();
    const [currentWishListCount, setWishListCount] = useState(0);
    const [currentBagCount, setBagCount] = useState(0);
    const { sessionData, sessionBagData } = useSessionStorage();
    const { wishlist, bag } = useServerWishList();
    const dispatch = useDispatch();
    const navigation = useNavigate();

    const [showMenuView, setMenuShow] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    // Submenu states
    const [showShopMenu, setShowShopMenu] = useState(false);
    const [showMenMenu, setShowMenMenu] = useState(false);
    const [showWomenMenu, setShowWomenMenu] = useState(false);
    const [showKidsMenu, setShowKidsMenu] = useState(false);
    const [showHomeMenu, setShowHomeMenu] = useState(false);
    const [showBeautyMenu, setShowBeautyMenu] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const { saveSearchKeywoards } = useLocalStorage();

    useEffect(() => {
        if (user) {
            setWishListCount(wishlist?.orderItems?.length || 0);
            setBagCount(bag?.orderItems?.length || 0);
        } else {
            setWishListCount(sessionData?.length || 0);
            setBagCount(sessionBagData?.length || 0);
        }
    }, [wishlist, bag, user, sessionData, sessionBagData]);

    const handleSearch = (query) => {
        if (query.trim()) {
            navigation(`/products?keyword=${query}`);
            dispatch(Allproduct());
            saveSearchKeywoards(query);
            setShowSearch(false);
        } else {
            navigation('/products');
            setShowSearch(false);
        }
    };

    const handleMenuClose = () => {
        setMenuShow(false);
        setShowShopMenu(false);
        setShowMenMenu(false);
        setShowWomenMenu(false);
        setShowKidsMenu(false);
        setShowHomeMenu(false);
        setShowBeautyMenu(false);
    };

    return (
        <Fragment>
            {/* Mobile Header */}
            <div className="sticky top-0 z-40 bg-white border-b shadow-sm h-16 flex items-center justify-between px-4 lg:hidden">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => setMenuShow(true)}>
                        <Menu className="w-6 h-6 text-gray-900" />
                    </Button>
                    <Link to="/" className="text-xl font-extrabold tracking-tighter text-gray-900">
                        ON U
                    </Link>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setShowSearch(true)}>
                        <Search className="w-7 h-7 text-gray-900" />
                    </Button>

                    <Link to="/my_wishlist" className="relative p-2">
                        <Heart className="w-7 h-7 text-gray-900" />
                        {currentWishListCount > 0 && (
                            <Badge variant="destructive" className="absolute top-0 right-0 h-4 w-4 flex items-center justify-center p-0 text-[10px]">
                                {currentWishListCount}
                            </Badge>
                        )}
                    </Link>

                    <Link to="/bag">
                        <Button variant="ghost" size="icon" className="relative">
                            <ShoppingBag className="w-7 h-7 text-gray-900" />
                            {currentBagCount > 0 && (
                                <Badge variant="destructive" className="absolute top-0 right-0 h-4 w-4 flex items-center justify-center p-0 text-[10px]">
                                    {currentBagCount}
                                </Badge>
                            )}
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Search Overlay */}
            {showSearch && (
                <div className="fixed inset-0 z-50 bg-white">
                    <MKeywoardSerach
                        setserdiv={() => setShowSearch(false)}
                        state={searchQuery}
                        setstate={setSearchQuery}
                        searchenter={(e) => e.keyCode === 13 && handleSearch(searchQuery)}
                        searchenters={handleSearch}
                    />
                </div>
            )}

            {/* Menu Sidebar (Sheet-like) */}
            {showMenuView && (
                <div className="fixed inset-0 z-50 flex">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleMenuClose} />
                    <div className="relative w-[80vw] max-w-xs bg-white h-full shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col">

                        {/* Menu Header */}
                        <div className="p-4 border-b flex items-center justify-between bg-gray-50">
                            <div
                                className="flex items-center gap-3"
                                onClick={() => {
                                    if (user) navigation("/dashboard");
                                    else navigation('/Login');
                                    handleMenuClose();
                                }}
                            >
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                    {user?.user?.profilePic ? (
                                        <img src={user.user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-6 h-6 text-gray-500" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-gray-900">
                                        {user ? (user?.user?.name || user?.name) : "Login / Register"}
                                    </p>
                                    {user && <p className="text-xs text-gray-500">View Profile</p>}
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={handleMenuClose}>
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Menu Items */}
                        <div className="flex-1 overflow-y-auto py-2">
                            <nav className="space-y-1">
                                <MenuItem label="Home" onClick={() => { navigation("/"); handleMenuClose(); }} />

                                {/* Shop Dropdown */}
                                <div>
                                    <MenuItem
                                        label="Shop"
                                        onClick={() => setShowShopMenu(!showShopMenu)}
                                        icon={<ChevronRight className={`w-4 h-4 transition-transform ${showShopMenu ? 'rotate-90' : ''}`} />}
                                    />
                                    {showShopMenu && (
                                        <div className="bg-gray-50 pl-4">
                                            <MProductsBar
                                                showProducts={showShopMenu ? "block" : "hidden"}
                                                onClose={handleMenuClose}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Men Dropdown */}
                                <div>
                                    <MenuItem
                                        label="Men"
                                        onClick={() => setShowMenMenu(!showMenMenu)}
                                        icon={<ChevronRight className={`w-4 h-4 transition-transform ${showMenMenu ? 'rotate-90' : ''}`} />}
                                    />
                                    {showMenMenu && (
                                        <div className="bg-gray-50 pl-4">
                                            <MMen Men={showMenMenu ? "block" : "hidden"} fun1={handleMenuClose} fun2={() => { }} />
                                        </div>
                                    )}
                                </div>

                                {/* Women Dropdown */}
                                <div>
                                    <MenuItem
                                        label="Women"
                                        onClick={() => setShowWomenMenu(!showWomenMenu)}
                                        icon={<ChevronRight className={`w-4 h-4 transition-transform ${showWomenMenu ? 'rotate-90' : ''}`} />}
                                    />
                                    {showWomenMenu && (
                                        <div className="bg-gray-50 pl-4">
                                            <MWoMen WoMen={showWomenMenu ? "block" : "hidden"} fun1={handleMenuClose} fun2={() => { }} />
                                        </div>
                                    )}
                                </div>

                                {/* Kids Dropdown */}
                                <div>
                                    <MenuItem
                                        label="Kids"
                                        onClick={() => setShowKidsMenu(!showKidsMenu)}
                                        icon={<ChevronRight className={`w-4 h-4 transition-transform ${showKidsMenu ? 'rotate-90' : ''}`} />}
                                    />
                                    {showKidsMenu && (
                                        <div className="bg-gray-50 pl-4">
                                            <MKids MKids={showKidsMenu ? "block" : "hidden"} fun1={handleMenuClose} fun2={() => { }} />
                                        </div>
                                    )}
                                </div>

                                {/* Home & Living Dropdown */}
                                <div>
                                    <MenuItem
                                        label="Home & Living"
                                        onClick={() => setShowHomeMenu(!showHomeMenu)}
                                        icon={<ChevronRight className={`w-4 h-4 transition-transform ${showHomeMenu ? 'rotate-90' : ''}`} />}
                                    />
                                    {showHomeMenu && (
                                        <div className="bg-gray-50 pl-4">
                                            <Mhome Mhome={showHomeMenu ? "block" : "hidden"} fun1={handleMenuClose} fun2={() => { }} />
                                        </div>
                                    )}
                                </div>

                                {/* Beauty Dropdown */}
                                <div>
                                    <MenuItem
                                        label="Beauty"
                                        onClick={() => setShowBeautyMenu(!showBeautyMenu)}
                                        icon={<ChevronRight className={`w-4 h-4 transition-transform ${showBeautyMenu ? 'rotate-90' : ''}`} />}
                                    />
                                    {showBeautyMenu && (
                                        <div className="bg-gray-50 pl-4">
                                            <Mbeauty Mbeauty={showBeautyMenu ? "block" : "hidden"} fun1={handleMenuClose} fun2={() => { }} />
                                        </div>
                                    )}
                                </div>

                                <MenuItem label="New Arrivals" onClick={() => { navigation("/products?sortBy=newest"); handleMenuClose(); }} />
                                <MenuItem label="Best Sellers" onClick={() => { navigation("/products"); handleMenuClose(); }} />
                                <MenuItem label="Order & Returns" onClick={() => { navigation("/dashboard?activetab=Orders-Returns"); handleMenuClose(); }} />
                                <MenuItem label="Saved Addresses" onClick={() => { navigation("/dashboard?activetab=Saved-Addresses"); handleMenuClose(); }} />
                                <MenuItem label="About Us" onClick={() => { navigation("/about"); handleMenuClose(); }} />
                                <MenuItem label="Contact" onClick={() => { navigation("/contact"); handleMenuClose(); }} />
                            </nav>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t bg-gray-50 text-center text-xs text-gray-500">
                            &copy; 2024 ON U. All rights reserved.
                        </div>
                    </div>
                </div>
            )}
        </Fragment>
    );
};

const MenuItem = ({ label, onClick, icon }) => (
    <button
        onClick={onClick}
        className="w-full flex items-center justify-between px-6 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
    >
        {label}
        {icon}
    </button>
);

export default MNavbar;
