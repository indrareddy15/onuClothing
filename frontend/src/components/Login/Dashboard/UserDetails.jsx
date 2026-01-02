import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateuser } from "../../../action/useraction";
import { Calendar, Edit, Mail, MapPin, Phone, User, Save, X, Camera } from "lucide-react";
import { BASE_API_URL, headerConfig } from "../../../config";
import axios from "axios";
import { useSettingsContext } from "../../../Contaxt/SettingsContext";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useServerAuth } from "../../../Contaxt/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from '../../../components/ui/button.jsx';
import { Input } from '../../../components/ui/input.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { Label } from '../../ui/label';
import { Badge } from '../../ui/badge';
import { Separator } from '../../ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

const UserDetails = () => {
	const navigate = useNavigate();
	const [originalUser, setOriginalUser] = useState(null);
	const dispatch = useDispatch();
	const { user, checkAuthUser } = useServerAuth();
	const [isLoadingImage, setImageLoading] = useState(false);
	const { checkAndCreateToast } = useSettingsContext();
	const [editedUser, setEditedUser] = useState(null);
	const [isEditingAll, setIsEditingAll] = useState(false);
	const [profilePic, setProfilePic] = useState(user.user?.profilePic || "");

	const handleUploadImage = async (file) => {
		try {
			const formData = new FormData();
			formData.append('my_file', file);
			const res = await axios.post(`${BASE_API_URL}/admin/upload-image`, formData, headerConfig());
			if (res.data?.result) {
				return res.data?.result;
			}
			checkAndCreateToast('success', "Image Loaded successfully");
			return '';
		} catch (error) {
			console.error('An error occurred while uploading: ', error);
			if (error.response) {
				checkAndCreateToast("error", "Error uploading files: " + error.response.data.message);
			}
			return '';
		}
	}

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setEditedUser((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleGenderChange = (value) => {
		setEditedUser((prevState) => ({
			...prevState,
			gender: value,
		}));
	};

	const handleProfilePicChange = async (e) => {
		setImageLoading(true);
		const file = e.target.files[0];
		if (file) {
			const newProfileImage = await handleUploadImage(file);
			if (newProfileImage) {
				handleInputChange({ target: { name: 'profilePic', value: newProfileImage } });
				setImageLoading(false);
			} else {
				setImageLoading(false);
			}
		} else {
			setImageLoading(false);
		}
	};

	const handleSave = async () => {
		setIsEditingAll(false);
		const digitsOnly = editedUser?.phoneNumber?.replace(/\D/g, '');

		if (digitsOnly && digitsOnly.length !== 10) {
			checkAndCreateToast('error', 'Phone number should be 10 digits!');
			return;
		}
		await dispatch(updateuser(editedUser));
		await checkAuthUser();
		checkAndCreateToast('success', 'Profile Updated Successfully!');
	};

	const handleCancel = async () => {
		setIsEditingAll(false);
		await checkAuthUser();
		setEditedUser(originalUser);
		setOriginalUser(null);
	};

	const handleEditAll = () => {
		setOriginalUser(editedUser);
		setIsEditingAll(!isEditingAll);
	};

	useEffect(() => {
		if (user) {
			setEditedUser(user.user);
		} else {
			setEditedUser(null);
			setOriginalUser(null);
			navigate('/Login')
		}
	}, [user]);

	if (!editedUser) return null;

	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
			{/* Left Column: Profile Summary */}
			<Card className="lg:col-span-1 border-border bg-card h-fit">
				<CardHeader className="text-center pb-2">
					<div className="mx-auto relative group mb-4">
						{isLoadingImage ? (
							<div className="w-32 h-32 flex items-center justify-center bg-muted rounded-full border-2 border-dashed border-border mx-auto">
								<div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
							</div>
						) : (
							<div className="relative inline-block">
								<LazyLoadImage
									effect='blur'
									src={profilePic || editedUser?.profilePic || `https://avatar.iran.liara.run/username?username=${editedUser?.name?.replace(/ /g, '-')}`}
									alt="Profile"
									className="w-32 h-32 rounded-full object-cover border-4 border-background shadow-lg"
								/>
								{isEditingAll && (
									<label
										htmlFor="profile-pic-input"
										className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 transition-colors shadow-md"
									>
										<Camera className="w-4 h-4" />
										<input
											type="file"
											id="profile-pic-input"
											className="hidden"
											accept="image/*"
											onChange={handleProfilePicChange}
											disabled={isLoadingImage}
										/>
									</label>
								)}
							</div>
						)}
					</div>
					<CardTitle className="text-xl font-bold text-foreground">{editedUser.name}</CardTitle>
					<CardDescription className="text-muted-foreground break-all">{editedUser.email}</CardDescription>
				</CardHeader>
				<CardContent className="text-center pt-2">
					<Badge variant="secondary" className="mb-4 capitalize">
						{editedUser.role || 'Customer'}
					</Badge>
					{!isEditingAll && (
						<Button onClick={handleEditAll} className="w-full mt-4" variant="outline">
							<Edit className="w-4 h-4 mr-2" />
							Edit Profile
						</Button>
					)}
				</CardContent>
			</Card>

			{/* Right Column: Personal Details Form */}
			<Card className="lg:col-span-2 border-border bg-card">
				<CardHeader>
					<CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
						<User className="w-5 h-5" />
						Personal Details
					</CardTitle>
					<CardDescription>
						Manage your personal information and preferences.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-2">
							<Label className="text-foreground">Full Name</Label>
							<div className="relative">
								<User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									name="name"
									value={editedUser.name || ''}
									onChange={handleInputChange}
									disabled={!isEditingAll}
									className="pl-9 bg-background border-input text-foreground"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label className="text-foreground">Email Address</Label>
							<div className="relative">
								<Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									name="email"
									value={editedUser.email || ''}
									disabled={true}
									className="pl-9 bg-muted border-input text-muted-foreground cursor-not-allowed"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label className="text-foreground">Phone Number</Label>
							<div className="relative">
								<Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									name="phoneNumber"
									value={editedUser.phoneNumber || ''}
									onChange={handleInputChange}
									disabled={!isEditingAll}
									className="pl-9 bg-background border-input text-foreground"
									type="number"
									maxLength={10}
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label className="text-foreground">Gender</Label>
							<Select
								disabled={!isEditingAll}
								value={editedUser.gender || ''}
								onValueChange={handleGenderChange}
							>
								<SelectTrigger className="bg-background border-input text-foreground">
									<SelectValue placeholder="Select Gender" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Male">Male</SelectItem>
									<SelectItem value="Female">Female</SelectItem>
									<SelectItem value="Other">Other</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label className="text-foreground">Date of Birth</Label>
							<div className="relative">
								<Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									name="DOB"
									type="date"
									value={editedUser.DOB ? new Date(editedUser.DOB).toISOString().split('T')[0] : ''}
									onChange={handleInputChange}
									disabled={!isEditingAll}
									className="pl-9 bg-background border-input text-foreground"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label className="text-foreground">Country</Label>
							<div className="relative">
								<MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									value="India"
									disabled={true}
									className="pl-9 bg-muted border-input text-muted-foreground cursor-not-allowed"
								/>
							</div>
						</div>
					</div>

					{isEditingAll && (
						<>
							<Separator className="my-4" />
							<div className="flex gap-3 justify-end">
								<Button onClick={handleCancel} variant="outline" className="border-border hover:bg-muted">
									<X className="w-4 h-4 mr-2" />
									Cancel
								</Button>
								<Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90">
									<Save className="w-4 h-4 mr-2" />
									Save Changes
								</Button>
							</div>
						</>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export default UserDetails;
