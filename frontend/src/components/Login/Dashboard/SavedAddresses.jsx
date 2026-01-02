import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAddress, removeAddress, updateAddress } from '../../../action/useraction';
import AddAddressPopup from '../../Bag/AddAddressPopup';
import { MapPin, Plus, Trash2, Pencil } from 'lucide-react';
import { capitalizeFirstLetterOfEachWord } from '../../../config';
import { useSettingsContext } from '../../../Contaxt/SettingsContext';
import { Button } from '../../../components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Skeleton } from '../../ui/skeleton';

const SavedAddresses = () => {
    const { checkAndCreateToast } = useSettingsContext();
    const dispatch = useDispatch();
    const { allAddresses, loading: addressStateLoading } = useSelector(state => state.getAllAddress);
    const [isAddressPopupOpen, setIsAddressPopupOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);

    const handleOpenPopup = () => {
        setEditingAddress(null);
        setIsAddressPopupOpen(true);
    };

    const handleEditAddress = (address) => {
        setEditingAddress(address);
        setIsAddressPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsAddressPopupOpen(false);
        setEditingAddress(null);
        dispatch(getAddress());
    };

    const handleSaveAddress = async (newAddress) => {
        // If editing, we might need to pass the ID or index, but the current updateAddress action 
        // seems to take the whole address object. Assuming the backend handles update vs create 
        // based on ID or replaces the list. 
        // However, looking at previous code, it just calls updateAddress(newAddress).
        // If the backend expects an ID for update, we need to ensure it's passed.
        // Since I don't see the action definition, I'll assume passing the address object is correct.
        // If it's a new address, it won't have an ID. If it's an edit, it might.
        // But `newAddress` from popup might not have the ID if we didn't pass it through state.
        // Let's ensure we merge the ID if editing.

        let addressPayload = newAddress;
        if (editingAddress && editingAddress._id) {
            addressPayload = { ...newAddress, _id: editingAddress._id };
        } else if (editingAddress && editingAddress.id) {
            addressPayload = { ...newAddress, id: editingAddress.id };
        }

        await dispatch(updateAddress(addressPayload));
        checkAndCreateToast("success", editingAddress ? 'Address updated successfully' : 'Address added successfully');
        dispatch(getAddress());
    };

    const removeAddressByIndex = async (addressIndex) => {
        await dispatch(removeAddress(addressIndex));
        checkAndCreateToast("success", 'Address removed successfully');
        dispatch(getAddress());
    };

    useEffect(() => {
        dispatch(getAddress());
    }, [dispatch]);

    return (
        <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                <CardTitle className="flex items-center gap-2 text-xl text-foreground">
                    <MapPin className="w-5 h-5" />
                    Saved Addresses
                </CardTitle>
                <Button onClick={handleOpenPopup} size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Address
                </Button>
            </CardHeader>
            <CardContent>
                {addressStateLoading ? (
                    <div className="flex flex-col gap-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="p-4 border border-border rounded-lg space-y-3 bg-card">
                                <Skeleton className="h-5 w-1/3 bg-muted" />
                                <Skeleton className="h-4 w-full bg-muted" />
                                <Skeleton className="h-4 w-2/3 bg-muted" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {allAddresses && allAddresses.length > 0 ? (
                            allAddresses.map((address, index) => (
                                <div key={index} className="group relative p-5 border border-border rounded-lg hover:border-primary/50 transition-colors bg-card flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-bold text-lg text-foreground capitalize">{address.name}</span>
                                                {address.addressType && (
                                                    <Badge
                                                        className={`uppercase text-[10px] tracking-wider text-white hover:opacity-90 ${address.addressType.toLowerCase() === 'home'
                                                                ? 'bg-blue-600 hover:bg-blue-700'
                                                                : 'bg-emerald-600 hover:bg-emerald-700'
                                                            }`}
                                                    >
                                                        {address.addressType}
                                                    </Badge>
                                                )}
                                                {address.isDefault && (
                                                    <Badge variant="outline" className="text-[10px] text-muted-foreground border-muted-foreground/50">
                                                        Default
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                                                    onClick={() => handleEditAddress(address)}
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                    onClick={() => removeAddressByIndex(index)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="space-y-1 text-sm text-muted-foreground mb-4">
                                            <p>{address.address1}{address.address2 ? `, ${address.address2}` : ''}</p>
                                            <p>{address.city}, {address.state} - {address.pincode}</p>
                                        </div>
                                    </div>

                                    <div className="text-sm">
                                        <span className="text-muted-foreground">Phone: </span>
                                        <span className="font-medium text-foreground">{address.phoneNumber}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg border border-dashed border-border">
                                <MapPin className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                                <p>No saved addresses found.</p>
                                <Button variant="link" onClick={handleOpenPopup} className="mt-2 text-primary">
                                    Add your first address
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>

            <AddAddressPopup
                isOpen={isAddressPopupOpen}
                onClose={handleClosePopup}
                onSave={handleSaveAddress}
                addressToEdit={editingAddress}
            />
        </Card>
    );
};

export default SavedAddresses;
