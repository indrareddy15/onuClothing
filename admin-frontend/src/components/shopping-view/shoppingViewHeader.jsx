import { Blinds, ChevronDown, House, LogOutIcon, ShoppingCart, User } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import { Button } from '../ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { getInitials, shoppingViewHeaderMenuItems } from '@/config'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { logoutUser, resetTokenCredentials } from '@/store/auth-slice'
import CartWrapper from './CartWrapper'
import { fetchCartItems } from '@/store/shop/car-slice'
import { Label } from '@radix-ui/react-dropdown-menu'
import { Badge } from '../ui/badge'
import { Dialog } from '../ui/dialog'

const MenuItems = ({setOpenCartSheet,openCardSheet})=>{
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams,setSearchParams] = useSearchParams();
    function handleNavigate(item){
        sessionStorage.removeItem('filters');
        console.log(item);
        const currentFilters = item?.id !== 'home' && item?.id !== 'products' && item?.id !== "search"? {
            category:[item.id]
        }:null;
        sessionStorage.setItem('filters', JSON.stringify(currentFilters));
        if(location.pathname.includes('listing') && currentFilters !== null){
            setSearchParams(new URLSearchParams(`?category=${item?.id}`))
        }
        navigate(item?.path)
    }
    return <nav className='flex flex-col mb-3 lg:items-center gap-7 lg:flex-row'>
        {
            shoppingViewHeaderMenuItems.map((item)=> (
                <Label key={item?.id} onClick={()=> {
                    setOpenCartSheet(false);
                    handleNavigate(item)
                }} className='text-sm font-medium cursor-pointer nav-link text-black hover:text-gray-700'>
                    {item?.label}
                </Label>
            ))
        }
    </nav>
}
const HeaderRightContent = ({user,openCardSheet,setOpenCartSheet})=>{
    const[openAuthDialogue,setOpenDialogue] = useState(false);
    const {cartItems} = useSelector(state => state.shopCardSlice);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const HandleLogInLogout = async (e)=>{
        if(user){
            dispatch(resetTokenCredentials());
            sessionStorage.clear();
        }else{
            setOpenDialogue(true);
        }
    }
    useEffect(()=>{
        if(user){
            dispatch(fetchCartItems({userId:user?.id}))
        }
    },[])
    console.log("User: " ,user)
    console.log("Open Card Sheet",openCardSheet)
    return <div className='flex lg:items-center lg:flex-row flex-col gap-4'>
        <Sheet open = {openCardSheet} onOpenChange={()=>{
            setOpenCartSheet(false);
        }}>
            <Button onClick = {()=> setOpenCartSheet(true)} variant = "outline" size = "icon" className = "relative flex-row hover-scale border-black text-black hover:bg-black hover:text-white" >
                <ShoppingCart className='h-10 w-10'/>
                {
                    cartItems?.items?.length > 0 && (
                        <Badge  className='absolute w-1 h-4 top-[-5px] right-[-2px] items-center justify-center bg-black text-white'>
                            <span className='text-[15px]'>{cartItems?.items?.length}</span>
                        </Badge>
                    )
                }
                <span className='sr-only'>User Cart</span>
            </Button>
            <CartWrapper carItems={cartItems} setOpenCartSheet = {setOpenCartSheet}/>
        </Sheet>
        <DropdownMenu>
            <DropdownMenuTrigger asChild >
                <Avatar className = "bg-black hover:shadow-lg hover:shadow-black/30 transition-all duration-300 cursor-pointer">
                    <AvatarFallback className = "bg-black text-white font-extrabold">
                        {getInitials(user?.userName) || 'User Data'}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent side = "right" className = {"w-56"}>
                <DropdownMenuLabel>
                    Logged In as {user?.userName}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick = {()=> navigate("/shop/account")}>
                    <User className = "mr-4 w-4 h-4" />
                    Account
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick = {HandleLogInLogout}>
                    <LogOutIcon className = "mr-4 w-4 h-4" />
                    {user ? "LogOut":"LogIn"}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
}
const ShoppingViewHeader = () => {
    const [openCardSheet,setOpenCartSheet] = useState(false);
    const [scrolled,setScrolled] = useState(false);
    const {isAuthenticated,user} = useSelector(state => state.auth)

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            setScrolled(isScrolled);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300 ${scrolled ? 'shadow-md' : ''}`}>
            <div className='flex h-16 items-center justify-between px-4 md:px-16'>
                <Link className='flex items-center gap-2 hover:opacity-80 transition-opacity' to={"/shop/home"}>
                    <House className='h-6 w-6 text-black'/>
                    <span className='font-bold text-black text-lg'>ECommerce</span>
                </Link>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant = "outline" size = "icon" className = "lg:hidden">
                            <span className='sr-only'>Menu</span>
                            <Blinds className='h-6 w-6'/>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side = "left" className = "w-full max-w-xs">
                        <MenuItems setOpenCartSheet={setOpenCartSheet}/>
                        <div className='lg:hidden block'>
                            <HeaderRightContent user={user} setOpenCartSheet={setOpenCartSheet} openCardSheet={openCardSheet}/>
                        </div>
                        {/* {isAuthenticated && (
                        )} */}
                    </SheetContent>
                </Sheet>
                <div className='hidden lg:block'>
                    <MenuItems setOpenCartSheet={setOpenCartSheet}/>
                </div>
                <div className='lg:block hidden'>
                    <HeaderRightContent user={user} setOpenCartSheet={setOpenCartSheet} openCardSheet={openCardSheet}/>
                </div>
                {/* {isAuthenticated && (
                )} */}
            </div>
        </header>
    )
}

export default ShoppingViewHeader
