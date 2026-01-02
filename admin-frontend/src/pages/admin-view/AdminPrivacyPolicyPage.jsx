import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fetchFAQSWebstis, fetchPrivacyPolicyWebsite, setPrivacyPolicyWebsite } from "@/store/common-slice";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/hooks/use-toast";
import { Save, Shield, Database, Cookie, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const AdminPrivacyPolicyPage = () => {
    const dispatch = useDispatch();
    const { toast } = useToast();
    const { privacyPolicy } = useSelector(state => state.common);
    const [formData, setFormData] = useState({
        effectiveDate: "",
        introduction: "",
        informationCollect: "",
        usageInfo: "",
        dataSecurity: "",
        sharingInfo: "",
        rights: "",
        cookiesInfo: "",
        thirdPartyLinks: "",
        changesPolicy: "",
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
        await dispatch(setPrivacyPolicyWebsite(formData))
        toast({
            title: "Your privacy policy has been updated",
            variant: "default",
        });
        // You can add API calls here to save the data
        console.log("Form Data Submitted:", formData);
    };

    useEffect(() => {
        // Simulate fetching data (for editing purposes)
        dispatch(fetchPrivacyPolicyWebsite());
    }, []);
    useEffect(() => {
        // Check if privacy policy has been updated and display a notification if so
        if (privacyPolicy) {
            // toast({
            //     title: "Your privacy policy has been updated",
            //     variant: "default", // or info
            // });
            setFormData(privacyPolicy);
        }
    }, [dispatch, privacyPolicy])
    console.log("Fetched Dat: ", privacyPolicy);
    return (
        <div className="w-full space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Privacy Policy Management</h1>
                    <p className="text-gray-600 mt-1">Manage your website's privacy policy content</p>
                </div>
                <Button onClick={handleSubmit} className="btn-primary">
                    <Save className="w-4 h-4 mr-2" />
                    Save Privacy Policy
                </Button>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-auto md:grid-cols-4 lg:w-[800px]">
                    <TabsTrigger value="general" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        General
                    </TabsTrigger>
                    <TabsTrigger value="data" className="flex items-center gap-2">
                        <Database className="w-4 h-4" />
                        Data Handling
                    </TabsTrigger>
                    <TabsTrigger value="rights" className="flex items-center gap-2">
                        <Cookie className="w-4 h-4" />
                        Rights & Cookies
                    </TabsTrigger>
                    <TabsTrigger value="legal" className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Legal & Contact
                    </TabsTrigger>
                </TabsList>

                {/* General Tab */}
                <TabsContent value="general" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>General Information</CardTitle>
                            <CardDescription>Basic details about the policy</CardDescription>
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
                                <Label htmlFor="introduction">Introduction</Label>
                                <Textarea
                                    id="introduction"
                                    name="introduction"
                                    value={formData.introduction}
                                    onChange={handleChange}
                                    rows={6}
                                    required
                                    placeholder="Introduction to your privacy policy..."
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Data Handling Tab */}
                <TabsContent value="data" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Data Collection & Usage</CardTitle>
                            <CardDescription>How you collect, use, and protect user data</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="informationCollect">Information We Collect</Label>
                                <Textarea
                                    id="informationCollect"
                                    name="informationCollect"
                                    value={formData.informationCollect}
                                    onChange={handleChange}
                                    rows={4}
                                    required
                                    placeholder="Details about data collection..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="usageInfo">How We Use Your Information</Label>
                                <Textarea
                                    id="usageInfo"
                                    name="usageInfo"
                                    value={formData.usageInfo}
                                    onChange={handleChange}
                                    rows={4}
                                    required
                                    placeholder="Details about data usage..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dataSecurity">Data Security</Label>
                                <Textarea
                                    id="dataSecurity"
                                    name="dataSecurity"
                                    value={formData.dataSecurity}
                                    onChange={handleChange}
                                    rows={4}
                                    required
                                    placeholder="Security measures..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="sharingInfo">Sharing Your Information</Label>
                                <Textarea
                                    id="sharingInfo"
                                    name="sharingInfo"
                                    value={formData.sharingInfo}
                                    onChange={handleChange}
                                    rows={4}
                                    required
                                    placeholder="Information sharing policies..."
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Rights & Cookies Tab */}
                <TabsContent value="rights" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>User Rights & Tracking</CardTitle>
                            <CardDescription>User rights and cookie policies</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="rights">Your Rights</Label>
                                <Textarea
                                    id="rights"
                                    name="rights"
                                    value={formData.rights}
                                    onChange={handleChange}
                                    rows={4}
                                    required
                                    placeholder="User rights description..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cookiesInfo">Cookies and Tracking Technologies</Label>
                                <Textarea
                                    id="cookiesInfo"
                                    name="cookiesInfo"
                                    value={formData.cookiesInfo}
                                    onChange={handleChange}
                                    rows={4}
                                    required
                                    placeholder="Cookie policy..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="thirdPartyLinks">Third-Party Links</Label>
                                <Textarea
                                    id="thirdPartyLinks"
                                    name="thirdPartyLinks"
                                    value={formData.thirdPartyLinks}
                                    onChange={handleChange}
                                    rows={4}
                                    required
                                    placeholder="Policy on third-party links..."
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Legal & Contact Tab */}
                <TabsContent value="legal" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Legal & Contact Information</CardTitle>
                            <CardDescription>Policy updates and contact details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="changesPolicy">Changes to This Privacy Policy</Label>
                                <Textarea
                                    id="changesPolicy"
                                    name="changesPolicy"
                                    value={formData.changesPolicy}
                                    onChange={handleChange}
                                    rows={4}
                                    required
                                    placeholder="Policy update procedures..."
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
                                        placeholder="privacy@example.com"
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

export default AdminPrivacyPolicyPage;
