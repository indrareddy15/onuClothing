import React, { useEffect, useState, useMemo } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOptions } from '../../../../action/common.action';
import Loader from '../../../Loader/Loader';

const MProductsBar = ({ showProducts, onClose }) => {
	const { options } = useSelector((state) => state.AllOptions);
	const [activeGender, setActiveGender] = useState(null);

	const dispatch = useDispatch();
	const navigation = useNavigate();

	const handleSetQuery = (gender, category) => {
		const queryParams = new URLSearchParams();
		if (gender) queryParams.set('gender', gender.toLowerCase());
		if (category) queryParams.set('category', category.toLowerCase());

		navigation(`/products?${queryParams.toString()}`);
		onClose && onClose();
	};

	const categories = useMemo(
		() => (options ? options.filter((item) => item.isActive && item.type === 'category') : []),
		[options]
	);
	const subcategories = useMemo(
		() => (options ? options.filter((item) => item.isActive && item.type === 'subcategory') : []),
		[options]
	);
	const genders = useMemo(
		() => (options ? options.filter((item) => item.isActive && item.type === 'gender') : []),
		[options]
	);

	const productsOptions = useMemo(
		() =>
			genders.map((gender) => ({
				Gender: gender.value,
				category: categories.map((category) => ({
					title: category.value,
					subcategories: subcategories
						.map((subcategory) => subcategory.value),
				})),
			})),
		[genders, categories, subcategories]
	);

	const toggleGender = (gender) => {
		setActiveGender((prev) => (prev === gender ? null : gender));
	};

	useEffect(() => {
		dispatch(fetchAllOptions());
	}, [dispatch]);

	if (!options) {
		return <div className="p-4"><Loader /></div>;
	}

	return (
		<div className={`w-full ${showProducts}`}>
			{productsOptions.length > 0 &&
				productsOptions.map((product) => (
					<div key={product.Gender} className="border-b border-gray-100 last:border-0">
						<button
							className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
							onClick={() => toggleGender(product.Gender)}
						>
							{product.Gender}
							{activeGender === product.Gender ? (
								<ChevronDown className="w-4 h-4 text-gray-500" />
							) : (
								<ChevronRight className="w-4 h-4 text-gray-500" />
							)}
						</button>

						{/* Categories Dropdown */}
						{activeGender === product.Gender && (
							<div className="bg-gray-50">
								{product.category.slice(0, 6).map((category, i) => (
									<button
										key={i}
										className="w-full flex items-center justify-between px-8 py-2 text-sm text-gray-600 hover:text-black hover:bg-gray-100 transition-colors text-left"
										onClick={() => handleSetQuery(activeGender, category.title)}
									>
										{category.title}
									</button>
								))}
							</div>
						)}
					</div>
				))}
		</div>
	);
};

export default MProductsBar;
