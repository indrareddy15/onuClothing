import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders } from '../../../action/orderaction';
import { useNavigate } from 'react-router-dom';
import { useEncryptionDecryptionContext } from '../../../Contaxt/EncryptionContext';
import { ORDER_ENCRYPTION_SECREAT_KEY, formattedSalePrice } from '../../../config';
import { ChevronRight, ShoppingBag, Calendar, Package, Filter, ChevronLeft, ArrowRight } from 'lucide-react';
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
            className="group flex flex-col p-4 sm:p-5 border border-border rounded-xl hover:border-primary/50 hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] transition-all cursor-pointer bg-card overflow-hidden"
        >
            <div className="flex flex-row gap-3 sm:gap-5">
                {/* Image Section */}
                <div className="flex-shrink-0">
                    <LazyLoadImage
                        effect='blur'
                        wrapperProps={{ style: { transitionDelay: "0.2s" } }}
                        placeholder={<div className="w-20 h-20 sm:w-24 sm:h-24 bg-muted animate-pulse rounded-lg"></div>}
                        src={order?.orderItems?.[0]?.color?.images?.[0]?.url || ''}
                        alt="Order Item"
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border border-border/50 shadow-sm"
                    />
                </div>

                {/* Details Section */}
                <div className="flex flex-col flex-1 min-w-0 justify-between py-0.5">
                    <div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 mb-1">
                            <span className="font-bold text-sm sm:text-base md:text-lg text-foreground truncate">
                                Order #{order?.order_id}
                            </span>
                            <Badge className={`w-fit capitalize px-2 py-0.5 text-[10px] sm:text-xs whitespace-nowrap ${getStatusColorClass(order?.status)}`} variant="outline">
                                {order?.status}
                            </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-3 mt-2 text-xs sm:text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5 truncate">
                                <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                                <span className="truncate">
                                    {order?.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Date N/A'}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Package className="w-3.5 h-3.5 flex-shrink-0" />
                                {order?.orderItems?.length || 0} {order?.orderItems?.length === 1 ? 'Item' : 'Items'}
                            </div>
                        </div>
                    </div>

                    <div className="hidden sm:flex justify-between items-end mt-2 pt-2 border-t border-border/50">
                        <div>
                            <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Amount</p>
                            <p className="text-sm sm:text-base font-bold text-foreground">
                                ₹{formattedSalePrice(order?.TotalAmount || order?.totalPrice)}
                            </p>
                        </div>
                        <Button variant="ghost" size="sm" className="gap-1.5 text-primary hover:text-primary hover:bg-primary/10 h-8 px-3">
                            <span className="text-xs font-medium">View Details</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Price & Action Section */}
            <div className="flex sm:hidden justify-between items-center mt-3 pt-3 border-t border-border/50">
                <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Total</p>
                    <p className="text-sm font-bold text-foreground">
                        ₹{formattedSalePrice(order?.TotalAmount || order?.totalPrice)}
                    </p>
                </div>
                <Button variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary hover:bg-primary/10 h-8 px-2">
                    <span className="text-xs font-medium">Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                </Button>
            </div>

            {/* Delivery Status Bar */}
            {order?.status !== 'Cancelled' && order?.status !== 'Returned' && (
                <div className="w-full mt-3 pt-3 border-t border-border/50 sm:block">
                    <DeliveryStatusAllOrders status={order?.status} hiddenText={true} />
                </div>
            )}
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

    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    // Reset page to 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filter, statusFilter, sort]);

    const ordersToDisplay = filteredOrders();
    const totalPages = Math.ceil((ordersToDisplay?.length || 0) / ITEMS_PER_PAGE);
    
    const paginatedOrders = ordersToDisplay.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

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
                            <div key={i} className="p-4 sm:p-5 border border-border rounded-xl space-y-4 bg-card">
                                <div className="flex gap-4">
                                    <Skeleton className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-muted" />
                                    <div className="flex-1 space-y-3 py-1">
                                        <div className="flex justify-between items-start">
                                            <Skeleton className="h-5 sm:h-6 w-1/3 bg-muted" />
                                            <Skeleton className="h-5 w-20 bg-muted rounded-full" />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            <Skeleton className="h-4 w-3/4 bg-muted" />
                                            <Skeleton className="h-4 w-1/2 bg-muted" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {paginatedOrders && paginatedOrders.length > 0 ? (
                            <>
                                {paginatedOrders.map((order, index) => (
                                    <OrderCard
                                        key={order._id || index}
                                        order={order}
                                        onViewDetails={handleViewDetails}
                                    />
                                ))}

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-between border-t border-border pt-6 mt-6">
                                        <p className="text-sm text-muted-foreground hidden sm:block">
                                            Showing <span className="font-medium text-foreground">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium text-foreground">{Math.min(currentPage * ITEMS_PER_PAGE, ordersToDisplay.length)}</span> of <span className="font-medium text-foreground">{ordersToDisplay.length}</span> results
                                        </p>
                                        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                disabled={currentPage === 1}
                                                className="gap-1 h-9"
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                                <span className="hidden sm:inline">Previous</span>
                                            </Button>
                                            <span className="text-sm font-medium text-foreground px-4 py-1.5 rounded-md bg-muted/50 border border-border">
                                                Page {currentPage} of {totalPages}
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                                disabled={currentPage === totalPages}
                                                className="gap-1 h-9"
                                            >
                                                <span className="hidden sm:inline">Next</span>
                                                <ChevronRight className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-16 px-4 bg-muted/20 rounded-xl border border-dashed border-border/60">
                                <div className="bg-background w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-border/50">
                                    <ShoppingBag className="w-8 h-8 text-muted-foreground/60" />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">No orders found</h3>
                                <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
                                    We couldn't find any orders matching your current filter criteria.
                                </p>
                                <Button
                                    variant="default"
                                    onClick={() => { setFilter('all'); setStatusFilter('all'); }}
                                    className="shadow-sm"
                                >
                                    Clear All Filters
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
