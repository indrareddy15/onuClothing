import React, { useEffect, useMemo, useState } from "react";
import g1 from "../images/googleplay.png";
import g2 from "../images/appleplay.png";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ChevronDown, Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone } from "lucide-react";
import { FaCcVisa, FaCcMastercard, FaGooglePay, FaAmazonPay, FaCreditCard, FaMobileAlt } from "react-icons/fa";
import { SiPaytm } from "react-icons/si";
import { useDispatch, useSelector } from "react-redux";
import { fetchTermsAndCondition } from "../../action/common.action";
import { fetchAllOptions } from "../../action/productaction";
import PwaSetup from "../Home/PwaSetup";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";

const Footer = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { options } = useSelector((state) => state.AllOptions);
	const { termsAndCondition } = useSelector((state) => state.TermsAndConditions);
	const [openDropdown, setOpenDropdown] = useState({});

	const handleSetQuery = (gender, category) => {
		const queryParams = new URLSearchParams();
		if (category) queryParams.set('category', category.toLowerCase());
		if (gender) queryParams.set('gender', gender.toLowerCase());

		const url = `/products?${queryParams.toString()}`;
		navigate(url);
	};

	const memoizedProductsOptions = useMemo(() => {
		if (options && options.length > 0) {
			const categories = options.filter((item) => item.type === 'category');
			const subcategories = options.filter((item) => item.type === 'subcategory');
			const genders = options.filter((item) => item.isActive && item.type === 'gender');

			return genders.slice(0, 2).map((g) => ({
				Gender: g.value,
				category: categories.slice(0, 4).map((c) => ({
					title: c.value,
					subcategories: subcategories.filter((s) => s.categoryId === c.id).map((s) => s.value),
				})),
			}));
		}
		return [];
	}, [options]);

	const toggleDropdown = (section) => {
		setOpenDropdown((prev) => ({
			...prev,
			[section]: !prev[section],
		}));
	};

	useEffect(() => {
		dispatch(fetchTermsAndCondition());
		dispatch(fetchAllOptions());
	}, [dispatch]);

	const SocialIcon = ({ Icon, href, colorClass }) => (
		<a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			className={`p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-300 ${colorClass}`}
		>
			<Icon className="w-5 h-5" />
		</a>
	);

	const FooterSection = ({ title, children, isOpen, onToggle, isMobile }) => {
		if (isMobile) {
			return (
				<div className="border-b border-gray-200 last:border-0">
					<button
						onClick={onToggle}
						className="flex w-full items-center justify-between py-4 text-left font-medium text-gray-900"
					>
						{title}
						<ChevronDown
							className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
						/>
					</button>
					<div
						className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[500px] pb-4 opacity-100" : "max-h-0 opacity-0"
							}`}
					>
						{children}
					</div>
				</div>
			);
		}
		return (
			<div className="space-y-4">
				<h3 className="text-sm font-bold tracking-wider text-gray-900 uppercase">{title}</h3>
				{children}
			</div>
		);
	};

	return (
		<footer className="bg-white border-t border-gray-200 pt-12 pb-8 font-sans text-gray-600">
			<div className="container mx-auto px-4 max-w-7xl">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
					{/* Brand & Newsletter Column */}
					<div className="lg:col-span-2 space-y-6">
						<div>
							<h2 className="text-2xl font-extrabold tracking-tighter text-gray-900 mb-4">ON U</h2>
							<p className="text-sm leading-relaxed text-gray-500 mb-6 max-w-sm">
								Experience the best of fashion with our premium collection. Join our community and stay updated.
							</p>
							<div className="flex space-x-3 mb-6">
								<SocialIcon Icon={Facebook} href="#" colorClass="text-blue-600" />
								<SocialIcon Icon={Twitter} href="#" colorClass="text-blue-400" />
								<SocialIcon Icon={Instagram} href="#" colorClass="text-pink-600" />
								<SocialIcon Icon={Youtube} href="#" colorClass="text-red-600" />
							</div>
						</div>

						<div className="space-y-3">
							<h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Stay in the loop</h3>
							<div className="flex gap-2 max-w-sm">
								<Input
									type="email"
									placeholder="Grab Amazing Discounts"
									className="bg-gray-50 border-gray-200 focus:border-black h-9 text-sm"
								/>
								<Button className="bg-black text-white hover:bg-gray-800 h-9 px-4 text-sm">
									Subscribe
								</Button>
							</div>
						</div>

						<div className="space-y-3">
							<h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Contact</h3>
							<ul className="space-y-2 text-sm">
								<li className="flex items-center gap-2">
									<Phone className="w-4 h-4 text-gray-400" />
									<span className="text-xs">{termsAndCondition?.phoneNumber || "+91 1234567890"}</span>
								</li>
								<li className="flex items-center gap-2">
									<Mail className="w-4 h-4 text-gray-400" />
									<a href={`mailto:${termsAndCondition?.contactInfo}`} className="hover:text-black transition-colors text-xs">
										{termsAndCondition?.contactInfo || "support@theonu.in"}
									</a>
								</li>
							</ul>
						</div>
					</div>

					{/* Shop & Company & Payments Section */}
					<div className="lg:col-span-2">
						{/* Desktop View */}
						<div className="hidden md:grid grid-cols-2 gap-8">
							<FooterSection title="Shop" isMobile={false}>
								<ul className="space-y-2 text-sm">
									{memoizedProductsOptions.slice(0, 2).map((gender, index) => (
										<li key={index} className="space-y-1">
											<button
												onClick={() => handleSetQuery(gender.Gender, '')}
												className="font-semibold text-gray-900 hover:text-gray-600 transition-colors"
											>
												{gender.Gender}
											</button>
											<ul className="pl-0 space-y-1">
												{gender.category.slice(0, 3).map((cat, idx) => (
													<li key={idx}>
														<button
															onClick={() => handleSetQuery(gender.Gender, cat.title)}
															className="text-gray-500 hover:text-black transition-colors text-xs"
														>
															{cat.title}
														</button>
													</li>
												))}
											</ul>
										</li>
									))}
								</ul>
							</FooterSection>

							<FooterSection title="Company" isMobile={false}>
								<ul className="space-y-2 text-sm">
									<li><Link to="/about" className="hover:text-black transition-colors">Our story</Link></li>
									<li><Link to="/contact" className="hover:text-black transition-colors">Contact Us</Link></li>
									<li><Link to="/faq" className="hover:text-black transition-colors">FAQ</Link></li>
									<li><Link to="/tc" className="hover:text-black transition-colors">Terms & Conditions</Link></li>
									<li><Link to="/privacyPolicy" className="hover:text-black transition-colors">Privacy Policy</Link></li>
									<li><Link to="/dashboard" className="hover:text-black transition-colors">Orders & Returns</Link></li>
									<li><Link to="/dashboard" className="hover:text-black transition-colors">Track Your Order</Link></li>
								</ul>
							</FooterSection>
						</div>

						{/* Mobile View */}
						<div className="md:hidden">
							<FooterSection
								title="Shop"
								isMobile={true}
								isOpen={openDropdown["shop"]}
								onToggle={() => toggleDropdown("shop")}
							>
								<ul className="space-y-2 text-sm">
									{memoizedProductsOptions.map((gender, index) => (
										<li key={index} className="space-y-1">
											<button
												onClick={() => handleSetQuery(gender.Gender, '')}
												className="font-semibold text-gray-900 block"
											>
												{gender.Gender}
											</button>
											<ul className="pl-2 space-y-1 border-l-2 border-gray-100">
												{gender.category.map((cat, idx) => (
													<li key={idx}>
														<button
															onClick={() => handleSetQuery(gender.Gender, cat.title)}
															className="text-gray-500 block py-1 text-xs"
														>
															{cat.title}
														</button>
													</li>
												))}
											</ul>
										</li>
									))}
								</ul>
							</FooterSection>

							<FooterSection
								title="Company"
								isMobile={true}
								isOpen={openDropdown["company"]}
								onToggle={() => toggleDropdown("company")}
							>
								<ul className="space-y-2 text-sm">
									<li><Link to="/about" className="block py-1">Our story</Link></li>
									<li><Link to="/contact" className="block py-1">Contact Us</Link></li>
									<li><Link to="/faq" className="block py-1">FAQ</Link></li>
									<li><Link to="/tc" className="block py-1">Terms & Conditions</Link></li>
									<li><Link to="/privacyPolicy" className="block py-1">Privacy Policy</Link></li>
									<li><Link to="/dashboard" className="block py-1">Orders & Returns</Link></li>
									<li><Link to="/dashboard" className="block py-1">Track Your Order</Link></li>
								</ul>
							</FooterSection>
						</div>

						{/* Trusted Payment Section */}
						<div className="mt-8">
							<h3 className="text-sm font-bold tracking-wider text-gray-900 uppercase mb-4">
								Trusted and Safe Payment with
							</h3>
							<div className="flex flex-wrap gap-4 items-center">
								<FaCcVisa className="w-8 h-8 text-blue-900" title="Visa" />
								<FaGooglePay className="w-10 h-10 text-gray-700" title="Google Pay" />
								<FaCcMastercard className="w-8 h-8 text-red-600" title="Mastercard" />
								<div className="flex items-center gap-1 text-gray-700 font-bold text-sm border border-gray-300 px-2 py-1 rounded">
									<span className="text-orange-500">Ru</span>Pay
								</div>
								<SiPaytm className="w-8 h-8 text-blue-500" title="Paytm" />
								<div className="flex items-center gap-1 text-gray-700 font-bold text-sm border border-gray-300 px-2 py-1 rounded">
									UPI
								</div>
								<FaAmazonPay className="w-10 h-10 text-gray-800" title="Amazon Pay" />
							</div>
						</div>
					</div>

					{/* App Download & Info */}
					<div>
						<FooterSection title="Get the App" isMobile={false}>
							<div className="space-y-6">
								<div className="space-y-3">
									<p className="text-xs text-gray-500">Download for best experience.</p>
									<div className="grid grid-cols-2 gap-2">
										<img src={g1} alt="Google Play" className="h-8 object-contain cursor-pointer hover:opacity-80 transition-opacity" />
										<img src={g2} alt="App Store" className="h-8 object-contain cursor-pointer hover:opacity-80 transition-opacity" />
									</div>
									<div className="pt-1">
										<PwaSetup />
									</div>
								</div>

								<div className="space-y-3 pt-2 border-t border-gray-100">
									<h3 className="text-sm font-bold tracking-wider text-gray-900 uppercase">Info</h3>
									<ul className="space-y-2 text-xs text-gray-500">
										<li><span className="font-semibold text-gray-700">Owner:</span> On U</li>
										<li>
											<a
												href="https://www.google.com/maps/search/?api=1&query=ON+U,+Shop+No.+14,+S,+Girme+Height+Building,+Plot+A,+Salunke+Vihar+Rd,+Wanowrie,+Pune+-+411040"
												target="_blank"
												rel="noopener noreferrer"
												className="flex items-center gap-1 font-bold text-blue-600 hover:underline"
											>
												GET DIRECTION <ArrowRight className="w-3 h-3" />
											</a>
										</li>
										<li><span className="font-semibold text-gray-700">Company:</span> On U</li>
										<li>
											<span className="font-semibold text-gray-700">Address:</span><br />
											ON U, Shop No. 14, S, Girme Height Building, Plot A, Salunke Vihar Rd, Wanowrie, Pune - 411040
										</li>
									</ul>
								</div>
							</div>
						</FooterSection>
					</div>
				</div>

				<Separator className="mb-6" />

				{/* Bottom Section */}
				<div className="flex justify-center items-center gap-4 text-xs text-gray-400">
					<p>&copy; {new Date().getFullYear()} www.theonu.in. All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
