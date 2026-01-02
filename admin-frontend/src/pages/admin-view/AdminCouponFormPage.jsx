import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { createNewCoupon, deleteCoupon, editCoupon, fetchAllCoupons } from '@/store/admin/product-slice';
import { fetchAllOptions } from '@/store/common-slice';
import { X, Plus, Filter, ArrowUpDown, Calendar as CalendarIcon, Trash2, Edit } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSettingsContext } from '@/Context/SettingsContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';

const AdminCouponFormPage = () => {
    const dispatch = useDispatch();
    const { Coupons } = useSelector(state => state.adminProducts);
    const { AllOptions } = useSelector(state => state.common);
    const { checkAndCreateToast } = useSettingsContext();

    // State to handle form data and coupons list
    const [couponName, setCouponName] = useState('');
    const [couponDescription, setCouponDescription] = useState('');
    const [couponCode, setCouponCode] = useState('');
    const [couponType, setCouponType] = useState('Percentage');
    const [discount, setDiscount] = useState('');
    const [minOrderAmount, setMinOrderAmount] = useState(0);
    const [customerLogin, setCustomerLogin] = useState(false);
    const [freeShipping, setFreeShipping] = useState(false);
    const [category, setCategory] = useState('');
    const [validDate, setValidDate] = useState('');
    const [status, setStatus] = useState('Active');
    const [modalCoupon, setModalCoupon] = useState(null);

    // State to control the modal visibility
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    // Sorting state
    const [statusFilter, setStatusFilter] = useState('none');  // To filter orders by status
    const [sortOption, setSortOption] = useState('latest');
    const [sortedCoupons, setSortedCoupons] = useState(Coupons);


    const handleRemoveCoupon = (couponId) => {
        setDeleteId(couponId);
        setOpenDeleteDialog(true);
    }

    const confirmDeleteCoupon = async () => {
        if (!deleteId) return;

        await dispatch(deleteCoupon({ couponId: deleteId }));
        checkAndCreateToast('success', "Coupon deleted successfully");
        dispatch(fetchAllCoupons());
        setOpenDeleteDialog(false);
        setDeleteId(null);
    }

    // Handle form submission
    const handleSubmit = async (e) => {
        if (e) {
            e.preventDefault();
        }
        const newCoupon = {
            couponName,
            couponCode,
            couponDescription,
            couponType,
            discount,
            minOrderAmount,
            customerLogin,
            freeShipping,
            category,
            status,
            validDate: validDate || '',
        };
        if (modalCoupon === null) {
            console.log("New Coupon: ", newCoupon);
            await dispatch(createNewCoupon({ couponData: newCoupon }));
            checkAndCreateToast('success', "Coupon created successfully")
        } else {
            console.log("Editing Coupon: ", modalCoupon);
            await dispatch(editCoupon({ couponId: modalCoupon._id, couponData: newCoupon }));
            checkAndCreateToast('success', "Coupon updated successfully")
        }
        resetForm();
        setModalCoupon(null);
        setIsModalOpen(false);  // Close the modal after submission
        dispatch(fetchAllCoupons());
    };

    // Reset the form fields after submission
    const resetForm = () => {
        setCouponName('');
        setCouponDescription('');
        setCouponCode('');
        setCouponType('Percentage');
        setDiscount('');
        setMinOrderAmount(0);
        setCustomerLogin(false);
        setFreeShipping(false);
        setCategory('');
        setValidDate('');
        setStatus('Active');
    };

    // Open the modal to edit coupon
    const openEditModal = (coupon) => {
        setCouponName(coupon?.CouponName);
        setCouponDescription(coupon?.Description);
        setCouponCode(coupon?.CouponCode);
        setCouponType(coupon?.CouponType);
        setDiscount(coupon?.Discount);
        setMinOrderAmount(coupon?.MinOrderAmount);
        setCustomerLogin(coupon?.CustomerLogin);
        setFreeShipping(coupon?.FreeShipping);
        setCategory(coupon?.Category);
        setValidDate(coupon.ValidDate ? new Date(coupon.ValidDate) : '');
        setStatus(coupon?.Status);
        setModalCoupon(coupon);
        setIsModalOpen(true)
    };

    useEffect(() => {
        dispatch(fetchAllCoupons());
        dispatch(fetchAllOptions());
    }, [dispatch]);

    useEffect(() => {
        let sorted = [...(Coupons || [])];

        switch (sortOption) {
            case 'latest':
                sorted.sort((a, b) => new Date(b.ValidDate) - new Date(a.ValidDate));
                break;
            case 'oldest':
                sorted.sort((a, b) => new Date(a.ValidDate) - new Date(b.ValidDate));
                break;
            case 'discountLowToHigh':
                sorted.sort((a, b) => a.Discount - b.Discount);
                break;
            case 'discountHighToLow':
                sorted.sort((a, b) => b.Discount - a.Discount);
                break;
            default:
                break;
        }

        setSortedCoupons(sorted);
    }, [Coupons, sortOption]);

    const allCategories = AllOptions && AllOptions.length > 0 && AllOptions.filter(item => item.type === 'category') || [];

    // Check if there are no orders available
    const isNoCoupons = !Coupons || Coupons.length === 0;
    const filteredOrderList = sortedCoupons && sortedCoupons.length > 0 && sortedCoupons.filter(coupon => {
        if (statusFilter === 'none') return true; // No filter selected, show all orders
        return coupon?.Status === statusFilter;
    });
    useEffect(() => {
        window.scroll(0, 0);
    }, [])

    return (
        <div className="w-full space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Coupon Management</h1>
                    <p className="text-gray-600 mt-1">Manage discounts and promotional codes</p>
                </div>
                <Button onClick={() => { resetForm(); setModalCoupon(null); setIsModalOpen(true); }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Coupon
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        <CardTitle>All Coupons</CardTitle>
                        <div className="flex gap-2 w-full md:w-auto">
                            <Select
                                value={sortOption}
                                onValueChange={(value) => setSortOption(value)}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <ArrowUpDown className="w-4 h-4 mr-2" />
                                    <SelectValue placeholder="Sort By" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="latest">Latest</SelectItem>
                                    <SelectItem value="oldest">Oldest</SelectItem>
                                    <SelectItem value="discountLowToHigh">Discount: Low to High</SelectItem>
                                    <SelectItem value="discountHighToLow">Discount: High to Low</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select
                                value={statusFilter}
                                onValueChange={(value) => setStatusFilter(value)}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <Filter className="w-4 h-4 mr-2" />
                                    <SelectValue placeholder="Filter Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">All Status</SelectItem>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isNoCoupons ? (
                        <div className="text-center py-12 text-gray-500">
                            <p className="text-lg font-medium">No Coupons Available</p>
                            <p className="text-sm">Create a new coupon to get started.</p>
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Coupon Name</TableHead>
                                        <TableHead>Code</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Discount</TableHead>
                                        <TableHead>Valid Until</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredOrderList && filteredOrderList.length > 0 ? (
                                        filteredOrderList.map((coupon) => (
                                            <TableRow key={coupon?._id}>
                                                <TableCell className="font-medium">{coupon?.CouponName}</TableCell>
                                                <TableCell>
                                                    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                                                        {coupon?.CouponCode}
                                                    </code>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={coupon.Status === "Active" ? "default" : "secondary"}>
                                                        {coupon.Status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{coupon?.CouponType}</TableCell>
                                                <TableCell className="font-bold">
                                                    {coupon?.CouponType === 'Percentage' ? `${coupon?.Discount}%` : `₹${coupon?.Discount}`}
                                                </TableCell>
                                                <TableCell>
                                                    {coupon?.ValidDate ? format(new Date(coupon.ValidDate), 'PP') : 'N/A'}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => openEditModal(coupon)}
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            onClick={() => handleRemoveCoupon(coupon?._id)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-24 text-center">
                                                No coupons found matching your filter.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{modalCoupon ? "Edit Coupon" : "Create New Coupon"}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="couponName">Coupon Name</Label>
                                <Input
                                    id="couponName"
                                    placeholder="e.g., Summer Sale"
                                    value={couponName}
                                    onChange={(e) => setCouponName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="couponCode">Coupon Code</Label>
                                <Input
                                    id="couponCode"
                                    placeholder="e.g., SUMMER2024"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="couponDescription">Description</Label>
                            <Textarea
                                id="couponDescription"
                                placeholder="Describe the coupon details..."
                                value={couponDescription}
                                onChange={(e) => setCouponDescription(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Coupon Type</Label>
                                <Select value={couponType} onValueChange={setCouponType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Percentage">Percentage</SelectItem>
                                        <SelectItem value="Price">Fixed Amount</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="discount">Discount Value</Label>
                                <Input
                                    id="discount"
                                    type="number"
                                    placeholder={couponType === 'Percentage' ? "e.g., 20" : "e.g., 500"}
                                    value={discount}
                                    onChange={(e) => setDiscount(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="minOrderAmount">Min Order Amount</Label>
                                <Input
                                    id="minOrderAmount"
                                    type="number"
                                    value={minOrderAmount}
                                    onChange={(e) => setMinOrderAmount(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Valid Until</Label>
                                <div className="border rounded-md p-2">
                                    <DatePicker
                                        selected={validDate}
                                        onChange={(date) => setValidDate(date)}
                                        dateFormat="yyyy-MM-dd"
                                        placeholderText="Select expiry date"
                                        className="w-full outline-none bg-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Category Restriction</Label>
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Category (Optional)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">All Categories</SelectItem>
                                        {allCategories.map((cat) => (
                                            <SelectItem key={cat.value} value={cat.value}>
                                                {cat.value}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex gap-6 pt-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="customerLogin"
                                    checked={customerLogin}
                                    onCheckedChange={setCustomerLogin}
                                />
                                <Label htmlFor="customerLogin">Login Required</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="freeShipping"
                                    checked={freeShipping}
                                    onCheckedChange={setFreeShipping}
                                />
                                <Label htmlFor="freeShipping">Free Shipping</Label>
                            </div>
                        </div>

                        <Button onClick={handleSubmit} className="w-full mt-4">
                            {modalCoupon ? 'Update Coupon' : 'Create Coupon'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete the coupon.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpenDeleteDialog(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDeleteCoupon}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminCouponFormPage;
