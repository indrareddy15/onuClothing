import React, { useEffect, useState, useMemo, Fragment } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import { Sheet } from '../ui/sheet';
import AdminOrdersDetailsView from './AdminOrdersDetailsView';
import { useDispatch, useSelector } from 'react-redux';
import { adminFetchAllShiprocketCancleOrder, adminGetAllOrders, admingetShiprocketToken, adminGetUsersOrdersById, resetOrderDetails } from '@/store/admin/order-slice';
import { Badge } from '../ui/badge';
import {
	Search, Filter, Download, Eye, Package,
	Truck, Clock, CheckCircle2, XCircle, Calendar,
	MessageSquare, MapPin, CreditCard, ChevronLeft,
	ChevronRight, Copy, Undo2
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import {
	Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
	Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import LogisticsLoginView from './LogisticsLoginView';
import LoadingView from '@/pages/admin-view/LoadingView';
import { useSettingsContext } from '@/Context/SettingsContext';
import { Label } from '../ui/label';

const orderStatusOptions = [
	{ id: 'Confirmed', label: 'Confirmed' },
	{ id: 'Processing', label: 'Processing' },
	{ id: 'Shipped', label: 'Shipped' },
	{ id: 'Delivered', label: 'Delivered' },
	{ id: 'Canceled', label: 'Canceled' },
	{ id: 'RTO Initiated', label: 'RTO Initiated' },
	{ id: 'Lost', label: 'Lost' },
	{ id: 'Pickup Error', label: 'Pickup Error' },
	{ id: 'RTO Acknowledged', label: 'RTO Acknowledged' },
	{ id: 'Pickup Rescheduled', label: 'Pickup Rescheduled' },
	{ id: 'Cancellation Requested', label: 'Cancellation Requested' },
	{ id: 'Out For Delivery', label: 'Out For Delivery' },
	{ id: 'In Transit', label: 'In Transit' },
	{ id: 'Out For Pickup', label: 'Out For Pickup' },
	{ id: 'Pickup Exception', label: 'Pickup Exception' },
];

const AdminOrderLayout = () => {
	const { checkAndCreateToast } = useSettingsContext();
	const [openDetailsDialogue, setOpenDetailsDialogue] = useState(false);
	const [openReturnOrderDialogue, setOpenReturnOrdersDialogue] = useState(false);
	const [openLoginDialogue, setOpenLoginDialogue] = useState(false);
	const [logisticsToken, setLogisticsToken] = useState(null);
	const [currentOrderId, setCurrentOrderId] = useState(null);

	// Filter States
	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [paymentFilter, setPaymentFilter] = useState('all');
	const [activityFilter, setActivityFilter] = useState('all');
	const [currentPage, setCurrentPage] = useState(1);
	const ordersPerPage = 10;

	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.auth);
	const { isLoading, token, orderList, orderDetails, returnOrderList } = useSelector((state) => state.adminOrder);

	useEffect(() => {
		dispatch(adminGetAllOrders());
		dispatch(admingetShiprocketToken());
		dispatch(adminFetchAllShiprocketCancleOrder())
	}, [dispatch]);


	const handleFetchOrderDetails = async (orderId) => {
		// If sheet is already open with the same order, don't refetch
		if (openDetailsDialogue && currentOrderId === orderId) {
			return;
		}
		setCurrentOrderId(orderId);
		await dispatch(adminGetUsersOrdersById(orderId));
		setOpenDetailsDialogue(true);
	};

	// Remove the automatic opening based on orderDetails change
	// This prevents the sheet from opening unexpectedly

	const handleLoginComplete = (data) => {
		setLogisticsToken(data);
		setOpenLoginDialogue(false);
		dispatch(admingetShiprocketToken());
	};

	useEffect(() => {
		if (token) {
			if (!logisticsToken) {
				setLogisticsToken(token?.token);
			}
		}
	}, [token, dispatch]);

	// Filtering Logic
	const filteredOrders = useMemo(() => {
		let filtered = [...(orderList || [])];

		// Search Filter
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(order =>
				order?.order_id?.toLowerCase().includes(query) ||
				order?.address?.Firstname?.toLowerCase().includes(query) ||
				order?.address?.Lastname?.toLowerCase().includes(query) ||
				order?.address?.Email?.toLowerCase().includes(query)
			);
		}

		// Status Filter
		if (statusFilter !== 'all') {
			filtered = filtered.filter(order => order?.status === statusFilter);
		}

		// Payment Filter
		if (paymentFilter !== 'all') {
			if (paymentFilter === 'cod') {
				filtered = filtered.filter(order => order?.paymentMode?.toLowerCase() === 'cod');
			} else if (paymentFilter === 'prepaid') {
				filtered = filtered.filter(order => order?.paymentMode?.toLowerCase() !== 'cod');
			}
		}

		// Activity Filter
		if (activityFilter !== 'all') {
			const today = new Date();
			filtered = filtered.filter(order => {
				const orderDate = new Date(order.createdAt);
				const diffTime = Math.abs(today - orderDate);
				const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

				if (activityFilter === 'today') return diffDays <= 1;
				if (activityFilter === 'last7days') return diffDays <= 7;
				if (activityFilter === 'last30days') return diffDays <= 30;
				return true;
			});
		}

		// Default Sort: Latest first
		return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
	}, [orderList, searchQuery, statusFilter, paymentFilter, activityFilter]);

	// Pagination Logic
	const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
	const currentOrders = useMemo(() => {
		const indexOfLastOrder = currentPage * ordersPerPage;
		const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
		return filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
	}, [filteredOrders, currentPage]);

	const getStatusColor = (status) => {
		const colors = {
			'Confirmed': 'bg-blue-100 text-blue-700 border-blue-200',
			'Processing': 'bg-yellow-100 text-yellow-700 border-yellow-200',
			'Shipped': 'bg-purple-100 text-purple-700 border-purple-200',
			'Delivered': 'bg-green-100 text-green-700 border-green-200',
			'Canceled': 'bg-red-100 text-red-700 border-red-200',
			'RTO Initiated': 'bg-orange-100 text-orange-700 border-orange-200',
			'Out For Delivery': 'bg-cyan-100 text-cyan-700 border-cyan-200',
			'Returned': 'bg-rose-100 text-rose-700 border-rose-200',
			'In Transit': 'bg-indigo-100 text-indigo-700 border-indigo-200',
		};
		return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
	};

	const getPaymentColor = (paymentMode) => {
		if (paymentMode?.toLowerCase() === 'cod') {
			return 'bg-amber-100 text-amber-700 border-amber-200';
		} else {
			return 'bg-emerald-100 text-emerald-700 border-emerald-200';
		}
	};

	const exportToCSV = () => {
		const headers = ['Order ID', 'Customer', 'Amount', 'Status', 'Payment', 'Date'];
		const rows = filteredOrders.map(order => [
			order.order_id,
			`${order?.address?.Firstname} ${order?.address?.Lastname}`,
			order.TotalAmount,
			order.status,
			order.paymentMode,
			new Date(order.createdAt).toLocaleDateString()
		]);

		const csvContent = [
			headers.join(','),
			...rows.map(row => row.join(','))
		].join('\n');

		const blob = new Blob([csvContent], { type: 'text/csv' });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
		a.click();
		checkAndCreateToast('success', 'Orders exported successfully');
	};

	if (isLoading) return <LoadingView />;

	return (
		<div className="w-full space-y-6">
			{/* Header Section */}
			<div className="flex flex-col lg:flex-row items-center justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Orders</h1>
					<p className="text-gray-600 mt-1">{filteredOrders.length} orders found</p>
				</div>

				<div className="flex flex-wrap items-center gap-3">
					{/* Shiprocket Token Info */}
					{token?.expiringTime && (
						<span className="text-xs text-gray-500 hidden lg:inline-block">
							Token expires: {new Date(token?.expiringTime).toLocaleDateString()}
						</span>
					)}

					<Button
						variant="outline"
						onClick={() => setOpenLoginDialogue(true)}
						className="flex items-center gap-2"
					>
						<Truck className="w-4 h-4" />
						<span className="hidden sm:inline">ShipRocket Token</span>
					</Button>

					{logisticsToken && (
						<Button
							variant="outline"
							onClick={() => {
								navigator.clipboard.writeText(logisticsToken);
								checkAndCreateToast('success', 'Token copied!');
							}}
							className="flex items-center gap-2"
						>
							<Copy className="w-4 h-4" />
						</Button>
					)}

					<Button
						variant="secondary"
						onClick={() => setOpenReturnOrdersDialogue(true)}
						className="flex items-center gap-2"
					>
						<Undo2 className="w-4 h-4" />
						<span className="hidden sm:inline">Returns</span>
					</Button>

					<Button onClick={exportToCSV} variant="outline" className="flex items-center gap-2">
						<Download className="w-4 h-4" />
						<span className="hidden sm:inline">Export CSV</span>
					</Button>
				</div>
			</div>

			{/* Filters Section */}
			<Card>
				<CardContent className="p-4">
					<div className="flex flex-col md:flex-row gap-4">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
							<Input
								placeholder="Search by Order ID, Customer Name..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-10"
							/>
						</div>

						<div className="w-full md:w-[200px]">
							<Select value={statusFilter} onValueChange={setStatusFilter}>
								<SelectTrigger>
									<SelectValue placeholder="Filter by Status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Status</SelectItem>
									{orderStatusOptions.map((status) => (
										<SelectItem key={status.id} value={status.id}>
											{status.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="w-full md:w-[200px]">
							<Select value={paymentFilter} onValueChange={setPaymentFilter}>
								<SelectTrigger>
									<SelectValue placeholder="Payment Type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Payments</SelectItem>
									<SelectItem value="prepaid">Prepaid</SelectItem>
									<SelectItem value="cod">COD</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="w-full md:w-[200px]">
							<Select value={activityFilter} onValueChange={setActivityFilter}>
								<SelectTrigger>
									<SelectValue placeholder="Order Activity" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Time</SelectItem>
									<SelectItem value="today">Today</SelectItem>
									<SelectItem value="last7days">Last 7 Days</SelectItem>
									<SelectItem value="last30days">Last 30 Days</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Orders Table */}
			<Card className="overflow-hidden">
				<div className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Order ID</TableHead>
								<TableHead>Date</TableHead>
								<TableHead>Customer</TableHead>
								<TableHead className="text-center">Items</TableHead>
								<TableHead>Payment</TableHead>
								<TableHead>Amount</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{currentOrders.length === 0 ? (
								<TableRow>
									<TableCell colSpan={8} className="text-center py-8 text-gray-500">
										<Package className="w-12 h-12 mx-auto mb-2 text-gray-400" />
										<p>No orders found</p>
									</TableCell>
								</TableRow>
							) : (
								currentOrders.map((order) => (
									<TableRow key={order?._id} className="hover:bg-gray-50">
										<TableCell className="font-medium">
											{order?.order_id}
										</TableCell>
										<TableCell className="text-gray-600">
											{new Date(order?.createdAt).toLocaleDateString()}
										</TableCell>
										<TableCell>
											<div className="flex flex-col">
												<span className="font-medium">
													{order?.address?.Firstname} {order?.address?.Lastname} {order?.address?.name}
												</span>
											</div>
										</TableCell>
										<TableCell className="text-center">
											<span className="text-gray-700">{order?.cartItems?.length || 0}</span>
										</TableCell>
										<TableCell>
											<Badge className={`capitalize ${getPaymentColor(order?.paymentMode)}`}>
												{order?.paymentMode}
											</Badge>
										</TableCell>
										<TableCell className="font-semibold">
											₹ {order?.TotalAmount}
										</TableCell>
										<TableCell>
											<Badge className={`capitalize ${getStatusColor(order?.status)}`}>
												{order?.status}
											</Badge>
										</TableCell>
										<TableCell className="text-right">
											<Button
												variant="secondary"
												size="sm"
												onClick={() => handleFetchOrderDetails(order?._id)}
												className="flex items-center gap-1.5 ml-auto"
											>
												<Eye className="w-4 h-4" />
												<span>View</span>
											</Button>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>

				{/* Pagination */}
				{totalPages > 1 && (
					<div className="flex items-center justify-between px-6 py-4 border-t">
						<p className="text-sm text-gray-600">
							Showing {((currentPage - 1) * ordersPerPage) + 1} to {Math.min(currentPage * ordersPerPage, filteredOrders.length)} of {filteredOrders.length} orders
						</p>
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
								disabled={currentPage === 1}
							>
								<ChevronLeft className="w-4 h-4" />
							</Button>
							<span className="text-sm text-gray-600">
								Page {currentPage} of {totalPages}
							</span>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
								disabled={currentPage === totalPages}
							>
								<ChevronRight className="w-4 h-4" />
							</Button>
						</div>
					</div>
				)}
			</Card>

			{/* Dialogs */}
			<Sheet open={openDetailsDialogue} onOpenChange={(open) => {
				setOpenDetailsDialogue(open);
				if (!open) {
					dispatch(resetOrderDetails());
					setCurrentOrderId(null);
				}
			}}>
				{orderDetails && (
					<AdminOrdersDetailsView order={orderDetails} user={user} />
				)}
			</Sheet>

			<Dialog open={openReturnOrderDialogue} onOpenChange={(open) => {
				setOpenReturnOrdersDialogue(open);
				if (!open) dispatch(adminFetchAllShiprocketCancleOrder());
			}}>
				{returnOrderList && <ReturningOrderDialogWindow orderData={returnOrderList} />}
			</Dialog>

			<Dialog open={openLoginDialogue} onOpenChange={setOpenLoginDialogue}>
				<LogisticsLoginView OnLoginComplete={handleLoginComplete} />
			</Dialog>
		</div>
	);
};

const ReturningOrderDialogWindow = ({ orderData = [] }) => {
	return (
		<DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
			<DialogTitle className="font-bold text-xl mb-4">Returning Orders Info</DialogTitle>
			{orderData && orderData.length > 0 ? (
				<div className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Order ID</TableHead>
								<TableHead>Customer</TableHead>
								<TableHead>Phone</TableHead>
								<TableHead>Pincode</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Total</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{orderData.map((item, index) => (
								<TableRow key={index}>
									<TableCell>{item?.channel_order_id}</TableCell>
									<TableCell>{item?.pickup_person_name}</TableCell>
									<TableCell>{item?.pickup_person_phone}</TableCell>
									<TableCell>{item?.pickup_code}</TableCell>
									<TableCell>
										<Badge variant="secondary" className="animate-pulse">
											{item?.status}
										</Badge>
									</TableCell>
									<TableCell>{item?.total}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			) : (
				<div className="text-center py-8 text-gray-500">
					<p>No returning orders available.</p>
				</div>
			)}
		</DialogContent>
	);
};

export default AdminOrderLayout;
