import React, { useEffect, useState } from 'react';
import { BsShieldFillCheck } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updatedetailsuser } from "../../action/useraction";
import { useSettingsContext } from '../../Contaxt/SettingsContext';
import { useServerAuth } from '../../Contaxt/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Separator } from '../../components/ui/separator';
import { Badge } from '../../components/ui/badge';

const Address = () => {
    const [edit, setEdit] = useState(false);
    const { userLoading, user, isAuthentication, checkAuthUser } = useServerAuth();
    const { bag, bagloading } = useSelector(state => state.bag_data);
    const { success } = useSelector(state => state.updateuser2);
    const { checkAndCreateToast } = useSettingsContext();
    const navigation = useNavigate();
    const dispatch = useDispatch();

    const [addressDetails, setAddressDetails] = useState({
        name: '',
        phonenumber: '',
        pincode: '',
        address1: '',
        address2: '',
        citystate: ''
    });

    const [priceDetails, setPriceDetails] = useState({
        mrp: 0,
        sp: 0,
        ds: 0
    });

    useEffect(() => {
        if (!isAuthentication) {
            checkAndCreateToast('info', 'Log in to access BAG');
            navigation('/Login');
        } else {
            setAddressDetails({
                name: user?.name,
                phonenumber: user?.phoneNumber,
                pincode: user?.address?.pincode,
                address1: user?.address?.address1,
                address2: user?.address?.address2,
                citystate: user?.address?.state
            });
        }
    }, [dispatch, user, isAuthentication, checkAndCreateToast, navigation]);

    useEffect(() => {
        if (bagloading === false && bag?.orderItems) {
            let mrp = 0, sp = 0, ds = 0;
            bag?.orderItems?.forEach(item => {
                mrp += item.product.mrp * item.qty;
                sp += item.product.sellingPrice * item.qty;
            });
            ds = mrp - sp;
            setPriceDetails({ mrp, sp, ds });
        }
    }, [bagloading, bag]);

    const saveAddress = () => {
        dispatch(updatedetailsuser(addressDetails, user?.id));
        checkAndCreateToast('success', success);
        setEdit(false);
        checkAuthUser();
    };

    if (userLoading || bagloading) return null;

    return (
        <div className="relative min-h-screen bg-background text-foreground font-sans">
            <div className="border-b border-border py-5">
                <div className="mx-auto text-muted-foreground w-max flex items-center gap-2 text-sm tracking-[3px] font-semibold">
                    <span>BAG</span>
                    <span className="text-muted-foreground/50">----------</span>
                    <span className="text-primary underline">ADDRESS</span>
                    <span className="text-muted-foreground/50">----------</span>
                    <span>PAYMENT</span>
                </div>
                <div className="absolute flex right-4 top-4 lg:right-10 lg:top-5 items-center gap-2">
                    <BsShieldFillCheck className="text-primary text-2xl" />
                    <span className="text-muted-foreground text-[10px] font-semibold tracking-[2px]">100% SECURE</span>
                </div>
            </div>

            <div className="mx-auto mt-8 w-full max-w-7xl px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex justify-between items-center">
                        <h1 className="font-bold text-lg text-foreground">Select Delivery Address</h1>
                        <Button variant="outline" size="sm" onClick={() => setEdit(true)}>ADD NEW ADDRESS</Button>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xs font-bold text-muted-foreground">DEFAULT ADDRESS</h2>
                        <Card className="border-primary/50 shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <input type="radio" className="accent-primary h-4 w-4" checked readOnly />
                                    <span className="font-semibold text-foreground capitalize">{user?.name}</span>
                                    <Badge variant="secondary" className="text-[10px] px-2 py-0.5">HOME</Badge>
                                </div>
                                <div className="ml-7 space-y-1 text-sm text-muted-foreground">
                                    <p className="capitalize">{user?.address?.address1}, {user?.address?.address2}</p>
                                    <p className="capitalize">{user?.address?.citystate}, {user?.address?.pincode}</p>
                                    <p className="mt-2">Mobile: <span className="text-foreground font-medium">{user?.phonenumber}</span></p>
                                    <ul className="list-disc list-inside mt-2 text-xs">
                                        <li>Pay on delivery Available</li>
                                    </ul>
                                </div>
                                <div className="ml-7 mt-4 flex gap-3">
                                    <Button variant="outline" size="sm" onClick={() => setEdit(true)} className="uppercase text-xs font-bold">Edit</Button>
                                    <Button size="sm" className="uppercase text-xs font-bold hidden">Remove</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <div className="border-l border-border pl-0 lg:pl-6 space-y-6">
                        <div>
                            <h2 className="text-xs font-bold text-muted-foreground mb-4">DELIVERY ESTIMATES</h2>
                            <div className="space-y-4">
                                {bag?.orderItems?.map(item => (
                                    <div className="flex gap-4 items-center" key={item.product.id}>
                                        <div className="w-12 h-16 shrink-0 overflow-hidden rounded-md border border-border">
                                            <img src={item.product.images[0].url} alt={item.product.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="text-xs">
                                            <p className="text-muted-foreground">Estimated delivery by <span className="font-bold text-foreground">Tomorrow</span></p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <h2 className="text-xs font-bold text-muted-foreground mb-4">PRICE DETAILS ({bag?.orderItems?.length} items)</h2>
                            <div className="space-y-3 text-sm text-muted-foreground">
                                <div className="flex justify-between">
                                    <span>Total MRP</span>
                                    <span>&#8377;{priceDetails.mrp}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Discount on MRP</span>
                                    <span className="text-primary">-&#8377;{Math.round(priceDetails.ds)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Convenience Fee</span>
                                    <span><span className="line-through mr-2">&#8377;99</span><span className="text-primary">FREE</span></span>
                                </div>
                            </div>
                            <Separator className="my-4" />
                            <div className="flex justify-between font-bold text-lg text-foreground mb-4">
                                <span>Total Amount</span>
                                <span>&#8377;{Math.round(priceDetails.sp)}</span>
                            </div>
                            <Button className="w-full font-bold py-6" size="lg">CONTINUE</Button>
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={edit} onOpenChange={setEdit}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>EDIT ADDRESS</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={addressDetails.name}
                                onChange={(e) => setAddressDetails({ ...addressDetails, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phonenumber">Phone Number</Label>
                            <Input
                                id="phonenumber"
                                value={addressDetails.phonenumber}
                                onChange={(e) => setAddressDetails({ ...addressDetails, phonenumber: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="pincode">Pincode</Label>
                                <Input
                                    id="pincode"
                                    value={addressDetails.pincode}
                                    onChange={(e) => setAddressDetails({ ...addressDetails, pincode: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="citystate">City/State</Label>
                                <Input
                                    id="citystate"
                                    value={addressDetails.citystate}
                                    onChange={(e) => setAddressDetails({ ...addressDetails, citystate: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address1">Address Line 1</Label>
                            <Input
                                id="address1"
                                value={addressDetails.address1}
                                onChange={(e) => setAddressDetails({ ...addressDetails, address1: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address2">Address Line 2</Label>
                            <Input
                                id="address2"
                                value={addressDetails.address2}
                                onChange={(e) => setAddressDetails({ ...addressDetails, address2: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={saveAddress} className="w-full">SAVE ADDRESS</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Address;
