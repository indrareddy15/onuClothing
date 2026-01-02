import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BASE_URL, capitalizeFirstLetterOfEachWord, Header } from '@/config';
import { useSettingsContext } from '@/Context/SettingsContext';
import { checkAuth, resetTokenCredentials, updateUserData } from '@/store/auth-slice';
import axios from 'axios';
import { Edit, EditIcon, LogOut, Save, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// ProfileHeader Component
const ProfileHeader = ({ admin }) => {
	return (
		<div className="flex flex-col md:flex-row items-center gap-6 mb-8 pb-6 border-b border-gray-200">
			<div className="relative group">
				<img
					src={admin?.profilePic}
					alt="admin-Profile"
					className="w-24 h-24 rounded-full border-2 border-gray-200 shadow-sm object-cover"
				/>
			</div>
			<div className="text-center md:text-left">
				<h2 className="text-3xl font-bold text-gray-900">{admin?.name || "Admin"}</h2>
				<p className="text-sm text-gray-500 mt-1">{capitalizeFirstLetterOfEachWord(admin?.role)}</p>
			</div>
		</div>
	);
};

// ProfileDetails Component
const ProfileDetails = ({ admin }) => {
	return (
		<div className="space-y-6 animate-in fade-in duration-500">
			<div className="grid gap-6 md:grid-cols-2">
				<div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
					<h3 className="text-sm font-medium text-gray-500 mb-1">Email Address</h3>
					<p className="text-lg font-medium text-gray-900 break-all">{admin?.email}</p>
				</div>
				<div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
					<h3 className="text-sm font-medium text-gray-500 mb-1">Address</h3>
					<p className="text-lg font-medium text-gray-900">{admin?.address || 'Not provided'}</p>
				</div>
			</div>
		</div>
	);
};

// EditProfileForm Component (Inline)
const EditProfileForm = ({ user, onSave, onCancel }) => {
	const [formData, setFormData] = useState(null);
	const [isLoadingImage, setImageLoading] = useState(false);

	const handleUploadImage = async (file) => {
		try {
			const formData = new FormData();
			formData.append('my_file', file);
			const res = await axios.post(`${BASE_URL}/admin/upload-image`, formData, Header());
			if (res.data?.result) {
				return res.data?.result;
			}
			return '';
		} catch (error) {
			console.error('An error occurred while uploading: ', error);
			return '';
		}
	}

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onSave(formData);
	};

	const setRandomImage = () => {
		const randomNm = Math.floor(Math.random() * 100 + 1);
		setFormData({ ...formData, profilePic: `https://avatar.iran.liara.run/public/${randomNm}` });
	}

	const handleProfilePicChange = async (e) => {
		setImageLoading(true);
		const file = e.target.files[0];
		if (file) {
			const newProfileImage = await handleUploadImage(file);
			if (newProfileImage) {
				setFormData({ ...formData, profilePic: newProfileImage });
			}
		}
		setImageLoading(false);
	};

	useEffect(() => {
		if (user) {
			setFormData({
				userId: user._id,
				profilePic: user?.profilePic || '',
				name: user?.name || '',
				email: user?.email || '',
				prevPassword: user?.password || '',
				newPassword: user?.password || '',
				address: user?.address || '',
			})
		}
	}, [user])

	if (!formData) return null;

	return (
		<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
			<div className="flex justify-center items-center space-y-4 mb-8 flex-col">
				<div className="relative group">
					{isLoadingImage ? (
						<div className="w-32 h-32 flex items-center justify-center rounded-full bg-gray-100 border border-gray-200">
							<div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
						</div>
					) : (
						<img
							src={formData?.profilePic}
							alt="Profile"
							className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
						/>
					)}
					<Button
						variant="secondary"
						size="icon"
						disabled={isLoadingImage}
						onClick={() => document.getElementById("profile-pic-input").click()}
						className="absolute bottom-0 right-0 rounded-full shadow-md hover:scale-105 transition-transform"
					>
						<Edit className="w-4 h-4" />
					</Button>
					<input
						disabled={isLoadingImage}
						type="file"
						id="profile-pic-input"
						className="hidden"
						accept="image/*"
						onChange={handleProfilePicChange}
					/>
				</div>
				<Button
					variant="ghost"
					size="sm"
					onClick={setRandomImage}
					className="text-xs text-muted-foreground hover:text-primary"
				>
					Generate Random Avatar
				</Button>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
				<div className="grid gap-6 md:grid-cols-2">
					<div className="space-y-2">
						<Label htmlFor="name">Name</Label>
						<Input
							id="name"
							name="name"
							value={formData?.name}
							onChange={handleChange}
							required
							className="bg-white"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							name="email"
							type="email"
							value={formData?.email}
							onChange={handleChange}
							required
							className="bg-white"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="prevPassword">Previous Password</Label>
						<Input
							id="prevPassword"
							name="prevPassword"
							type="password"
							value={formData?.prevPassword}
							onChange={handleChange}
							className="bg-white"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="newPassword">New Password</Label>
						<Input
							id="newPassword"
							name="newPassword"
							type="password"
							value={formData?.newPassword}
							onChange={handleChange}
							className="bg-white"
						/>
					</div>
					<div className="space-y-2 md:col-span-2">
						<Label htmlFor="address">Address</Label>
						<Input
							id="address"
							name="address"
							value={formData?.address}
							onChange={handleChange}
							className="bg-white"
							placeholder="Enter your address"
						/>
					</div>
				</div>

				<div className="flex items-center justify-end gap-4 pt-4 border-t">
					<Button type="button" variant="outline" onClick={onCancel}>
						Cancel
					</Button>
					<Button type="submit" className="btn-primary min-w-[120px]">
						<Save className="w-4 h-4 mr-2" />
						Save Changes
					</Button>
				</div>
			</form>
		</div>
	);
};

// AdminProfile Component
const AdminProfile = ({ user }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { checkAndCreateToast } = useSettingsContext();
	const [isEditing, setIsEditing] = useState(false);

	const handleLogOut = async (e) => {
		e.preventDefault();
		dispatch(resetTokenCredentials());
		sessionStorage.clear();
		navigate('/auth/login');
	};

	const handleSave = async (updatedData) => {
		const response = await dispatch(updateUserData(updatedData))
		if (response?.payload?.Success) {
			checkAndCreateToast('success', response?.payload?.message || "User Updated Successfully");
			setIsEditing(false);
			dispatch(checkAuth());
		} else {
			checkAndCreateToast('error', response?.payload?.message || "Failed to Update User");
		}
	};

	return (
		<div className="p-6 max-w-5xl mx-auto">
			<Card className="shadow-sm">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-2xl font-bold">Profile Settings</CardTitle>
					{!isEditing && (
						<div className="flex gap-2">
							<Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
								<EditIcon className="mr-2 w-4 h-4" /> Edit Profile
							</Button>
							<Button onClick={handleLogOut} variant="destructive" size="sm">
								<LogOut className="mr-2 w-4 h-4" /> Logout
							</Button>
						</div>
					)}
				</CardHeader>
				<CardContent className="p-6">
					{isEditing ? (
						<EditProfileForm
							user={user}
							onSave={handleSave}
							onCancel={() => setIsEditing(false)}
						/>
					) : (
						<>
							<ProfileHeader admin={user} />
							<ProfileDetails admin={user} />
						</>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export default AdminProfile;
