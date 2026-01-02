import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getContactUsPageData, sendContactUsPage } from '@/store/common-slice';
import { useToast } from "@/hooks/use-toast";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Save, Plus, X, MapPin, Phone, Mail, Layout, Type, Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminContactPage = () => {
    const dispatch = useDispatch();
    const { toast } = useToast();
    const { ContactUsPageData } = useSelector(state => state.common);

    // State variables for Contact Us form
    const [header, setHeader] = useState('');
    const [subHeader, setSubHeader] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [mapLink, setMapLink] = useState('');
    const [formDataForContactUs, setFormData] = useState([]);
    const [newField, setNewField] = useState('');

    // Handle adding a new Team Member
    const handelAddNewField = () => {
        if (newField) {
            const currentFormData = Array.isArray(formDataForContactUs) ? formDataForContactUs : [];
            const updatedFormData = [...currentFormData, { fieldName: newField }];
            setFormData(updatedFormData);
            setNewField(''); // Clear the input after adding
        }
    };

    // Handle removing a Team Member
    const handelRemoveField = (fieldName) => {
        if (Array.isArray(formDataForContactUs)) {
            setFormData(formDataForContactUs.filter(e => e.fieldName !== fieldName));
        }
    };

    // Handle saving the form data
    const handleSave = async () => {
        await dispatch(sendContactUsPage({
            header,
            subHeader,
            email,
            phoneNumber,
            address,
            mapLink,
            formDataForContactUs,
        }));
        toast({
            title: "Success",
            description: "Contact Us page details Updated successfully!",
            className: "bg-green-50 border-green-200 text-green-900"
        });
    };

    // Function to send the data to the backend
    useEffect(() => {
        dispatch(getContactUsPageData());
    }, [dispatch]);

    useEffect(() => {
        if (ContactUsPageData) {
            setHeader(ContactUsPageData.header || '');
            setSubHeader(ContactUsPageData.subHeader || '');
            setFormData(ContactUsPageData.formDataForContactUs || []);
            setAddress(ContactUsPageData.address || '');
            setMapLink(ContactUsPageData.mapLink || '');
            setPhoneNumber(ContactUsPageData.phoneNumber || '');
            setEmail(ContactUsPageData.email || '');
        }
    }, [dispatch, ContactUsPageData]);

    return (
        <div className="w-full space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Contact Page Settings</h1>
                    <p className="text-gray-600 mt-1">Manage the content and settings for your Contact Us page</p>
                </div>
                <Button onClick={handleSave} className="btn-primary">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                </Button>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
                    <TabsTrigger value="general" className="flex items-center gap-2">
                        <Layout className="w-4 h-4" />
                        General
                    </TabsTrigger>
                    <TabsTrigger value="contact" className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Contact Info
                    </TabsTrigger>
                    <TabsTrigger value="form" className="flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Form Config
                    </TabsTrigger>
                </TabsList>

                {/* General Tab */}
                <TabsContent value="general" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Layout className="w-5 h-5" />
                                Page Header
                            </CardTitle>
                            <CardDescription>Customize the main heading and sub-heading of the contact page</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Header Title</Label>
                                <Input
                                    value={header}
                                    onChange={(e) => setHeader(e.target.value)}
                                    placeholder="e.g., Get in Touch"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Sub-Header</Label>
                                <Input
                                    value={subHeader}
                                    onChange={(e) => setSubHeader(e.target.value)}
                                    placeholder="e.g., We'd love to hear from you"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Contact Info Tab */}
                <TabsContent value="contact" className="space-y-6 mt-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Phone className="w-5 h-5" />
                                    Contact Information
                                </CardTitle>
                                <CardDescription>Update your business contact details</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label>Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="contact@example.com"
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Phone Number</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            placeholder="+1 (555) 000-0000"
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5" />
                                    Location
                                </CardTitle>
                                <CardDescription>Set your physical address and map location</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label>Physical Address</Label>
                                    <Textarea
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="Enter your full address"
                                        rows={3}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Google Map Embed Code</Label>
                                    <Textarea
                                        value={mapLink}
                                        onChange={(e) => setMapLink(e.target.value)}
                                        placeholder="<iframe src='...'></iframe>"
                                        rows={3}
                                        className="font-mono text-xs"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Form Config Tab */}
                <TabsContent value="form" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Type className="w-5 h-5" />
                                Custom Form Fields
                            </CardTitle>
                            <CardDescription>Add or remove fields from the contact form</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    value={newField}
                                    onChange={(e) => setNewField(e.target.value)}
                                    placeholder="Enter new field name (e.g., Subject, Order ID)"
                                />
                                <Button onClick={handelAddNewField}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Field
                                </Button>
                            </div>

                            {formDataForContactUs && formDataForContactUs.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                                    {formDataForContactUs.map((fieldName, index) => (
                                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 border rounded-lg">
                                            <span className="font-medium text-sm">{fieldName.fieldName}</span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handelRemoveField(fieldName.fieldName)}
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                                    No custom fields added yet
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AdminContactPage;
