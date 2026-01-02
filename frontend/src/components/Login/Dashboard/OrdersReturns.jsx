import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders } from '../../../action/orderaction';
import { useNavigate } from 'react-router-dom';
import { useEncryptionDecryptionContext } from '../../../Contaxt/EncryptionContext';
import { ORDER_ENCRYPTION_SECREAT_KEY, formattedSalePrice } from '../../../config';
import { ChevronRight, ShoppingBag, Calendar, Package, Filter } from 'lucide-react';
import DeliveryStatusAllOrders from './DeliveryStatusAllOrders';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Skeleton } from '../../ui/skeleton';
import { Button } from '../../ui/button';
import { Separator } from '../../ui/separator';

const OrderCard = ({ order, onViewDetails }) => {
    const getStatusVariant = (status) => {
        const variants = {
            'Confirmed': 'default', // or a custom class if needed
            'Processing': 'secondary',
            'Shipped': 'secondary',
            'Delivered': 'success', // Assuming you have a success variant or use custom class
            'Cancelled': 'destructive',
        };
        // Fallback to outline or secondary if variant doesn't exist in your badge component
        return variants[status] || 'outline';
    };

    const getStatusColorClass = (status) => {
        const colors = {
            'Confirmed': 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300',
            'Processing': 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300',
            'Shipped': 'bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300',
            'Delivered': 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300',
            'Cancelled': 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300',
            'RTS': 'bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-300',
            'Ready To Ship': 'bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-300',
            'OFD': 'bg-pink-100 text-pink-800 hover:bg-pink-200 dark:bg-pink-900/30 dark:text-pink-300',
            'Out For Delivery': 'bg-pink-100 text-pink-800 hover:bg-pink-200 dark:bg-pink-900/30 dark:text-pink-300',
            'Out for Delivery': 'bg-pink-100 text-pink-800 hover:bg-pink-200 dark:bg-pink-900/30 dark:text-pink-300',
        };
        return colors[status] || '';
    }

    return (
        <div
            onClick={() => onViewDetails(order)}
            className="group flex flex-col sm:flex-row gap-6 p-6 border border-border rounded-xl hover:border-primary/50 hover:shadow-md transition-all cursor-pointer bg-card"
        >
            {/* Image Section */}
            <div className="flex-shrink-0">
                <LazyLoadImage
                    effect='blur'
                    wrapperProps={{ style: { transitionDelay: "0.5s" } }}
                    placeholder={<div className="w-24 h-24 bg-muted animate-pulse rounded-lg"></div>}
                    src={order?.orderItems[0]?.color?.images[0]?.url}
                    alt="Order Item"
                    className="w-24 h-24 object-cover rounded-lg border border-border"
                />
            </div>

            {/* Details Section */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-lg text-foreground">Order #{order?.order_id}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {order?.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Date N/A'}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Package className="w-4 h-4" />
                        {order?.orderItems?.length || 0} Items
                    </div>
                </div>

                <div className="flex flex-col justify-between items-start md:items-end space-y-2">
                    <Badge className={`capitalize px-3 py-1 ${getStatusColorClass(order?.status)}`} variant="outline">
                        {order?.status}
                    </Badge>
                    <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total Amount</p>
                        <p className="text-lg font-bold text-foreground">
                            ₹{formattedSalePrice(order?.TotalAmount || order?.totalPrice)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Action Section (Desktop) */}
            <div className="hidden sm:flex items-center justify-center pl-4 border-l border-border">
                <Button variant="ghost" size="icon" className="text-muted-foreground group-hover:text-primary">
                    <ChevronRight className="w-6 h-6" />
                </Button>
            </div>
            {/* Delivery Status Bar */}
            <div className="w-full sm:hidden pt-4 border-t border-border">
                <DeliveryStatusAllOrders status={order?.status} hiddenText={true} />
            </div>
        </div>
    );
};

const OrdersReturns = () => {
    const orderStatus = [
        { id: 'Confirmed', label: 'Confirmed' },
        { id: 'Processing', label: 'Processing' },
        { id: 'Shipped', label: 'Shipped' },
        { id: 'Delivered', label: 'Delivered' },
        { id: 'Canceled', label: 'Canceled' },
        { id: 'Out For Delivery', label: 'Out For Delivery' },
    ];

    const { encryptWithKey } = useEncryptionDecryptionContext();
    const { allorder, loading: orderLoading } = useSelector((state) => state.getallOrders);
    const dispatch = useDispatch();
    const navigation = useNavigate();
    const [filter, setFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sort, setSort] = useState('latest');

    const handleViewDetails = (order) => {
        const productEncryption = encryptWithKey(order?._id, ORDER_ENCRYPTION_SECREAT_KEY);
        navigation(`/order/details/${productEncryption}`);
    };

    useEffect(() => {
        dispatch(fetchAllOrders());
    }, [dispatch]);

    const filteredOrders = () => {
        let orders = allorder ? [...allorder] : [];

        if (filter && filter !== 'all') {
            const currentDate = new Date();
            switch (filter) {
                case 'thisMonth':
                    orders = orders.filter(order => {
                        const orderDate = new Date(order.createdAt);
                        return orderDate.getMonth() === currentDate.getMonth() &&
                            orderDate.getFullYear() === currentDate.getFullYear();
                    });
                    break;
                case 'last7Days':
                    orders = orders.filter(order => {
                        const orderDate = new Date(order.createdAt);
                        const sevenDaysAgo = new Date();
                        sevenDaysAgo.setDate(currentDate.getDate() - 7);
                        return orderDate >= sevenDaysAgo;
                    });
                    break;
                case 'yesterday':
                    orders = orders.filter(order => {
                        const orderDate = new Date(order.createdAt);
                        const yesterday = new Date();
                        yesterday.setDate(currentDate.getDate() - 1);
                        return orderDate.toDateString() === yesterday.toDateString();
                    });
                    break;
            }
        }

        if (sort) {
            if (sort === 'latest') {
                orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            } else if (sort === 'oldest') {
                orders.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            }
        }

        if (statusFilter && statusFilter !== 'all') {
            orders = orders.filter((order) => order?.status === statusFilter);
        }

        return orders;
    };

    const ordersToDisplay = filteredOrders();

    return (
        <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2 text-xl text-foreground">
                        <ShoppingBag className="w-5 h-5" />
                        Orders & Returns
                    </CardTitle>
                    <CardDescription>Manage and track your recent orders.</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground ml-1">Date Range</label>
                        <Select value={filter} onValueChange={setFilter}>
                            <SelectTrigger className="bg-background border-input text-foreground">
                                <SelectValue placeholder="Filter by Date" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Dates</SelectItem>
                                <SelectItem value="thisMonth">This Month</SelectItem>
                                <SelectItem value="last7Days">Last 7 Days</SelectItem>
                                <SelectItem value="yesterday">Yesterday</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground ml-1">Status</label>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="bg-background border-input text-foreground">
                                <SelectValue placeholder="Filter by Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                {orderStatus.map((status) => (
                                    <SelectItem key={status.id} value={status.id}>{status.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground ml-1">Sort Order</label>
                        <Select value={sort} onValueChange={setSort}>
                            <SelectTrigger className="bg-background border-input text-foreground">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="latest">Latest First</SelectItem>
                                <SelectItem value="oldest">Oldest First</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Separator />

                {/* Orders List */}
                {orderLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="p-4 border border-border rounded-lg space-y-3 bg-card">
                                <div className="flex gap-4">
                                    <Skeleton className="w-24 h-24 rounded-md bg-muted" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-5 w-1/3 bg-muted" />
                                        <Skeleton className="h-4 w-1/4 bg-muted" />
                                        <Skeleton className="h-4 w-1/2 bg-muted" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {ordersToDisplay && ordersToDisplay.length > 0 ? (
                            ordersToDisplay.map((order, index) => (
                                <OrderCard
                                    key={index}
                                    order={order}
                                    onViewDetails={handleViewDetails}
                                />
                            ))
                        ) : (
                            <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg border border-dashed border-border">
                                <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                                <p>No orders found matching your criteria.</p>
                                <Button
                                    variant="link"
                                    onClick={() => { setFilter('all'); setStatusFilter('all'); }}
                                    className="mt-4 text-primary"
                                >
                                    Clear Filters
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default OrdersReturns;
