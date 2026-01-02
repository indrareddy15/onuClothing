import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, resetTokenCredentials } from '@/store/auth-slice';
import { adminSideBarMenu } from '@/config';
import { Button } from '../ui/button';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingBag,
  MessageSquare,
  Box,
  FileText,
  Star,
  LogOut,
  User,
  Menu,
  X,
  Settings,
  ChevronDown
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '../ui/sheet';

const getIcon = (id) => {
  switch (id) {
    case 'dashboard': return <LayoutDashboard className="w-4 h-4" />;
    case 'products': return <Package className="w-4 h-4" />;
    case 'customers': return <Users className="w-4 h-4" />;
    case 'orders': return <ShoppingBag className="w-4 h-4" />;
    case 'query': return <MessageSquare className="w-4 h-4" />;
    case 'warehouse': return <Box className="w-4 h-4" />;
    case 'pages': return <FileText className="w-4 h-4" />;
    case 'features': return <Star className="w-4 h-4" />;
    case 'homeSettings': return <LayoutDashboard className="w-4 h-4" />;
    default: return <Settings className="w-4 h-4" />;
  }
};

const AdminHeaderLayout = ({ setOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(resetTokenCredentials());
    sessionStorage.clear();
    navigate('/auth/login');
  };

  // Filter accessible menu based on user role
  const accessibleMenu = adminSideBarMenu.filter(
    (item) => item?.accessRole?.includes(user?.role)
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2 mr-8 cursor-pointer" onClick={() => navigate('/admin/dashboard')}>
          <div className="w-8 h-8 bg-gradient-to-br from-gray-900 to-gray-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <div className="hidden md:block">
            <div className="font-bold text-gray-900 leading-none">ON U</div>
            <div className="text-[10px] text-gray-500 leading-none">Admin Panel</div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 mx-6">
          {accessibleMenu.map((item) => {
            const isActive = location.pathname.includes(item.path);

            if (item.dropDownView) {
              return (
                <DropdownMenu key={item.id}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'text-gray-900 bg-gray-100' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                    >
                      {getIcon(item.id)}
                      {item.label}
                      <ChevronDown className="w-3 h-3 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {item.dropDownView
                      .filter(subItem => subItem.accessRole.includes(user?.role))
                      .map((subItem) => (
                        <DropdownMenuItem
                          key={subItem.id}
                          onClick={() => navigate(`/admin/${subItem.path}`)}
                          className="cursor-pointer"
                        >
                          {subItem.label}
                        </DropdownMenuItem>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }

            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors rounded-md ${isActive ? 'text-gray-900 bg-gray-100' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
              >
                {getIcon(item.id)}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-4">
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="font-medium">
                {user?.userName || 'Admin'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/admin/profile')} className="cursor-pointer">
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Toggle */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 overflow-y-auto">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <SheetDescription className="sr-only">Mobile navigation menu for the admin panel.</SheetDescription>
              <div className="p-6 border-b">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-900 to-gray-700 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">T</span>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 leading-none">ON U</div>
                    <div className="text-[10px] text-gray-500 leading-none">Admin Panel</div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col py-4 animate-fadeIn">
                {accessibleMenu.map((item, index) => (
                  <div key={item.id} className="animate-slideUp" style={{ animationDelay: `${index * 0.05}s` }}>
                    {item.dropDownView ? (
                      <div className="px-4 py-2">
                        <div className="flex items-center gap-2 font-medium text-sm text-gray-500 mb-2 px-2">
                          {getIcon(item.id)}
                          {item.label}
                        </div>
                        {item.dropDownView
                          .filter(subItem => subItem.accessRole.includes(user?.role))
                          .map(subItem => (
                            <Link
                              key={subItem.id}
                              to={`/admin/${subItem.path}`}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
                            >
                              {subItem.label}
                            </Link>
                          ))}
                      </div>
                    ) : (
                      <Link
                        to={item.path}
                        className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${location.pathname.includes(item.path)
                          ? 'bg-gray-100 text-gray-900 border-r-2 border-gray-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                      >
                        {getIcon(item.id)}
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default AdminHeaderLayout;