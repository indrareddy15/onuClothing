/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { fetchAllCustomers, fetchAllOrdersCount, fetchAllProductsCount, fetchMaxDeliveredOrders, fetchRecentOrders, fetchTopSellingProducts, getCustomerGraphData, getOrderDeliveredGraphData, getOrderGraphData, getWalletBalance, getWebsiteVisitCount } from "@/store/admin/status-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    TrendingUp, TrendingDown, ShoppingCart, Users, Package,
    DollarSign, ArrowRight, Activity, IndianRupee, Download
} from "lucide-react";
import {
    LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useSettingsContext } from "@/Context/SettingsContext";

export default function AdminDashboard({ user }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { checkAndCreateToast } = useSettingsContext();
    const {
        isLoading,
        walletBalance,
        TotalCustomers,
        TotalProducts,
        RecentOrders,
        AverageCountPerDay,
        TopSellingProducts,
        MaxDeliveredOrders,
        CustomerVisitersGraphData,
        CustomerGraphData,
        OrderDeliverData,
        OrdersGraphData,
        TotalOrders
    } = useSelector(state => state.stats);

    const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
    const [dateLabel, setDateLabel] = useState('THIS MONTH');

    useEffect(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const lastDay = new Date(year, today.getMonth() + 1, 0).getDate();

        const s = `${year}-${month}-01`;
        const e = `${year}-${month}-${String(lastDay).padStart(2, '0')}`;

        setStartDate(s);
        setEndDate(e);

        dispatch(fetchAllCustomers());
        dispatch(fetchAllProductsCount());
        dispatch(fetchAllOrdersCount());
        dispatch(fetchMaxDeliveredOrders());
        if (user?.role !== 'admin') {
            dispatch(getWalletBalance());
        }
        dispatch(fetchRecentOrders());
        dispatch(fetchTopSellingProducts());

        // Fetch graph data
        console.log("Initial fetch - Visitor data:", { startDate: s, endDate: e, period: 'monthly' });
        dispatch(getCustomerGraphData({ startDate: s, endDate: e, period: 'monthly' }));
        dispatch(getWebsiteVisitCount({ startDate: s, endDate: e, period: 'monthly' }));
        dispatch(getOrderDeliveredGraphData({ startDate: s, endDate: e, period: 'monthly' }));
        dispatch(getOrderGraphData({ startDate: s, endDate: e, period: 'monthly' }));
    }, [dispatch, user]);

    // Updated Colors for better visual appeal
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    const LINE_CHART_COLOR = '#8884d8';

    // Prepare data for charts
    const visitorData = CustomerVisitersGraphData?.map(item => ({
        date: item.date,
        count: item.count
    })) || [];

    console.log("CustomerVisitersGraphData:", CustomerVisitersGraphData);
    console.log("Mapped visitorData:", visitorData);

    // Track when visitor data changes
    useEffect(() => {
        console.log("CustomerVisitersGraphData updated:", CustomerVisitersGraphData);
        console.log("visitorData length:", visitorData.length);
    }, [CustomerVisitersGraphData, visitorData.length]);

    const orderStatusData = [
        { name: 'Delivered', value: MaxDeliveredOrders || 0 },
        { name: 'Pending', value: (TotalOrders - (MaxDeliveredOrders || 0)) > 0 ? (TotalOrders - (MaxDeliveredOrders || 0)) : 0 }
    ];

    const getOrderStatusColor = (status) => {
        const colors = {
            'confirmed': 'bg-blue-100 text-blue-700 border-blue-200',
            'processing': 'bg-yellow-100 text-yellow-700 border-yellow-200',
            'shipped': 'bg-purple-100 text-purple-700 border-purple-200',
            'delivered': 'bg-green-100 text-green-700 border-green-200',
            'canceled': 'bg-red-100 text-red-700 border-red-200',
            'cancelled': 'bg-red-100 text-red-700 border-red-200',
            'pending': 'bg-orange-100 text-orange-700 border-orange-200',
        };
        return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-700 border-gray-200';
    };

    const StatCard = ({ title, value, icon: Icon, growth, prefix = '', suffix = '' }) => (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gray-600" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                    {prefix}{value?.toLocaleString()}{suffix}
                </div>
                {growth !== undefined && (
                    <div className="flex items-center gap-1 text-sm">
                        {growth >= 0 ? (
                            <>
                                <TrendingUp className="w-4 h-4 text-green-600" />
                                <span className="text-green-600 font-medium">+{growth}%</span>
                            </>
                        ) : (
                            <>
                                <TrendingDown className="w-4 h-4 text-red-600" />
                                <span className="text-red-600 font-medium">{growth}%</span>
                            </>
                        )}
                        <span className="text-gray-500">vs last month</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );

    const downloadCSV = () => {
        const header = ['Date', 'Count'];
        const rows = visitorData.map(item => [item.date, item.count]);
        const csvContent = [header, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, `Visitor_Growth_Data.csv`);
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text('Visitor Growth Data', 20, 20);
        visitorData.forEach((item, index) => {
            doc.text(`${item.date}: ${item.count}`, 20, 30 + (index * 10));
        });
        doc.save('Visitor_Growth_Data.pdf');
    };

    const downloadExcel = () => {
        const ws = XLSX.utils.json_to_sheet(visitorData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'VisitorGrowthData');
        XLSX.writeFile(wb, 'Visitor_Growth_Data.xlsx');
    };

    const handleExport = (value) => {
        switch (value) {
            case 'csv':
                downloadCSV();
                break;
            case 'pdf':
                downloadPDF();
                break;
            case 'excel':
                downloadExcel();
                break;
            default:
                break;
        }
    };

    const handleViewAllOrders = () => {
        if (user?.role === 'admin') {
            checkAndCreateToast('error', 'Access Denied');
        } else {
            navigate('/admin/orders');
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-32 rounded-xl" />
                    ))}
                </div>
                <div className="grid lg:grid-cols-2 gap-6">
                    <Skeleton className="h-96 rounded-xl" />
                    <Skeleton className="h-96 rounded-xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-1">Welcome back, {user?.name || 'Admin'}</p>
                </div>
                <div className="flex gap-2">
                    <Select onValueChange={handleExport}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Export Data" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="csv">Export as CSV</SelectItem>
                            <SelectItem value="pdf">Export as PDF</SelectItem>
                            <SelectItem value="excel">Export as Excel</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* {user?.role === 'superAdmin' && (
                    <StatCard
                        title="Wallet Balance"
                        value={walletBalance || 0}
                        icon={IndianRupee}
                        prefix="₹"
                    />
                )} */}
                <StatCard
                    title="Total Orders"
                    value={TotalOrders || 0}
                    icon={ShoppingCart}
                />
                <StatCard
                    title="Total Customers"
                    value={TotalCustomers || 0}
                    icon={Users}
                />
                <StatCard
                    title="Total Products"
                    value={TotalProducts || 0}
                    icon={Package}
                />
                <StatCard
                    title="Total Visitors"
                    value={Math.round(AverageCountPerDay || 0)}
                    icon={Activity}
                    suffix="/day"
                />
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
                {/* Website Visitors Chart */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="w-5 h-5" />
                                Website Visitors
                            </CardTitle>
                            <div className="flex items-center gap-2">
                                <Select
                                    value={startDate.substring(0, 7)}
                                    onValueChange={(value) => {
                                        const [year, month] = value.split('-');
                                        const yearNum = parseInt(year);
                                        const monthNum = parseInt(month);

                                        // Calculate start date (first day of month)
                                        const startDay = String(1).padStart(2, '0');
                                        const s = `${year}-${month}-${startDay}`;

                                        // Calculate end date (last day of month)
                                        const lastDay = new Date(yearNum, monthNum, 0).getDate();
                                        const e = `${year}-${month}-${String(lastDay).padStart(2, '0')}`;

                                        console.log("Month selected:", { value, startDate: s, endDate: e, period: 'monthly' });

                                        setStartDate(s);
                                        setEndDate(e);

                                        // Create date for label display
                                        const labelDate = new Date(yearNum, monthNum - 1, 1);
                                        setDateLabel(labelDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase());
                                        dispatch(getWebsiteVisitCount({ startDate: s, endDate: e, period: 'monthly' }));
                                    }}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select Month" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.from({ length: 12 }, (_, i) => {
                                            const date = new Date();
                                            date.setMonth(date.getMonth() - i);
                                            const year = date.getFullYear();
                                            const month = String(date.getMonth() + 1).padStart(2, '0');
                                            const value = `${year}-${month}`;
                                            const label = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                                            return (
                                                <SelectItem key={value} value={value}>
                                                    {label}
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={visitorData} key={`visitor-chart-${visitorData.length}-${startDate}`}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="date" stroke="#6b7280" />
                                <YAxis stroke="#6b7280" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    stroke={LINE_CHART_COLOR}
                                    strokeWidth={2}
                                    dot={{ fill: LINE_CHART_COLOR }}
                                    name="Visitors"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Order Status Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="w-5 h-5" />
                            Order Status Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={orderStatusData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {orderStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Orders & Top Products */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Recent Orders</CardTitle>
                        {user?.role !== 'admin' && (
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={handleViewAllOrders}
                            >
                                View All
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                            {RecentOrders && RecentOrders.length > 0 ? (
                                RecentOrders.map(order => (
                                    <div
                                        key={order._id}
                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                        onClick={handleViewAllOrders}
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 truncate">{order._id}</p>
                                            <p className="text-sm text-gray-600">{order?.userId?.name}</p>
                                        </div>
                                        <div className="text-right ml-4">
                                            <p className="font-semibold text-gray-900">₹{order.TotalAmount}</p>
                                            <Badge
                                                className={`capitalize ${getOrderStatusColor(order.status)}`}
                                            >
                                                {order.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-8">No orders yet</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Products */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Top Products</CardTitle>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => navigate('/admin/products')}
                        >
                            View All
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                            {TopSellingProducts && TopSellingProducts.length > 0 ? (
                                TopSellingProducts.map(product => (
                                    <div
                                        key={product._id}
                                        className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                        onClick={() => navigate(`/admin/products`)}
                                    >
                                        <img
                                            src={product.image || 'https://via.placeholder.com/100'}
                                            alt={product.title}
                                            className="w-16 h-16 object-cover rounded-lg"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 truncate">{product.title}</p>
                                            <p className="text-sm text-gray-600">
                                                Stock: {product.totalStock || 0} • ₹{product.salePrice || product.price}
                                            </p>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="text-yellow-500 text-sm">
                                                ★ {product.averageRating?.toFixed(1)}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-8">No products yet</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
