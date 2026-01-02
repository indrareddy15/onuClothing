import React from 'react';
import { DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { ShoppingBag, Heart, ShoppingCart, User, MapPin, Calendar, Mail, Phone } from 'lucide-react';

const CustomerDetailsSingle = ({ user }) => {
    const getItemsAmount = (item) => {
        const totalPrice = item?.productId?.salePrice || item?.productId?.price;
        const sellingPrice = totalPrice * item?.productId?.quantity;
        return sellingPrice;
    };

    const renderCart = (data) => {
        if (!data || data.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                    <ShoppingCart className="w-12 h-12 mb-2 text-gray-300" />
                    <p>No items in cart</p>
                </div>
            );
        }
        return (
            <div className={`border rounded-md ${data.length >= 3 ? 'max-h-[300px] overflow-auto' : ''}`}>
                <table className="w-full caption-bottom text-sm">
                    <TableHeader className="sticky top-0 bg-white z-10">
                        <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead className="text-center">Qty</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <div className="font-medium">{item?.productId?.shortTitle || 'Unknown Product'}</div>
                                    <div className="text-xs text-gray-500">{item?._id}</div>
                                </TableCell>
                                <TableCell className="text-right">
                                    ₹{item?.productId?.salePrice || item?.productId?.price}
                                </TableCell>
                                <TableCell className="text-center">{item?.quantity}</TableCell>
                                <TableCell className="text-right font-medium">
                                    ₹{getItemsAmount(item)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </table>
            </div>
        );
    };

    const renderOrders = (data) => {
        if (!data || data.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                    <ShoppingBag className="w-12 h-12 mb-2 text-gray-300" />
                    <p>No orders found</p>
                </div>
            );
        }
        return (
            <div className={`border rounded-md ${data.length >= 3 ? 'max-h-[300px] overflow-auto' : ''}`}>
                <table className="w-full caption-bottom text-sm">
                    <TableHeader className="sticky top-0 bg-white z-10">
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead className="text-center">Items</TableHead>
                            <TableHead className="text-center">Payment</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{item?._id}</TableCell>
                                <TableCell className="text-center">{item.orderItems?.length}</TableCell>
                                <TableCell className="text-center">
                                    <Badge variant="outline" className="capitalize">
                                        {item.paymentMode}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                    ₹{item.TotalAmount}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </table>
            </div>
        );
    };

    const renderWishList = (data) => {
        if (!data || data.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                    <Heart className="w-12 h-12 mb-2 text-gray-300" />
                    <p>No items in wishlist</p>
                </div>
            );
        }
        return (
            <div className={`border rounded-md ${data.length >= 3 ? 'max-h-[300px] overflow-auto' : ''}`}>
                <table className="w-full caption-bottom text-sm">
                    <TableHeader className="sticky top-0 bg-white z-10">
                        <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <div className="font-medium">{item?.productId?.title}</div>
                                    <div className="text-xs text-gray-500">{item?.productId?._id}</div>
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                    ₹{item?.productId?.price}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </table>
            </div>
        );
    };

    return (
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Customer Profile
                </DialogTitle>
            </DialogHeader>

            <div className="grid gap-6">
                {/* User Info Cards */}
                <div className="grid md:grid-cols-3 gap-4">
                    <Card className="md:col-span-2">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-start gap-4">
                                <Avatar className="w-16 h-16">
                                    <AvatarImage src={user?.profilePic} alt={user?.name} />
                                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="grid gap-1">
                                    <h3 className="font-bold text-lg">{user?.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Mail className="w-4 h-4" /> {user?.email}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Phone className="w-4 h-4" /> {user?.phoneNumber || 'N/A'}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Calendar className="w-4 h-4" /> Joined: {new Date(user?.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Account Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Role</span>
                                <Badge>{user?.role}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Total Purchases</span>
                                <span className="font-bold">{user?.totalPurchases}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Saved Addresses</span>
                                <span className="font-bold">{user?.address?.length || 0}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs Section */}
                <Tabs defaultValue="cart" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="cart">Cart ({user?.cart?.length || 0})</TabsTrigger>
                        <TabsTrigger value="orders">Recent Orders</TabsTrigger>
                        <TabsTrigger value="wishlist">Wishlist ({user?.wishList?.length || 0})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="cart" className="mt-4">
                        {renderCart(user?.cart)}
                    </TabsContent>

                    <TabsContent value="orders" className="mt-4">
                        {renderOrders(user?.orders)}
                    </TabsContent>

                    <TabsContent value="wishlist" className="mt-4">
                        {renderWishList(user?.wishList)}
                    </TabsContent>
                </Tabs>
            </div>
        </DialogContent>
    );
};

export default CustomerDetailsSingle;
