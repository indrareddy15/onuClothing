import React, { useEffect, useRef, useState } from 'react';
import Footer from '../../Footer/Footer';
import OrdersReturns from './OrdersReturns';
import SavedAddresses from './SavedAddresses';
import UserDetails from './UserDetails';
import { useLocation, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { FaUser, FaUserAltSlash } from 'react-icons/fa';
import BackToTopButton from '../../Home/BackToTopButton';
import { useDispatch } from 'react-redux';
import { logout } from '../../../action/useraction';
import WhatsAppButton from '../../Home/WhatsAppButton';
import { useServerAuth } from '../../../Contaxt/AuthContext';
import Loader from '../../Loader/Loader';
import { Button } from '../../../components/ui/button.jsx';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';

const NotLoggedInModal = () => {
	const navigate = useNavigate();

	const handleLoginRedirect = (e) => {
		e.stopPropagation();
		navigate('/Login');
	};

	return (
		<div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex justify-center items-center z-50">
			<div className="bg-card border border-border rounded-2xl p-8 w-96 shadow-2xl text-center">
				<div className="flex items-center justify-center mb-6 text-muted-foreground bg-muted w-20 h-20 rounded-full mx-auto">
					<FaUserAltSlash size={32} />
				</div>
				<h2 className="text-2xl font-bold text-foreground mb-2">Not Logged In</h2>
				<p className="text-muted-foreground mb-8 leading-relaxed">
					Please log in to access your account dashboard and manage your profile.
				</p>
				<Button
					onClick={handleLoginRedirect}
					size="lg"
					className="w-full"
				>
					<FaUser className="mr-2 h-4 w-4" />
					Log In
				</Button>
			</div>
		</div>
	);
};

const Overview = () => {
	const { checkAuthUser, user, userLoading } = useServerAuth();
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const scrollableDivRef = useRef(null);
	const [activeSection, setActiveSection] = useState('User-Details');

	useEffect(() => {
		if (scrollableDivRef.current) {
			scrollableDivRef.current.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}, [activeSection]);

	useEffect(() => {
		if (location) {
			const queryParams = new URLSearchParams(location.search);
			if (queryParams.has('activetab')) {
				setActiveSection(queryParams.get('activetab'))
			} else {
				setActiveSection('User-Details');
			}
		}
	}, [location])

	const handelSectionChange = (value) => {
		switch (value) {
			case 'Saved-Addresses':
			case 'Orders-Returns':
				navigate(`/dashboard?activetab=${value}`);
				break;
			default:
				navigate('/dashboard')
				break;
		}
	}

	const handleLogout = async () => {
		await dispatch(logout());
		await checkAuthUser();
		localStorage.removeItem('token')
		navigate('/Login');
	};

	if (userLoading) {
		return <Loader />
	}
	if (!user) {
		return <NotLoggedInModal />;
	}

	return (
		<div ref={scrollableDivRef} className="min-h-screen bg-background overflow-y-auto scrollbar-thin scrollbar-track-muted scrollbar-thumb-border">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Header */}
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
					<div>
						<h1 className="text-3xl font-bold text-foreground">My Account</h1>
						<p className="text-muted-foreground mt-1">Welcome back, {user?.user?.name}</p>
					</div>
					<Button
						onClick={handleLogout}
						variant="destructive"
						size="sm"
						className="shadow-sm"
					>
						<LogOut className="w-4 h-4 mr-2" />
						Logout
					</Button>
				</div>

				<Tabs value={activeSection} onValueChange={handelSectionChange} className="w-full space-y-6">
					{/* Mobile View: Select Dropdown */}
					<div className="sm:hidden w-full">
						<Select value={activeSection} onValueChange={handelSectionChange}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select Section" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="User-Details">Profile Information</SelectItem>
								<SelectItem value="Orders-Returns">Orders & Returns</SelectItem>
								<SelectItem value="Saved-Addresses">Saved Addresses</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Desktop View: Tabs List */}
					<TabsList className="hidden sm:grid w-full grid-cols-3 bg-muted p-1 rounded-lg">
						<TabsTrigger value="User-Details" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Profile Information</TabsTrigger>
						<TabsTrigger value="Orders-Returns" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Orders & Returns</TabsTrigger>
						<TabsTrigger value="Saved-Addresses" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Saved Addresses</TabsTrigger>
					</TabsList>

					<TabsContent value="User-Details" className="mt-0">
						<UserDetails />
					</TabsContent>
					<TabsContent value="Orders-Returns" className="mt-0">
						<OrdersReturns />
					</TabsContent>
					<TabsContent value="Saved-Addresses" className="mt-0">
						<SavedAddresses />
					</TabsContent>
				</Tabs>
			</div>

			<Footer />
			<BackToTopButton scrollableDivRef={scrollableDivRef} />
			<WhatsAppButton scrollableDivRef={scrollableDivRef} />
		</div>
	);
};

export default Overview;
