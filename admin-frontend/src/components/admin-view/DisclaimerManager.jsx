import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editDisclaimerData, fetchWebsiteDisclaimer, removeDisclaimerData, setDisclaimerData } from "@/store/common-slice";
import FileUploadComponent from "./FileUploadComponent";
import { useSettingsContext } from "@/Context/SettingsContext";
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Edit, Trash2, Plus, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

const DisclaimerManager = () => {
    const { toast } = useToast();
    const [reset, setIsReset] = useState(false);
    const { DisclaimerData } = useSelector(state => state.common);
    const [editingId, setEditingId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    // States for creating and editing disclaimers
    const [form, setForm] = useState({
        header: "",
        body: "",
        hoverBody: "",
        iconImage: "",
    });

    const [disclaimers, setDisclaimers] = useState([]);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    // Handle form input changes
    const handleChange = useCallback((e) => {
        setForm((prevForm) => ({
            ...prevForm,
            [e.target.name]: e.target.value,
        }));
    }, []);

    // Consolidated success and error handler
    const handleSuccess = (message) => {
        toast({
            title: message,
            variant: "default",
        });
        dispatch(fetchWebsiteDisclaimer());
        setIsReset(true);
        setTimeout(() => setIsReset(false), 400);
    };

    const handleError = (message) => {
        toast({
            title: message,
            variant: "destructive",
        });
    };

    // Create or update disclaimer
    const handleCreateOrUpdate = async () => {
        try {
            const action = editingId ? editDisclaimerData : setDisclaimerData;
            const payload = editingId
                ? { disclaimersId: editingId, disclaimers: form }
                : { websiteDisclaimers: form };

            const success = await dispatch(action(payload));
            if (success) {
                const actionMessage = editingId ? "Disclaimer edited successfully" : "Disclaimer created successfully";
                handleSuccess(actionMessage);
                setEditingId(null);
                setForm({ header: "", body: "", hoverBody: "", iconImage: "" }); // Reset form
            } else {
                handleError(editingId ? "Failed to edit disclaimer" : "Failed to create Disclaimer");
            }
        } catch (error) {
            handleError("Something went wrong.");
        }
    };

    // Delete disclaimer
    const handleDelete = (id) => {
        setDeleteId(id);
        setOpenDeleteDialog(true);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;

        try {
            const success = await dispatch(removeDisclaimerData({ disclaimersId: deleteId }));
            if (success) {
                handleSuccess("Disclaimer deleted successfully");
            } else {
                handleError("Failed to delete disclaimer");
            }
        } catch (error) {
            handleError("Something went wrong.");
        } finally {
            setOpenDeleteDialog(false);
            setDeleteId(null);
        }
    };

    // Edit disclaimer
    const handleEdit = (id) => {
        setEditingId(id);
        const disclaimerToEdit = disclaimers.find((disclaimer) => disclaimer._id === id);
        setForm(disclaimerToEdit);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Fetch disclaimers on initial render or when `DisclaimerData` changes
    useEffect(() => {
        if (DisclaimerData) {
            setDisclaimers(DisclaimerData);
        }
    }, [DisclaimerData]);

    // Fetch disclaimers initially when component mounts
    useEffect(() => {
        dispatch(fetchWebsiteDisclaimer());
    }, [dispatch]);

    useEffect(() => {
        window.scroll(0, 0);
    }, [])

    return (
        <div className="w-full space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Manage Disclaimers</h1>
                    <p className="text-gray-600 mt-1">Add, edit, or remove website disclaimers</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Disclaimer Form */}
                <Card className="lg:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle>{editingId ? "Edit Disclaimer" : "Add New Disclaimer"}</CardTitle>
                        <CardDescription>Fill in the details below</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="header">Header</Label>
                            <Input
                                id="header"
                                name="header"
                                value={form.header}
                                onChange={handleChange}
                                placeholder="e.g., Free Shipping"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="body">Body Text</Label>
                            <Textarea
                                id="body"
                                name="body"
                                value={form.body}
                                onChange={handleChange}
                                placeholder="Main text displayed"
                                className="min-h-[80px]"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="hoverBody">Hover Text (Optional)</Label>
                            <Textarea
                                id="hoverBody"
                                name="hoverBody"
                                value={form.hoverBody}
                                onChange={handleChange}
                                placeholder="Text shown on hover"
                                className="min-h-[80px]"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Icon Image</Label>
                            <div className="border rounded-lg p-4 bg-gray-50">
                                <FileUploadComponent
                                    maxFiles={1}
                                    isLoading={isLoading}
                                    setIsLoading={setIsLoading}
                                    onSetImageUrls={(file) => setForm({ ...form, iconImage: file[0].url })}
                                    tag={"iconImageUpload"}
                                    sizeTag={"newIcons"}
                                    onReset={reset}
                                />
                            </div>
                            {form.iconImage && (
                                <div className="mt-2">
                                    <p className="text-xs text-gray-500 mb-1">Current Icon:</p>
                                    <img src={form.iconImage} alt="Current Icon" className="w-10 h-10 object-contain" />
                                </div>
                            )}
                        </div>

                        <div className="pt-4 flex gap-2">
                            <Button onClick={handleCreateOrUpdate} className="w-full" disabled={isLoading}>
                                {editingId ? (
                                    <>
                                        <Save className="w-4 h-4 mr-2" /> Update
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4 mr-2" /> Add Disclaimer
                                    </>
                                )}
                            </Button>
                            {editingId && (
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setEditingId(null);
                                        setForm({ header: "", body: "", hoverBody: "", iconImage: "" });
                                    }}
                                >
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Disclaimer List */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Existing Disclaimers</CardTitle>
                        <CardDescription>List of all active disclaimers on the website</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {disclaimers?.length > 0 ? (
                                disclaimers.map((disclaimer) => (
                                    <div
                                        key={disclaimer._id}
                                        className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="shrink-0 bg-white p-2 rounded border">
                                                <LazyLoadImage
                                                    effect="blur"
                                                    useIntersectionObserver
                                                    loading="lazy"
                                                    src={disclaimer.iconImage}
                                                    alt="icon"
                                                    className="w-8 h-8 object-contain"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{disclaimer.header}</h3>
                                                <p className="text-sm text-gray-600 mt-1">{disclaimer.body}</p>
                                                {disclaimer.hoverBody && (
                                                    <p className="text-xs text-gray-500 mt-1 italic">Hover: {disclaimer.hoverBody}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 ml-4">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEdit(disclaimer._id)}
                                                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(disclaimer._id)}
                                                className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    <p>No disclaimers available. Create one to get started.</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete the disclaimer.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpenDeleteDialog(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default DisclaimerManager;
