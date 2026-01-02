import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAddressForm } from '../../action/common.action';
import { capitalizeFirstLetterOfEachWord, removeSpaces } from '../../config';
import { useSettingsContext } from '../../Contaxt/SettingsContext';
import axios from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';

const AddAddressPopup = ({ isOpen, onClose, onSave, addressToEdit }) => {
    const [newAddress, setNewAddress] = useState({
        name: '',
        phoneNumber: '',
        pincode: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        country: '',
        addressType: 'home'
    });
    const { formData } = useSelector(state => state.fetchFormBanners);
    const dispatch = useDispatch();
    const [error, setError] = useState(null);
    const { checkAndCreateToast } = useSettingsContext();

    useEffect(() => {
        if (addressToEdit) {
            setNewAddress({
                name: addressToEdit.name || '',
                phoneNumber: addressToEdit.phoneNumber || '',
                pincode: addressToEdit.pincode || '',
                address1: addressToEdit.address1 || '',
                address2: addressToEdit.address2 || '',
                city: addressToEdit.city || '',
                state: addressToEdit.state || '',
                country: addressToEdit.country || '',
                addressType: addressToEdit.addressType || 'home'
            });
        } else {
            setNewAddress({
                name: '',
                phoneNumber: '',
                pincode: '',
                address1: '',
                address2: '',
                city: '',
                state: '',
                country: '',
                addressType: 'home'
            });
        }
    }, [addressToEdit, isOpen]);

    // Handle changes in form fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewAddress((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Automatically fetch state and country based on pincode
        if (name === 'pincode' && value.length === 6) {
            fetchStateAndCountry(value);
        }
    };

    const handleAddressTypeChange = (value) => {
        setNewAddress(prev => ({ ...prev, addressType: value }));
    };

    // Fetch state and country based on pincode
    const fetchStateAndCountry = async (pincode) => {
        try {
            const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
            const responseData = response.data.length > 0 ? response.data[0] : null;
            if (!responseData) throw new Error("Invalid Pincode");
            if (responseData?.PostOffice.length === 0) throw new Error("Invalid Pincode");
            const data = responseData?.PostOffice[0];

            if (data && data.State && data.Country && data.District) {
                setNewAddress(prev => ({
                    ...prev,
                    state: data.State,
                    city: data.District,
                    country: data.Country
                }));
                setError(null);
            } else {
                checkAndCreateToast('error', 'Invalid Pincode');
                setError({ errorTag: 'pincode', error: 'Invalid Pincode' });
            }
        } catch (error) {
            console.error("Error fetching state and country:", error);
            checkAndCreateToast('error', 'Failed to fetch state and country');
        }
    };

    const handleSave = () => {
        // Basic validation
        if (!newAddress.name || !newAddress.phoneNumber || !newAddress.pincode || !newAddress.address1 || !newAddress.city || !newAddress.state) {
            checkAndCreateToast('error', 'Please fill out all required fields.');
            return;
        }

        if (newAddress.address1.length > 100) { // Increased limit for address
            checkAndCreateToast('error', 'Address Line 1 is too long!');
            return;
        }

        const digitsOnly = newAddress.phoneNumber.replace(/\D/g, '');
        if (digitsOnly.length !== 10) {
            checkAndCreateToast('error', 'Phone number should be 10 digits!');
            return;
        }

        const pincodeDigitsOnly = newAddress.pincode.replace(/\D/g, '');
        if (pincodeDigitsOnly.length !== 6) {
            checkAndCreateToast('error', 'Pincode should be 6 digits!');
            return;
        }

        onSave(newAddress);
        // Reset handled by useEffect when isOpen changes or explicitly here if needed
        onClose();
        setError(null);
    };

    useEffect(() => {
        dispatch(fetchAddressForm());
    }, [dispatch]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[600px] bg-card text-card-foreground border-border">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-foreground">{addressToEdit ? "Edit Address" : "Add New Address"}</DialogTitle>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Personal Information Section */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium text-foreground">Full Name *</Label>
                            <Input
                                id="name"
                                name="name"
                                value={newAddress.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className="bg-background border-input"
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="phoneNumber" className="text-sm font-medium text-foreground">Phone Number *</Label>
                                <Input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={newAddress.phoneNumber}
                                    onChange={handleChange}
                                    placeholder="1234567890"
                                    type="number"
                                    className="bg-background border-input"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-foreground block mb-3">Address Type</Label>
                                <RadioGroup
                                    value={newAddress.addressType}
                                    onValueChange={handleAddressTypeChange}
                                    className="flex gap-6"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="home" id="home" className="border-primary text-primary" />
                                        <Label htmlFor="home" className="text-sm font-normal text-foreground">Home</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="office" id="office" className="border-primary text-primary" />
                                        <Label htmlFor="office" className="text-sm font-normal text-foreground">Office</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>
                    </div>

                    {/* Address Information Section */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="address1" className="text-sm font-medium text-foreground">Address Line 1 *</Label>
                            <Input
                                id="address1"
                                name="address1"
                                value={newAddress.address1}
                                onChange={handleChange}
                                placeholder="House/Flat No., Building Name"
                                className="bg-background border-input"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address2" className="text-sm font-medium text-foreground">Address Line 2</Label>
                            <Input
                                id="address2"
                                name="address2"
                                value={newAddress.address2}
                                onChange={handleChange}
                                placeholder="Street, Area, Landmark"
                                className="bg-background border-input"
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="pincode" className="text-sm font-medium text-foreground">Postal Code *</Label>
                                <Input
                                    id="pincode"
                                    name="pincode"
                                    value={newAddress.pincode}
                                    onChange={handleChange}
                                    placeholder="400001"
                                    type="number"
                                    maxLength={6}
                                    className="bg-background border-input"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="city" className="text-sm font-medium text-foreground">City *</Label>
                                <Input
                                    id="city"
                                    name="city"
                                    value={newAddress.city}
                                    onChange={handleChange}
                                    placeholder="Mumbai"
                                    className="bg-background border-input"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="state" className="text-sm font-medium text-foreground">State *</Label>
                                <Input
                                    id="state"
                                    name="state"
                                    value={newAddress.state}
                                    onChange={handleChange}
                                    placeholder="Maharashtra"
                                    className="bg-background border-input"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex gap-3 sm:justify-end">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex-1 sm:flex-none border-input hover:bg-accent hover:text-accent-foreground"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        className="flex-1 sm:flex-none bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        Save Address
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddAddressPopup;
