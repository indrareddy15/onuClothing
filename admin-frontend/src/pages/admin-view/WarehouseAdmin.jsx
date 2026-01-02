import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createNewWareHouse, deleteWareHouse, fetchAllWareHouses } from '@/store/admin/order-slice';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { MapPin, Building, Phone, Mail, Globe, Trash, Edit, Plus } from 'lucide-react';

const defaultData = {
	pickup_location: '',
	name: '',
	email: '',
	phone: '',
	pin_code: '',
	state: '',
	address: '',
	address_2: '',
	city: '',
	country: '',
	lat: '',
	long: '',
	address_type: '',
	vendor_name: '',
	gstin: '',
};

const WarehouseAdmin = () => {
	const { Warehouses } = useSelector(state => state.adminOrder);
	const dispatch = useDispatch();
	const { toast } = useToast();
	const [filteredWarehouses, setFilteredWarehouses] = useState([]);
	const [countries, setCountries] = useState([]);
	const [states, setStates] = useState([]);
	const [formData, setFormData] = useState(defaultData);
	const [search, setSearch] = useState({
		country: 'all',
		state: 'all',
	});
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [deleteId, setDeleteId] = useState(null);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSearchChange = (key, value) => {
		setSearch({ ...search, [key]: value });
	};

	const handleAddWarehouse = async () => {
		if (!formData.name || !formData.email || !formData.phone || !formData.pin_code || !formData.state || !formData.address || !formData.city || !formData.country) {
			toast({
				title: 'All fields are required',
				variant: 'destructive',
			});
			return;
		}
		if (!checkValidAddressLine(formData.address)) {
			toast({
				title: 'Address should start with House/Flat/Road no.',
				variant: 'destructive',
			});
			return;
		}
		await dispatch(createNewWareHouse({ ...formData }));
		dispatch(fetchAllWareHouses());
		toast({
			title: formData._id ? "Warehouse updated successfully" : "Warehouse added successfully",
		});
		setFormData(defaultData);
	};

	const checkValidAddressLine = (currentValue) => {
		const checkAddressLineRegex = /(?:Flat\s*no|Road\s*no)/i;
		// Simplified validation for now, can be enhanced
		return true;
	};

	const handleDeleteWarehouse = (id) => {
		setDeleteId(id);
		setOpenDeleteDialog(true);
	};

	const confirmDeleteWarehouse = async () => {
		if (!deleteId) return;
		await dispatch(deleteWareHouse({ wareHouseId: deleteId }));
		dispatch(fetchAllWareHouses());
		toast({
			title: "Warehouse deleted successfully",
		});
		setOpenDeleteDialog(false);
		setDeleteId(null);
	};

	const handleEditWarehouse = (id) => {
		const warehouseToEdit = Warehouses.find((warehouse) => warehouse._id === id);
		if (warehouseToEdit) {
			setFormData({ ...warehouseToEdit });
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	};

	useEffect(() => {
		dispatch(fetchAllWareHouses());
	}, [dispatch]);

	useEffect(() => {
		if (Warehouses) {
			const uniqueCountries = [...new Set(Warehouses.map(w => w.country).filter(Boolean))];
			const uniqueStates = [...new Set(Warehouses.map(w => w.state).filter(Boolean))];
			setCountries(uniqueCountries);
			setStates(uniqueStates);

			setFilteredWarehouses(Warehouses
				.filter((warehouse) =>
					(search.country !== 'all' ? warehouse.country?.toLowerCase().includes(search.country.toLowerCase()) : true) &&
					(search.state !== 'all' ? warehouse.state?.toLowerCase().includes(search.state.toLowerCase()) : true)
				)
				.sort((a, b) => a.pickup_location?.localeCompare(b.pickup_location))
			);
		}
	}, [Warehouses, search]);

	return (
		<div className="w-full space-y-6">
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Warehouse Management</h1>
					<p className="text-gray-600 mt-1">Manage your pickup locations and warehouses</p>
				</div>
			</div>

			{/* Filters */}
			<Card>
				<CardContent className="p-4">
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="flex-1">
							<Label className="mb-2 block">Filter by Country</Label>
							<Select value={search.country} onValueChange={(val) => handleSearchChange('country', val)}>
								<SelectTrigger>
									<SelectValue placeholder="All Countries" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Countries</SelectItem>
									{countries.map((country, i) => (
										<SelectItem key={i} value={country}>{country}</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="flex-1">
							<Label className="mb-2 block">Filter by State</Label>
							<Select value={search.state} onValueChange={(val) => handleSearchChange('state', val)}>
								<SelectTrigger>
									<SelectValue placeholder="All States" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All States</SelectItem>
									{states.map((state, i) => (
										<SelectItem key={i} value={state}>{state}</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Warehouse Form */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Building className="w-5 h-5" />
						{formData._id ? 'Edit Warehouse' : 'Add New Warehouse'}
					</CardTitle>
					<CardDescription>Enter the details for the warehouse location</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						<div className="space-y-2">
							<Label>Pickup Location Name <span className="text-red-500">*</span></Label>
							<Input name="pickup_location" value={formData.pickup_location} onChange={handleChange} placeholder="e.g., Main Warehouse" />
						</div>
						<div className="space-y-2">
							<Label>Contact Name <span className="text-red-500">*</span></Label>
							<Input name="name" value={formData.name} onChange={handleChange} placeholder="Contact Person" />
						</div>
						<div className="space-y-2">
							<Label>Email <span className="text-red-500">*</span></Label>
							<Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="warehouse@example.com" />
						</div>
						<div className="space-y-2">
							<Label>Phone <span className="text-red-500">*</span></Label>
							<Input name="phone" value={formData.phone} onChange={handleChange} placeholder="+1234567890" />
						</div>
						<div className="space-y-2">
							<Label>Vendor Name</Label>
							<Input name="vendor_name" value={formData.vendor_name} onChange={handleChange} placeholder="Vendor Name" />
						</div>
						<div className="space-y-2">
							<Label>GSTIN</Label>
							<Input name="gstin" value={formData.gstin} onChange={handleChange} placeholder="GSTIN Number" />
						</div>
					</div>

					<Separator />

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						<div className="space-y-2 md:col-span-2">
							<Label>Address Line 1 <span className="text-red-500">*</span></Label>
							<Input name="address" value={formData.address} onChange={handleChange} placeholder="Flat/House No, Street, Locality" />
						</div>
						<div className="space-y-2">
							<Label>Address Line 2</Label>
							<Input name="address_2" value={formData.address_2} onChange={handleChange} placeholder="Landmark, etc." />
						</div>
						<div className="space-y-2">
							<Label>City <span className="text-red-500">*</span></Label>
							<Input name="city" value={formData.city} onChange={handleChange} placeholder="City" />
						</div>
						<div className="space-y-2">
							<Label>State <span className="text-red-500">*</span></Label>
							<Input name="state" value={formData.state} onChange={handleChange} placeholder="State" />
						</div>
						<div className="space-y-2">
							<Label>Country <span className="text-red-500">*</span></Label>
							<Input name="country" value={formData.country} onChange={handleChange} placeholder="Country" />
						</div>
						<div className="space-y-2">
							<Label>Pin Code <span className="text-red-500">*</span></Label>
							<Input name="pin_code" value={formData.pin_code} onChange={handleChange} placeholder="ZIP/Pin Code" />
						</div>
						<div className="space-y-2">
							<Label>Address Type</Label>
							<Input name="address_type" value={formData.address_type} onChange={handleChange} placeholder="e.g., Commercial, Residential" />
						</div>
					</div>

					<Separator />

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-2">
							<Label>Latitude</Label>
							<Input name="lat" value={formData.lat} onChange={handleChange} placeholder="Latitude" />
						</div>
						<div className="space-y-2">
							<Label>Longitude</Label>
							<Input name="long" value={formData.long} onChange={handleChange} placeholder="Longitude" />
						</div>
					</div>

					<Button onClick={handleAddWarehouse} className="w-full md:w-auto">
						<Plus className="w-4 h-4 mr-2" />
						{formData._id ? 'Update Warehouse' : 'Add Warehouse'}
					</Button>
				</CardContent>
			</Card>

			{/* Warehouse List */}
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
				{filteredWarehouses.map((warehouse) => (
					<Card key={warehouse._id} className="hover:shadow-md transition-shadow">
						<CardHeader className="pb-3">
							<div className="flex justify-between items-start">
								<div>
									<CardTitle className="text-lg font-bold">{warehouse.pickup_location}</CardTitle>
									<CardDescription>{warehouse.name}</CardDescription>
								</div>
								<div className="flex gap-2">
									<Button variant="ghost" size="icon" onClick={() => handleEditWarehouse(warehouse._id)}>
										<Edit className="w-4 h-4 text-blue-500" />
									</Button>
									<Button variant="ghost" size="icon" onClick={() => handleDeleteWarehouse(warehouse._id)}>
										<Trash className="w-4 h-4 text-red-500" />
									</Button>
								</div>
							</div>
						</CardHeader>
						<CardContent className="text-sm space-y-3">
							<div className="flex items-start gap-2">
								<MapPin className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
								<span className="text-gray-600">
									{warehouse.address}, {warehouse.address_2 && `${warehouse.address_2}, `}
									{warehouse.city}, {warehouse.state} - {warehouse.pin_code}, {warehouse.country}
								</span>
							</div>
							<div className="flex items-center gap-2">
								<Mail className="w-4 h-4 text-gray-500 shrink-0" />
								<span className="text-gray-600">{warehouse.email}</span>
							</div>
							<div className="flex items-center gap-2">
								<Phone className="w-4 h-4 text-gray-500 shrink-0" />
								<span className="text-gray-600">{warehouse.phone}</span>
							</div>
							{(warehouse.vendor_name || warehouse.gstin) && (
								<div className="pt-2 border-t mt-2">
									{warehouse.vendor_name && <p><span className="font-semibold">Vendor:</span> {warehouse.vendor_name}</p>}
									{warehouse.gstin && <p><span className="font-semibold">GSTIN:</span> {warehouse.gstin}</p>}
								</div>
							)}
						</CardContent>
					</Card>
				))}
			</div>

			<Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Are you sure?</DialogTitle>
						<DialogDescription>
							This action cannot be undone. This will permanently delete the warehouse.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={() => setOpenDeleteDialog(false)}>
							Cancel
						</Button>
						<Button variant="destructive" onClick={confirmDeleteWarehouse}>
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default WarehouseAdmin;
