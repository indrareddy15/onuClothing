import FileUploadComponent from '@/components/admin-view/FileUploadComponent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { fetchCouponBannerData, setCouponBannerData } from '@/store/common-slice';
import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useDispatch, useSelector } from 'react-redux';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Save, Image as ImageIcon, Type } from 'lucide-react';

const AdminHomeCouponBanner = () => {
	const dispatch = useDispatch();
	const { toast } = useToast();
	const { CouponBannerData } = useSelector(state => state.common);
	const [header, setHeader] = useState('');
	const [imageLoading, setImageLoading] = useState(false);
	const [subHeader, setSubHeader] = useState('');
	const [bannerModelUrl, setBannerModelUrl] = useState('');

	const handleSave = async () => {
		if (!header || !subHeader || !bannerModelUrl) {
			toast({
				title: 'All fields are required',
				variant: 'destructive',
			});
			return;
		}
		const response = await dispatch(setCouponBannerData({ header, subHeader, bannerModelUrl }));
		if (response?.payload?.Success) {
			toast({
				title: 'Coupon Banner updated successfully',
			});
		} else {
			toast({
				title: 'Failed to update Coupon Banner',
				variant: 'destructive',
			});
		}
	};

	useEffect(() => {
		dispatch(fetchCouponBannerData());
	}, [dispatch]);

	useEffect(() => {
		setHeader(CouponBannerData?.header || '');
		setSubHeader(CouponBannerData?.subHeader || '');
		setBannerModelUrl(CouponBannerData?.bannerModelUrl || '');
	}, [dispatch, CouponBannerData]);

	useEffect(() => {
		window.scroll(0, 0);
	}, []);

	return (
		<div className="w-full space-y-6">
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Coupon Banner</h1>
					<p className="text-gray-600 mt-1">Manage the promotional coupon banner on the home screen</p>
				</div>
				<Button onClick={handleSave} disabled={imageLoading}>
					<Save className="w-4 h-4 mr-2" />
					Save Changes
				</Button>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				<Card className="md:col-span-1">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Type className="w-5 h-5" />
							Banner Text
						</CardTitle>
						<CardDescription>Update the text displayed on the coupon banner</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-2">
							<Label>Header</Label>
							<Input
								value={header}
								onChange={(e) => setHeader(e.target.value)}
								placeholder="e.g., Summer Sale"
							/>
						</div>
						<div className="grid gap-2">
							<Label>Sub-Header</Label>
							<Input
								value={subHeader}
								onChange={(e) => setSubHeader(e.target.value)}
								placeholder="e.g., Up to 50% Off"
							/>
						</div>
					</CardContent>
				</Card>

				<Card className="md:col-span-1">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<ImageIcon className="w-5 h-5" />
							Banner Image
						</CardTitle>
						<CardDescription>Upload the model image for the banner (Recommended: 474px x 711px)</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg bg-gray-50">
							{bannerModelUrl ? (
								<div className="relative group">
									<LazyLoadImage
										effect="blur"
										src={bannerModelUrl}
										alt="Banner Model"
										className="h-64 w-auto object-contain rounded-lg shadow-md"
									/>
								</div>
							) : (
								<div className="text-center text-gray-400">
									<ImageIcon className="w-12 h-12 mx-auto mb-2" />
									<p>No image uploaded</p>
								</div>
							)}
						</div>

						<div className="max-w-md mx-auto">
							<FileUploadComponent
								maxFiles={1}
								tag={`tag-banner-model`}
								sizeTag={`banner-model-home`}
								onSetImageUrls={(e) => {
									if (e && e.length > 0) {
										setBannerModelUrl(e[0].url);
									}
								}}
								isLoading={imageLoading}
								setIsLoading={setImageLoading}
							/>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default AdminHomeCouponBanner;
