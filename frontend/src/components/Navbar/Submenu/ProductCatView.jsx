import React, { useMemo } from 'react';
import { useNavigate } from "react-router-dom";

const ProductCatView = ({ show, CMenu, parentCallback, options }) => {
	const navigation = useNavigate();

	const productsOptions = useMemo(() => {
		if (options && options.length > 0) {
			const categories = options.filter((item) => item.isActive && item.type === 'category');
			const subcategories = options.filter((item) => item.isActive && item.type === 'subcategory');
			const genders = options.filter((item) => item.isActive && item.type === 'gender');

			return genders.map((g) => ({
				Gender: g.value,
				category: categories.map((c) => ({
					title: c.value,
					subcategories: subcategories.filter((s) => s.categoryId === c.id).map((s) => s.value),
				})),
			}));
		}
		return [];
	}, [options]);

	const handelSetQuery = (gender, category) => {
		const queryParams = new URLSearchParams();
		if (category) queryParams.set('category', category.toLowerCase());
		if (gender) queryParams.set('gender', gender.toLowerCase());

		const url = `/products?${queryParams.toString()}`;
		navigation(url);
		window.location.reload();
	};

	if (!productsOptions || productsOptions.length <= 0) return null;

	return (
		<div
			className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 w-auto min-w-[800px] max-w-7xl bg-white border rounded-xl shadow-2xl transition-all duration-300 origin-top z-40 ${show ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95'}`}
			onMouseEnter={() => parentCallback('products', true)}
			onMouseLeave={() => parentCallback('products', false)}
		>
			<div className="px-8 py-6">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{productsOptions.map((genderGroup, index) => (
						<div key={index} className="space-y-4">
							<h3 className="text-lg font-bold text-gray-900 border-b pb-2">
								{genderGroup.Gender}
							</h3>
							<ul className="space-y-2">
								{genderGroup.category.map((cat, i) => (
									<li key={i}>
										<button
											onClick={() => handelSetQuery(genderGroup.Gender, cat.title)}
											className="text-sm text-gray-600 hover:text-black hover:font-medium transition-colors text-left w-full"
										>
											{cat.title}
										</button>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default ProductCatView;
