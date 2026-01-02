import FileUploadComponent from '@/components/admin-view/FileUploadComponent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useSettingsContext } from '@/Context/SettingsContext';
import { fetchAboutData, sendAboutData } from '@/store/common-slice';
import { X, Plus, Save, Info, Users, User, Target } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const AdminAboutPage = () => {
	const { checkAndCreateToast } = useSettingsContext();
	const dispatch = useDispatch();
	const { isLoading: aboutDataLoading, aboutData } = useSelector(state => state.common);
	const [imageLoading, setImageLoading] = useState(false);

	// New state variables
	const [founderData, setFounderData] = useState({
		name: '',
		image: '',
		designation: '',
		introduction: '',
		details: '',
		founderVision: '',
		goals: '',
		promises: '',
	});
	const [header, setHeader] = useState('');
	const [subHeader, setSubHeader] = useState('');
	const [ourMissionDescription, setOurMissionDescription] = useState('');
	const [outMoto, setOutMoto] = useState([{ title: '', description: '' }]);
	const [teamMembers, setTeamMembers] = useState([
		{ name: '', image: '', designation: '' }
	]);

	// Handle adding a new Out Moto
	const handleAddOutMoto = () => {
		setOutMoto([...(outMoto || []), { title: '', description: '' }]);
	};

	// Handle removing an Out Moto
	const handleRemoveOutMoto = (index) => {
		if (Array.isArray(outMoto)) {
			const updatedOutMoto = outMoto.filter((_, i) => i !== index);
			setOutMoto(updatedOutMoto);
		}
	};

	// Handle saving the form data
	const handleSave = async () => {
		if (imageLoading) {
			return;
		}
		await dispatch(sendAboutData({
			header,
			subHeader,
			ourMissionDescription,
			outMoto: outMoto || [],
			founderData,
			teamMembers: Array.isArray(teamMembers) ? teamMembers.filter(member => member.title !== '' && member.image !== '' && member.designation !== '') : [],
		}))
		checkAndCreateToast("success", "Data Saved Successfully");
	};
	const handleAddTeamMember = () => {
		setTeamMembers([...(teamMembers || []), { name: '', image: '', designation: '' }]);
	};
	const handleRemoveTeamMember = (index) => {
		if (Array.isArray(teamMembers)) {
			const updatedTeamMembers = teamMembers.filter((_, i) => i !== index);
			setTeamMembers(updatedTeamMembers);
		}
	};

	const handleSetMotoData = (text, field, index) => {
		if (!text) {
			checkAndCreateToast("error", 'No Images Files found!');
			return;
		}
		if (index >= 0 && index < outMoto.length) {
			const updateMoto = outMoto.map((member, i) =>
				i === index ? { ...member, [field]: text } : member
			);
			setOutMoto(updateMoto);
		} else {
			checkAndCreateToast("error", "Invalid index.");
		}
	}
	const handleChangeTeamMembersData = (text, field, index) => {
		if (!text) {
			checkAndCreateToast("error", 'No Images Files found!');
			return;
		}
		if (Array.isArray(teamMembers) && index >= 0 && index < teamMembers.length) {
			const updatedTeamMembers = teamMembers.map((member, i) =>
				i === index ? { ...member, [field]: text } : member
			);
			setTeamMembers(updatedTeamMembers);
		} else {
			checkAndCreateToast("error", "Invalid index.");
		}
	}
	const handleHandleUploadAddTeamMembers = (file, index) => {
		if (!file) {
			checkAndCreateToast("error", 'No Images Files found!');
			return;
		}
		if (file.length <= 0) {
			checkAndCreateToast("error", 'No files Found!');
			return;
		}

		const urls = file[0];

		if (!urls) {
			checkAndCreateToast("error", 'No url found!');
			return;
		}
		if (Array.isArray(teamMembers) && index >= 0 && index < teamMembers.length) {
			const updatedTeamMembers = teamMembers.map((member, i) =>
				i === index ? { ...member, image: urls?.url } : member
			);
			setTeamMembers(updatedTeamMembers);
		} else {
			checkAndCreateToast("error", "Invalid index.");
		}
	}
	useEffect(() => {
		dispatch(fetchAboutData());
	}, [dispatch])
	useEffect(() => {
		if (aboutData) {
			setHeader(aboutData?.header || '');
			setSubHeader(aboutData?.subHeader || '');
			setOurMissionDescription(aboutData?.ourMissionDescription || '');
			setOutMoto(aboutData?.outMoto || [{ title: '', description: '' }]);
			setTeamMembers(aboutData?.teamMembers || [{ name: '', image: '', designation: '' }]);
			setFounderData(aboutData?.founderData || {
				name: '',
				image: '',
				designation: '',
				introduction: '',
				details: '',
				founderVision: '',
				goals: '',
				promises: '',
			});
		}
	}, [aboutData, dispatch])

	return (
		<div className="w-full space-y-6">
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">About Page Management</h1>
					<p className="text-gray-600 mt-1">Manage the content of your About Us page</p>
				</div>
				<Button
					disabled={aboutDataLoading}
					onClick={handleSave}
					className="btn-primary"
				>
					{aboutDataLoading ? (
						<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
					) : (
						<>
							<Save className="w-4 h-4 mr-2" />
							Save Changes
						</>
					)}
				</Button>
			</div>

			<Tabs defaultValue="general" className="w-full">
				<TabsList className="grid w-full grid-cols-2 h-auto md:grid-cols-4 lg:w-[600px]">
					<TabsTrigger value="general" className="flex items-center gap-2">
						<Info className="w-4 h-4" />
						General
					</TabsTrigger>
					<TabsTrigger value="moto" className="flex items-center gap-2">
						<Target className="w-4 h-4" />
						Moto
					</TabsTrigger>
					<TabsTrigger value="team" className="flex items-center gap-2">
						<Users className="w-4 h-4" />
						Team
					</TabsTrigger>
					<TabsTrigger value="founder" className="flex items-center gap-2">
						<User className="w-4 h-4" />
						Founder
					</TabsTrigger>
				</TabsList>

				{/* General Tab */}
				<TabsContent value="general" className="space-y-6 mt-6">
					<Card>
						<CardHeader>
							<CardTitle>Page Header</CardTitle>
							<CardDescription>Set the main heading and sub-heading for the page</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label>Header Title</Label>
								<Input
									value={header}
									onChange={(e) => setHeader(e.target.value)}
									placeholder="Enter Header"
								/>
							</div>
							<div className="space-y-2">
								<Label>Sub-Header</Label>
								<Input
									value={subHeader}
									onChange={(e) => setSubHeader(e.target.value)}
									placeholder="Enter SubHeader"
								/>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Our Mission</CardTitle>
							<CardDescription>Describe your company's mission</CardDescription>
						</CardHeader>
						<CardContent>
							<Textarea
								value={ourMissionDescription}
								rows={8}
								onChange={(e) => setOurMissionDescription(e.target.value)}
								placeholder="Enter Our Mission Description"
							/>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Moto Tab */}
				<TabsContent value="moto" className="space-y-6 mt-6">
					<Card>
						<CardHeader>
							<CardTitle>Our Moto</CardTitle>
							<CardDescription>Add at least 3 core values or motos</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							{outMoto && outMoto.length > 0 && outMoto.map((moto, index) => (
								<div key={index} className="relative border border-gray-200 rounded-lg p-6 bg-gray-50/50">
									<Button
										variant="ghost"
										size="sm"
										className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50"
										onClick={() => handleRemoveOutMoto(index)}
									>
										<X className="w-4 h-4" />
									</Button>
									<div className="grid gap-4">
										<div className="space-y-2">
											<Label>Title</Label>
											<Input
												value={moto?.title}
												onChange={(e) => handleSetMotoData(e.target.value, 'title', index)}
												placeholder="Moto Title"
											/>
										</div>
										<div className="space-y-2">
											<Label>Description</Label>
											<Textarea
												value={moto?.description}
												rows={3}
												onChange={(e) => handleSetMotoData(e.target.value, 'description', index)}
												placeholder="Explain this Moto..."
											/>
										</div>
									</div>
								</div>
							))}
							<Button
								variant="outline"
								className="w-full border-dashed"
								onClick={handleAddOutMoto}
							>
								<Plus className="w-4 h-4 mr-2" />
								Add Another Moto
							</Button>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Team Tab */}
				<TabsContent value="team" className="space-y-6 mt-6">
					<Card>
						<CardHeader>
							<CardTitle>Team Members</CardTitle>
							<CardDescription>Manage your team members section</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{teamMembers && teamMembers.length > 0 && teamMembers.map((team, index) => (
									<div key={index} className="relative border border-gray-200 rounded-lg p-6 bg-gray-50/50">
										<Button
											variant="ghost"
											size="sm"
											className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50"
											onClick={() => handleRemoveTeamMember(index)}
										>
											<X className="w-4 h-4" />
										</Button>
										<div className="space-y-4">
											<div className="flex justify-center">
												<div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 bg-white">
													{team?.image ? (
														<img
															src={team.image}
															alt={team.name}
															className="w-full h-full object-cover"
														/>
													) : (
														<div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
															<User className="w-8 h-8" />
														</div>
													)}
												</div>
											</div>

											<div className="space-y-2">
												<Label>Photo</Label>
												<FileUploadComponent
													maxFiles={1}
													tag={`tag-${index}`}
													sizeTag={`team-${index}`}
													onSetImageUrls={(file) => handleHandleUploadAddTeamMembers(file, index)}
													isLoading={imageLoading}
													setIsLoading={setImageLoading}
												/>
											</div>

											<div className="space-y-2">
												<Label>Name</Label>
												<Input
													value={team?.name}
													onChange={(e) => handleChangeTeamMembersData(e.target.value, 'name', index)}
													placeholder="Member Name"
												/>
											</div>
											<div className="space-y-2">
												<Label>Designation</Label>
												<Input
													value={team?.designation}
													onChange={(e) => handleChangeTeamMembersData(e.target.value, 'designation', index)}
													placeholder="Member Designation"
												/>
											</div>
										</div>
									</div>
								))}
							</div>
							<Button
								variant="outline"
								className="w-full border-dashed"
								onClick={handleAddTeamMember}
							>
								<Plus className="w-4 h-4 mr-2" />
								Add Team Member
							</Button>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Founder Tab */}
				<TabsContent value="founder" className="space-y-6 mt-6">
					<Card>
						<CardHeader>
							<CardTitle>Founder Information</CardTitle>
							<CardDescription>Details about the company founder</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="flex flex-col md:flex-row gap-8">
								<div className="w-full md:w-1/3 space-y-4">
									<div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50">
										{founderData?.image ? (
											<img
												src={founderData.image}
												alt="Founder"
												className="w-full h-full object-cover"
											/>
										) : (
											<div className="w-full h-full flex items-center justify-center text-gray-400">
												<User className="w-16 h-16" />
											</div>
										)}
									</div>
									<FileUploadComponent
										maxFiles={1}
										tag={`Founder-image`}
										sizeTag={`founder-vision-image`}
										onSetImageUrls={(file) => {
											setFounderData({ ...founderData, image: file[0].url });
										}}
										isLoading={imageLoading}
										setIsLoading={setImageLoading}
									/>
								</div>

								<div className="w-full md:w-2/3 space-y-4">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="space-y-2">
											<Label>Name</Label>
											<Input
												value={founderData.name}
												onChange={(e) => setFounderData({ ...founderData, name: e.target.value })}
												placeholder="Founder's Name"
											/>
										</div>
										<div className="space-y-2">
											<Label>Designation</Label>
											<Input
												value={founderData.designation}
												onChange={(e) => setFounderData({ ...founderData, designation: e.target.value })}
												placeholder="Founder's Designation"
											/>
										</div>
									</div>

									<div className="space-y-2">
										<Label>Introduction</Label>
										<Textarea
											value={founderData.introduction}
											onChange={(e) => setFounderData({ ...founderData, introduction: e.target.value })}
											placeholder="Brief introduction"
											rows={4}
										/>
									</div>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
								<div className="space-y-2">
									<Label>Details</Label>
									<Textarea
										value={founderData.details}
										onChange={(e) => setFounderData({ ...founderData, details: e.target.value })}
										rows={5}
										placeholder="Detailed information"
									/>
								</div>
								<div className="space-y-2">
									<Label>Vision</Label>
									<Textarea
										value={founderData.founderVision}
										onChange={(e) => setFounderData({ ...founderData, founderVision: e.target.value })}
										rows={5}
										placeholder="Founder's Vision"
									/>
								</div>
								<div className="space-y-2">
									<Label>Goals</Label>
									<Textarea
										value={founderData.goals}
										onChange={(e) => setFounderData({ ...founderData, goals: e.target.value })}
										rows={5}
										placeholder="Future Goals"
									/>
								</div>
								<div className="space-y-2">
									<Label>Promises</Label>
									<Textarea
										value={founderData?.promises}
										onChange={(e) => setFounderData({ ...founderData, promises: e.target.value })}
										rows={5}
										placeholder="Promises to customers"
									/>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default AdminAboutPage;
