import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getAllCustomerWithDetails, removeCustomer } from "@/store/admin/users-slice";
import CustomerDetailsSingle from "@/components/admin-view/CustomerDetailsSingle";
import { useDispatch, useSelector } from "react-redux";
import LoadingView from "./LoadingView";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash, ChevronLeft, ChevronRight, Search, Download, Users, ShoppingBag, Calendar, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSettingsContext } from "@/Context/SettingsContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const pageSize = 10;

const UserTable = () => {
    const dispatch = useDispatch();
    const { checkAndCreateToast } = useSettingsContext();
    const [checkAll, setCheckAll] = useState(false);
    const [deletingCustomer, setDeletingCustomer] = useState([]);
    const [activeKeywords, setActiveKeywords] = useState('');
    const [inputKeyWoards, setInputKeyWords] = useState("");
    const [page, setPage] = useState(1);

    const [dateFilter, setDateFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');

    const { AllUser, pagination, isLoading } = useSelector(state => state.Customer);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const handleSearch = () => {
        setActiveKeywords(inputKeyWoards);
        setPage(1);
    };

    const handleFetchAllUser = () => {
        const queryParams = `?page=${page}&pageSize=${pageSize}&keywoards=${activeKeywords}&dateFilter=${dateFilter}&typeFilter=${typeFilter}`;
        dispatch(getAllCustomerWithDetails(queryParams));
    };

    const handleChangeCustomer = (id) => {
        if (deletingCustomer.includes(id)) {
            setDeletingCustomer(deletingCustomer.filter(current => current !== id));
        } else {
            setDeletingCustomer([...deletingCustomer, id]);
        }
    };

    useEffect(() => {
        if (checkAll) {
            setDeletingCustomer(AllUser.map(customer => customer._id));
        } else {
            setDeletingCustomer([]);
        }
    }, [checkAll, AllUser]);

    const handleSelectAllCustomer = () => {
        setCheckAll(!checkAll);
    };

    useEffect(() => {
        handleFetchAllUser();
    }, [dispatch, page, pageSize, activeKeywords, dateFilter, typeFilter]);

    const openModal = (customer) => {
        setSelectedCustomer(customer);
        setIsModalOpen(true);
    };

    const HandleDeleteCustomer = async () => {
        const response = await dispatch(removeCustomer({ removingCustomerArray: deletingCustomer }));
        if (response?.payload?.Success) {
            checkAndCreateToast('success', "Users Deleted Successfully");
            setDeletingCustomer([]);
            setCheckAll(false);
            handleFetchAllUser();
        } else {
            checkAndCreateToast('error', "Failed to Delete Users");
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCustomer(null);
    };

    // Pagination Handlers
    const handlePrevPage = () => {
        if (pagination?.currentPage > 1) {
            setPage(pagination?.currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (pagination?.currentPage < pagination?.totalPages) {
            setPage(pagination?.currentPage + 1);
        } else {
            checkAndCreateToast('error', "No More Pages Available");
        }
    };

    const exportToCSV = () => {
        const headers = ['Name', 'Email', 'Phone', 'Registration Date', 'Total Orders', 'Total Spent', 'Cart Items', 'Wishlist Items'];
        const rows = AllUser.map(customer => [
            customer.name,
            customer.email,
            customer.phoneNumber || 'N/A',
            customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'N/A',
            customer.orders?.length || 0,
            customer.totalPurchases || 0,
            customer.cart?.length || 0,
            customer.wishList?.length || 0
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `customers-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        checkAndCreateToast('success', 'Customers exported successfully');
    };

    if (isLoading) return <LoadingView />;

    return (
        <div className="w-full space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
                    <p className="text-gray-600 mt-1">Manage your customer base</p>
                </div>
                <div className="flex gap-2">
                    {deletingCustomer.length > 0 && (
                        <Button onClick={HandleDeleteCustomer} variant="destructive">
                            <Trash className="w-4 h-4 mr-2" />
                            Delete ({deletingCustomer.length})
                        </Button>
                    )}
                    <Button onClick={exportToCSV} variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* Filters Section */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex flex-1 gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    type="text"
                                    value={inputKeyWoards}
                                    onChange={(e) => setInputKeyWords(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    placeholder="Search by Name, Email, Phone..."
                                    className="pl-10"
                                />
                            </div>
                            <Button onClick={handleSearch}>Search</Button>
                        </div>
                        <div className="w-full md:w-[200px]">
                            <Select value={dateFilter} onValueChange={(value) => { setDateFilter(value); setPage(1); }}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Registration Date" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Time</SelectItem>
                                    <SelectItem value="today">Today</SelectItem>
                                    <SelectItem value="last7days">Last 7 Days</SelectItem>
                                    <SelectItem value="last30days">Last 30 Days</SelectItem>
                                    <SelectItem value="last3months">Last 3 Months</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-full md:w-[200px]">
                            <Select value={typeFilter} onValueChange={(value) => { setTypeFilter(value); setPage(1); }}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Customer Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Customers</SelectItem>
                                    <SelectItem value="with_orders">With Orders</SelectItem>
                                    <SelectItem value="without_orders">Without Orders</SelectItem>
                                    <SelectItem value="frequent_buyers">Frequent Buyers (3+)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Table Section */}
            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px] text-center">
                                    <Checkbox
                                        checked={AllUser?.length > 0 && deletingCustomer.length === AllUser.length}
                                        onCheckedChange={handleSelectAllCustomer}
                                    />
                                </TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Registration Date</TableHead>
                                <TableHead className="text-center">Total Orders</TableHead>
                                <TableHead className="text-center">Total Spent</TableHead>
                                <TableHead className="text-center">Cart Items</TableHead>
                                <TableHead className="text-center">Wishlist Items</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {AllUser && AllUser.length > 0 ? (
                                AllUser.map((customer) => (
                                    <TableRow key={customer._id} className="hover:bg-gray-50">
                                        <TableCell className="text-center">
                                            <Checkbox
                                                checked={deletingCustomer.includes(customer._id)}
                                                onCheckedChange={() => handleChangeCustomer(customer._id)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium text-gray-900">{customer?.name}</p>
                                                <p className="text-sm text-gray-500">{customer?.email}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-gray-600">
                                            {customer?.phoneNumber || 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Calendar className="w-4 h-4" />
                                                {customer?.createdAt ? format(new Date(customer.createdAt), 'MMM dd, yyyy') : 'N/A'}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <ShoppingBag className="w-4 h-4 text-gray-400" />
                                                <span className="font-medium">{customer?.orders?.length || 0}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center font-medium">
                                            ₹{customer?.totalPurchases?.toLocaleString() || 0}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="secondary">
                                                {customer?.cart?.length || 0}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="secondary">
                                                {customer?.wishList?.length || 0}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => openModal(customer)}
                                            >
                                                <Eye className="w-4 h-4 mr-2" />
                                                View
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                                        <Users className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                                        <p>No customers found</p>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {pagination?.totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t">
                        <p className="text-sm text-gray-600">
                            Page {pagination?.currentPage} of {pagination?.totalPages}
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handlePrevPage}
                                disabled={page === 1}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleNextPage}
                                disabled={page === pagination?.totalPages}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </Card>

            {/* Customer Details Dialog */}
            <Dialog open={isModalOpen} onOpenChange={closeModal}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Customer Details</DialogTitle>
                    </DialogHeader>
                    {selectedCustomer && <CustomerDetailsSingle user={selectedCustomer} />}
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default UserTable;
