import React from 'react'
import { adminSideBarMenu, capitalizeFirstLetterOfEachWord, hexToRgba } from '@/config'
import { ChartArea, ListOrdered } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet'
import Dropdown from './Dropdown'
import { MdDashboard, MdFeaturedPlayList, MdQueryStats, MdWarehouse } from "react-icons/md";
import { FaCartArrowDown, FaUsers } from "react-icons/fa";
import { RiPagesFill } from "react-icons/ri";
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css';
const GetAdminSideBarMenuIcon = ({ id }) => {
    switch (id) {
        case "dashboard":
            return <MdDashboard size={24} />
        case "customers":
            return <FaUsers size={24} />
        case 'query':
            return <MdQueryStats size={24} />
        case "products":
            return <FaCartArrowDown size={24} />
        case "orders":
            return <ListOrdered size={24} />
        case "warehouse":
            return <MdWarehouse size={24} />
        case "features":
            return <MdFeaturedPlayList size={24} />
        case "pages":
            return <RiPagesFill size={24} />
        case "homeSettings":
            return <MdDashboard size={24} />
        default:
            return null
    }
}

const MenuItems = ({ setOpen, user }) => {
    const navigate = useNavigate();
    // console.log("handle add Navigation: ",adminSideBarMenu)
    // Filter accessible menu based on the user's role
    const accessibleMenu = adminSideBarMenu.filter((item) => item?.accessRole?.includes(user.role));

    // Filter dropdown menu items from the accessible menu
    const accessibleDropDownMenu = accessibleMenu.filter(
        (item) => item?.dropDownView?.length > 0 && item?.dropDownView.some((dropdown) => dropdown?.accessRole?.includes(user.role))
    );

    return (
        <nav className="mt-6 flex flex-col gap-1 px-2">
            {user && accessibleMenu?.length > 0 && accessibleMenu.map((item) => (
                <div key={item.id} className="mb-1">
                    {/* Check if the item has a dropdown */}
                    {item?.dropDownView && accessibleDropDownMenu.length > 0 ? (
                        <div className="w-full">
                            <Dropdown items={item} GetAdminSideBarMenuIcon={GetAdminSideBarMenuIcon} />
                        </div>
                    ) : (
                        <button
                            className={`flex ${window.location.href.includes(item?.path) ? "bg-gray-500 text-gray-50" : "hover:bg-gray-200 hover:text-gray-900"} items-center justify-start w-full px-3 py-2.5 rounded-md transition-all duration-300 ease-in-out`}
                            onClick={(e) => {
                                e.preventDefault();
                                navigate(item?.path);
                                setOpen && setOpen(false); // Close the menu if `setOpen` exists
                            }}
                            itemType="button"
                        >
                            <GetAdminSideBarMenuIcon id={item.id} />
                            <span className="ml-3 text-lg font-semibold">{item.label}</span>
                        </button>
                    )}
                </div>
            ))}
        </nav>
    );
}
const AdminHeader = ({ user, setOpen }) => {
    const navigation = useNavigate();
    return (
        <button onClick={() => {
            navigation('/admin/profile')
            setOpen(); // Close the menu if `setOpen` exists
        }} className="flex justify-between items-center space-x-6">
            <LazyLoadImage
                effect="blur"
                useIntersectionObserver
                loading="lazy"
                wrapperProps={{
                    // If you need to, you can tweak the effect transition using the wrapper style.
                    style: { transitionDelay: "1s" },
                }}
                src={user?.profilePic}
                alt="User Profile"
                className="w-12 h-12 rounded-full bg-gray-400 object-cover"
                style={{ filter: `drop-shadow(0 0 5px ${hexToRgba('#000', 0.2)})`, objectFit: "cover" }}
            />
            <span
                className="text-lg font-medium text-gray-700 hover:text-gray-900 transition-all duration-200"
            >
                Profile
            </span>
        </button>

    );
};
const AdminSidebarLayout = ({ sheetOpen, setOpen, user }) => {
    const navigate = useNavigate();
    return (
        <div >
            {/* Sheet Sidebar */}
            <Sheet open={sheetOpen} onOpenChange={setOpen}>
                <SheetContent side='left' className="w-64 bg-gray-100 text-gray-900 transition-transform duration-300 ease-in-out overflow-y-auto">
                    <div className='flex flex-col h-full'>
                        <SheetHeader className="border-b border-gray-300 px-4 py-4">
                            <SheetTitle className="pb-4">
                                <AdminHeader user={user} setOpen={setOpen} />
                                <h1 className='text-lg font-extrabold mt-4'>
                                    {capitalizeFirstLetterOfEachWord(user.role)} Panel
                                </h1>
                            </SheetTitle>
                        </SheetHeader>
                        <MenuItems setOpen={setOpen} user={user} />
                    </div>
                </SheetContent>
            </Sheet>

            {/* Desktop Sidebar */}
            <aside className='hidden lg:flex w-64 flex-col border-r bg-gray-100 px-4 py-6 transition-transform duration-300 ease-in-out h-screen sticky top-0 overflow-y-auto'>
                <div
                    onClick={() => navigate("/admin/dashboard")}
                    className='flex cursor-pointer items-center gap-3 px-2 py-3 mb-4 rounded-md transition-all duration-300 ease-in-out hover:bg-gray-200'
                >
                    <ChartArea size={28} className="text-gray-600" />
                    <h1 className='text-xl font-extrabold text-gray-800'>
                        Admin Panel
                    </h1>
                </div>
                <MenuItems user={user} />
            </aside>
        </div>
    );
}

export default AdminSidebarLayout;
