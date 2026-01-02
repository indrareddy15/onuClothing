import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fetchTermsAndCondition, setTermsAndCondition } from "@/store/common-slice";
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { Save, FileText, ShoppingBag, Scale, Phone } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const AdminTermsConditionsPage = () => {
    const dispatch = useDispatch();
    const { toast } = useToast();
    const { termsAndCondition } = useSelector(state => state.common);
    const [formData, setFormData] = useState({
        effectiveDate: "",
        acceptanceOfTerms: "",
        useOfWebsite: "",
        productsAndPricing: "",
        ordersAndPayments: "",
        shippingAndDelivery: "",
        returnsAndRefunds: "",
        privacyAndDataProtection: "",
        intellectualProperty: "",
        indemnification: "",
        governingLawAndDispute: "",
        modificationsToTerms: "",
        contactInfo: "",
        phoneNumber: "",
        businessAddress: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await dispatch(setTermsAndCondition(formData));
        dispatch(fetchTermsAndCondition());
        console.log("Form Data Submitted:", formData);
        toast({
            title: "Success",
            description: "Your terms and conditions have been updated",
            className: "bg-green-50 border-green-200 text-green-900"
        });
    };

    useEffect(() => {
        dispatch(fetchTermsAndCondition());
    }, []);
    useEffect(() => {
        if (termsAndCondition) {
            setFormData(termsAndCondition)
        }
    }, [dispatch, termsAndCondition])
    console.log("Fetched Dat: ", formData);

    return (
        <div className="w-full space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Terms & Conditions Management</h1>
                    <p className="text-gray-600 mt-1">Manage your website's terms of service</p>
                </div>
                <Button onClick={handleSubmit} className="btn-primary">
                    <Save className="w-4 h-4 mr-2" />
                    Save Terms & Conditions
                </Button>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-auto md:grid-cols-4 lg:w-[800px]">
                    <TabsTrigger value="general" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        General
                    </TabsTrigger>
                    <TabsTrigger value="orders" className="flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4" />
                        Orders & Products
                    </TabsTrigger>
                    <TabsTrigger value="legal" className="flex items-center gap-2">
                        <Scale className="w-4 h-4" />
                        Legal
                    </TabsTrigger>
                    <TabsTrigger value="contact" className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Contact
                    </TabsTrigger>
                </TabsList>

                {/* General Tab */}
                <TabsContent value="general" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>General Terms</CardTitle>
                            <CardDescription>Basic terms and usage policies</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="effectiveDate">Effective Date</Label>
                                <Input
                                    type="date"
                                    id="effectiveDate"
                                    name="effectiveDate"
                                    value={formData.effectiveDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="acceptanceOfTerms">Acceptance of Terms</Label>
                                <Textarea
                                    id="acceptanceOfTerms"
                                    name="acceptanceOfTerms"
                                    value={formData.acceptanceOfTerms}
                                    onChange={handleChange}
                                    rows={4}
                                    required
                                    placeholder="Terms acceptance clause..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="useOfWebsite">Use of Website</Label>
                                <Textarea
                                    id="useOfWebsite"
                                    name="useOfWebsite"
                                    value={formData.useOfWebsite}
                                    onChange={handleChange}
                                    rows={4}
                                    required
                                    placeholder="Website usage rules..."
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Orders & Products Tab */}
                <TabsContent value="orders" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Commerce Policies</CardTitle>
                            <CardDescription>Terms related to products, orders, and shipping</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="productsAndPricing">Products and Pricing</Label>
                                <Textarea
                                    id="productsAndPricing"
                                    name="productsAndPricing"
                                    value={formData.productsAndPricing}
                                    onChange={handleChange}
                                    rows={4}
                                    required
                                    placeholder="Product and pricing terms..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ordersAndPayments">Orders and Payments</Label>
                                <Textarea
                                    id="ordersAndPayments"
                                    name="ordersAndPayments"
                                    value={formData.ordersAndPayments}
                                    onChange={handleChange}
                                    rows={4}
                                    required
                                    placeholder="Order and payment terms..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="shippingAndDelivery">Shipping and Delivery</Label>
                                <Textarea
                                    id="shippingAndDelivery"
                                    name="shippingAndDelivery"
                                    value={formData.shippingAndDelivery}
                                    onChange={handleChange}
                                    rows={4}
                                    required
                                    placeholder="Shipping policy..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="returnsAndRefunds">Returns and Refunds</Label>
                                <Textarea
                                    id="returnsAndRefunds"
                                    name="returnsAndRefunds"
                                    value={formData.returnsAndRefunds}
                                    onChange={handleChange}
                                    rows={4}
                                    required
                                    placeholder="Return policy..."
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Legal Tab */}
                <TabsContent value="legal" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Legal Clauses</CardTitle>
                            <CardDescription>Intellectual property and liability terms</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="privacyAndDataProtection">Privacy and Data Protection</Label>
                                <Textarea
                                    id="privacyAndDataProtection"
                                    name="privacyAndDataProtection"
                                    value={formData.privacyAndDataProtection}
                                    onChange={handleChange}
                                    rows={4}
                                    required
                                    placeholder="Data protection clause..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="intellectualProperty">Intellectual Property</Label>
                                <Textarea
                                    id="intellectualProperty"
                                    name="intellectualProperty"
                                    value={formData.intellectualProperty}
                                    onChange={handleChange}
                                    rows={4}
                                    required
                                    placeholder="IP rights..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="indemnification">Indemnification</Label>
                                <Textarea
                                    id="indemnification"
                                    name="indemnification"
                                    value={formData.indemnification}
                                    onChange={handleChange}
                                    rows={4}
                                    required
                                    placeholder="Indemnification clause..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="governingLawAndDispute">Governing Law and Dispute Resolution</Label>
                                <Textarea
                                    id="governingLawAndDispute"
                                    name="governingLawAndDispute"
                                    value={formData.governingLawAndDispute}
                                    onChange={handleChange}
                                    rows={4}
                                    required
                                    placeholder="Legal jurisdiction..."
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Contact Tab */}
                <TabsContent value="contact" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Updates & Contact</CardTitle>
                            <CardDescription>Policy modifications and contact information</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="modificationsToTerms">Modifications to Terms</Label>
                                <Textarea
                                    id="modificationsToTerms"
                                    name="modificationsToTerms"
                                    value={formData.modificationsToTerms}
                                    onChange={handleChange}
                                    rows={4}
                                    required
                                    placeholder="Terms modification policy..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="contactInfo">Contact Email</Label>
                                    <Input
                                        id="contactInfo"
                                        name="contactInfo"
                                        type="email"
                                        value={formData.contactInfo}
                                        onChange={handleChange}
                                        required
                                        placeholder="support@example.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phoneNumber">Phone Number</Label>
                                    <Input
                                        type="text"
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        required
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="businessAddress">Business Address</Label>
                                <Input
                                    type="text"
                                    id="businessAddress"
                                    name="businessAddress"
                                    value={formData.businessAddress}
                                    onChange={handleChange}
                                    required
                                    placeholder="Full business address"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AdminTermsConditionsPage;
