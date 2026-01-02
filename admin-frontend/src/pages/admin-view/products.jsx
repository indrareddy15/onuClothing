import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchAllProducts,
    addNewProduct,
    editProducts,
    delProducts
} from '@/store/admin/product-slice';
import { fetchAllOptions } from '@/store/common-slice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Plus,
    Search,
    MoreVertical,
    Edit,
    Trash2,
    Eye,
    Package,
    Download,
    ChevronLeft,
    ChevronRight,
    AlertTriangle,
    TrendingDown,
    BarChart3
} from 'lucide-react';
import AdminProductForm from '@/components/admin-view/AdminProductForm';
import { useSettingsContext } from '@/Context/SettingsContext';
import LoadingView from './LoadingView';
import { useToast } from "@/hooks/use-toast";
import { formattedSalePrice, capitalizeFirstLetterOfEachWord } from '@/config';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const maxAmountPerPage = 10;

const AdminProducts = () => {
    const dispatch = useDispatch();
    const { checkAndCreateToast } = useSettingsContext();
    const { toast } = useToast();
    const { allProducts, productsPagination, totalProducts, isLoading: productLoading } = useSelector(state => state.adminProducts);
    const { AllOptions } = useSelector(state => state.common);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentEditingProduct, setCurrentEditingProduct] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [stockFilter, setStockFilter] = useState('all');
    const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, productId: null });

    // Filter States
    const [filters, setFilters] = useState({
        category: "all",
        subCategory: "all",
        specialCategory: 'all',
        gender: "all",
        sort: "default"
    });

    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [specialCategories, setSpecialCategories] = useState([]);

    useEffect(() => {
        dispatch(fetchAllOptions());
        dispatch(fetchAllProducts({ pageNo: currentPage }));
    }, [dispatch, currentPage]);

    useEffect(() => {
        if (AllOptions && AllOptions.length > 0) {
            setCategories(AllOptions.filter(item => item.type === 'category'));
            setSubcategories(AllOptions.filter(item => item.type === "subcategory"));
            // Assuming special categories might be static or fetched differently, 
            // but for now using the static list from config if available or hardcoded
            setSpecialCategories([
                { id: 'topPicks', label: "Top Picks" },
                { id: 'bestSeller', label: "Best Seller" },
                { id: 'luxuryItems', label: "Luxury Items" },
            ]);
        }
    }, [AllOptions]);

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleDelete = (productId) => {
        setDeleteConfirmation({ isOpen: true, productId });
    };

    const confirmDelete = async () => {
        if (deleteConfirmation.productId) {
            try {
                const result = await dispatch(delProducts(deleteConfirmation.productId));
                if (result?.payload?.Success) {
                    toast({
                        title: "Product Deleted Successfully",
                        className: "bg-green-50 border-green-200 text-green-900"
                    });
                    dispatch(fetchAllProducts({ pageNo: currentPage }));
                } else {
                    toast({
                        variant: "destructive",
                        title: "Failed to delete product"
                    });
                }
            } catch (error) {
                console.error("Delete error:", error);
                toast({
                    variant: "destructive",
                    title: "An error occurred while deleting"
                });
            } finally {
                setDeleteConfirmation({ isOpen: false, productId: null });
            }
        }
    };

    const handleView = (product) => {
        setCurrentEditingProduct(product);
        setIsFormOpen(true);
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
        setCurrentEditingProduct(null);
    };

    const handleFormSuccess = () => {
        dispatch(fetchAllProducts({ pageNo: currentPage }));
    };

    const getStockStatus = (stock) => {
        if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800 hover:bg-red-100', icon: AlertTriangle };
        if (stock <= 5) return { label: 'Critical', color: 'bg-red-100 text-red-800 hover:bg-red-100', icon: AlertTriangle };
        if (stock <= 10) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100', icon: TrendingDown };
        return { label: 'In Stock', color: 'bg-green-100 text-green-800 hover:bg-green-100', icon: Package };
    };

    // Calculate inventory metrics
    // Using allProducts if available for more accurate stats, otherwise fallback to current page
    const productsForStats = allProducts?.length > 0 ? allProducts : productsPagination;
    const lowStockCount = productsForStats.filter(p => (p.totalStock || 0) > 0 && (p.totalStock || 0) <= 10).length;
    const outOfStockCount = productsForStats.filter(p => (p.totalStock || 0) === 0).length;
    const totalInventoryValue = productsForStats.reduce((sum, p) => sum + (Number(p.price || 0) * Number(p.totalStock || 0)), 0);


    // Filtering Logic
    const filteredProducts = productsPagination.filter((product) => {
        const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.productId?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = filters.category === 'all' || product.category === filters.category;
        const matchesSubCategory = filters.subCategory === 'all' || product.subCategory === filters.subCategory;
        const matchesGender = filters.gender === 'all' || product.gender === filters.gender;
        const matchesSpecial = filters.specialCategory === 'all' || product.specialCategory === filters.specialCategory;

        let matchesStock = true;
        if (filters.sort === 'low_stock') {
            matchesStock = (product.totalStock || 0) > 0 && (product.totalStock || 0) <= 10;
        } else if (filters.sort === 'out_of_stock') {
            matchesStock = (product.totalStock || 0) === 0;
        }

        return matchesSearch && matchesCategory && matchesSubCategory && matchesGender && matchesSpecial && matchesStock;
    });

    // Sorting Logic
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (filters.sort) {
            case 'newest': return new Date(b.createdAt) - new Date(a.createdAt);
            case 'oldest': return new Date(a.createdAt) - new Date(b.createdAt);
            case 'priceLowToHigh': return (a.salePrice || a.price) - (b.salePrice || b.price);
            case 'priceHighToLow': return (b.salePrice || b.price) - (a.salePrice || a.price);
            default: return 0;
        }
    });

    const totalPages = Math.ceil(totalProducts / maxAmountPerPage);

    if (isFormOpen) {
        return (
            <AdminProductForm
                initialData={currentEditingProduct}
                isEditing={!!currentEditingProduct}
                onClose={handleFormClose}
                onSuccess={handleFormSuccess}
            />
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                    <p className="text-gray-600 mt-1">
                        Manage your product catalog
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => setIsFormOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Product
                    </Button>
                </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600">Total Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <Package className="w-5 h-5 text-blue-500" />
                            <span className="text-3xl font-bold text-gray-900">{totalProducts}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600">Low Stock Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <TrendingDown className="w-5 h-5 text-yellow-500" />
                            <span className="text-3xl font-bold text-gray-900">{lowStockCount}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600">Out of Stock</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                            <span className="text-3xl font-bold text-gray-900">{outOfStockCount}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600">Inventory Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-green-500" />
                            <span className="text-3xl font-bold text-gray-900">
                                ₹{Math.round(totalInventoryValue / 1000)}K
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters Bar */}
            <div className="bg-white rounded-xl p-4 shadow-sm mb-6 border">
                <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="relative md:col-span-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <Select value={filters.category} onValueChange={(val) => handleFilterChange('category', val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map((cat, i) => (
                                    <SelectItem key={i} value={cat.value}>{cat.value}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={filters.subCategory} onValueChange={(val) => handleFilterChange('subCategory', val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Sub-Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Sub-Categories</SelectItem>
                                {subcategories.map((cat, i) => (
                                    <SelectItem key={i} value={cat.value}>{cat.value}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={filters.gender} onValueChange={(val) => handleFilterChange('gender', val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Genders</SelectItem>
                                <SelectItem value="men">Men</SelectItem>
                                <SelectItem value="women">Women</SelectItem>
                                <SelectItem value="kids">Kids</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={filters.sort} onValueChange={(val) => handleFilterChange('sort', val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Sort By" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="default">Default</SelectItem>
                                <SelectItem value="newest">Newest First</SelectItem>
                                <SelectItem value="oldest">Oldest First</SelectItem>
                                <SelectItem value="priceLowToHigh">Price: Low to High</SelectItem>
                                <SelectItem value="priceHighToLow">Price: High to Low</SelectItem>
                                <SelectItem value="low_stock">Low Stock</SelectItem>
                                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                {productLoading ? (
                    <LoadingView isLoading={true} />
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Image</TableHead>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Stock</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sortedProducts.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                            <Package className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                                            <p>No products found</p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    sortedProducts.map((product) => {
                                        const status = getStockStatus(product.totalStock || 0);
                                        const StatusIcon = status.icon;

                                        return (
                                            <TableRow key={product._id} className="hover:bg-gray-50">
                                                <TableCell>
                                                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                                                        {product.size?.[0]?.colors?.[0]?.images?.[0]?.url ? (
                                                            <img
                                                                src={product.size[0].colors[0].images[0].url}
                                                                alt={product.title}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                <Package className="w-6 h-6" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{product.title}</p>
                                                        <p className="text-sm text-gray-500">ID: {product.productId}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1">
                                                        <Badge variant="secondary" className="w-fit capitalize">
                                                            {product.category}
                                                        </Badge>
                                                        <span className="text-xs text-gray-500 capitalize">{product.subCategory}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">₹{formattedSalePrice(product.salePrice || product.price)}</p>
                                                        {product.salePrice && (
                                                            <p className="text-sm text-gray-400 line-through">₹{formattedSalePrice(product.price)}</p>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-2">
                                                        <span className={`font-medium ${product.totalStock < 10 ? 'text-red-600' : 'text-gray-900'}`}>
                                                            {product.totalStock} Units
                                                        </span>
                                                        <Badge className={`w-fit ${status.color}`}>
                                                            <StatusIcon className="w-3 h-3 mr-1" />
                                                            {status.label}
                                                        </Badge>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreVertical className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuItem onClick={() => handleView(product)}>
                                                                <Eye className="w-4 h-4 mr-2" />
                                                                View
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={() => handleDelete(product._id)} className="text-red-600">
                                                                <Trash2 className="w-4 h-4 mr-2" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
                <span className="text-sm text-gray-500">
                    Page {currentPage} of {totalPages}
                </span>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                        <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </div>
            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteConfirmation.isOpen} onOpenChange={(open) => !open && setDeleteConfirmation({ isOpen: false, productId: null })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete the product.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-3 mt-4">
                        <Button variant="outline" onClick={() => setDeleteConfirmation({ isOpen: false, productId: null })}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminProducts;
