import React, { useEffect, useRef, useState } from 'react';
import { Target, Users, Award, TrendingUp, ChevronRight, Eye, Heart, Trophy } from 'lucide-react';
import Footer from '../Footer/Footer';
import { BASE_API_URL } from '../../config';
import axios from 'axios';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import BackToTopButton from '../Home/BackToTopButton';
import WhatsAppButton from '../Home/WhatsAppButton';
import Loader from '../Loader/Loader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

/**
 * About Page Component
 * Modern redesign following newCode design patterns
 * Using lucide-react icons and gray design tokens
 */
const About = () => {
	const scrollableDivRef = useRef(null);
	const [aboutData, setAboutData] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const fetchPageAboutData = async () => {
		setIsLoading(true);
		try {
			const res = await axios.get(`${BASE_API_URL}/api/common/website/about`);
			setAboutData(res?.data?.aboutData || null);
		} catch (error) {
			setAboutData(null);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		scrollableDivRef.current.scrollTo({ top: 0, behavior: 'smooth' });
		fetchPageAboutData();
	}, []);

	return (
		<div ref={scrollableDivRef} className="min-h-screen bg-background overflow-y-auto scrollbar-thin scrollbar-track-muted scrollbar-thumb-border">
			{!isLoading ? (
				<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					{/* Hero Section */}
					<header className="text-center mb-16">
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
							{aboutData?.header || "About Us"}
						</h1>
						<p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
							{aboutData?.subHeader || "Discover our story, mission, and the team behind our success"}
						</p>
					</header>

					{/* Founder Section */}
					{aboutData && aboutData.founderData && <FounderSection founderData={aboutData.founderData} />}

					{/* Mission Section */}
					<section className="py-16 bg-muted/30 rounded-2xl px-8 mb-16">
						<div className="max-w-4xl mx-auto text-center">
							<div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-6">
								<Target className="w-8 h-8 text-primary-foreground" />
							</div>
							<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Our Mission</h2>
							<p className="text-lg text-muted-foreground leading-relaxed">
								{aboutData?.ourMissionDescription || "Our mission is to provide high-quality, sustainable products that enhance our customers' lives."}
							</p>
						</div>
					</section>

					{/* Values/Moto Section */}
					<section className="py-16">
						<h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12">Our Core Values</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
							{aboutData && aboutData.outMoto.length > 0 && aboutData.outMoto.map((moto, index) => {
								const IconComponent = getIconByIndex(index);
								return (
									<div key={`moto-${index}`} className="group bg-card border border-border rounded-xl p-8 hover:shadow-xl hover:border-primary/50 transition-all duration-300">
										<div className="inline-flex items-center justify-center w-12 h-12 bg-muted group-hover:bg-primary rounded-lg mb-4 transition-colors">
											<IconComponent className="w-6 h-6 text-foreground group-hover:text-primary-foreground transition-colors" />
										</div>
										<h3 className="text-xl font-semibold text-foreground mb-3">{moto?.title || "Quality"}</h3>
										<p className="text-muted-foreground leading-relaxed">{moto?.description || "We prioritize providing high-quality products that meet our customers' expectations and needs."}</p>
									</div>
								);
							})}
						</div>
					</section>

					{/* Team Section */}
					<section className="py-16">
						<h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-4">Meet Our Team</h2>
						<p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
							The passionate people behind our success
						</p>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
							{aboutData && aboutData.teamMembers.length > 0 && aboutData.teamMembers.map((member, index) => (
								<div key={`team-${index}`} className="group relative bg-card rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-border">
									<div className="aspect-square overflow-hidden">
										<LazyLoadImage
											effect='blur'
											useIntersectionObserver
											wrapperProps={{
												style: { transitionDelay: "0.3s" },
											}}
											placeholder={<div className="w-full h-full bg-muted animate-pulse"></div>}
											loading='lazy'
											src={member.image}
											alt={`Team_Member_${index + 1}`}
											className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
										/>
									</div>
									<div className="p-6 bg-card">
										<h3 className="text-xl font-semibold text-foreground mb-1">{member.name || "No-Name"}</h3>
										<p className="text-muted-foreground">{member.designation || "No-Designation"}</p>
									</div>
								</div>
							))}
						</div>
					</section>
				</div>
			) : (
				<Loader isLoading={isLoading} />
			)}
			<BackToTopButton scrollableDivRef={scrollableDivRef} />
			<WhatsAppButton scrollableDivRef={scrollableDivRef} />
			<Footer />
		</div>
	);
};

/**
 * FounderSection Component
 * Displays founder information with tabs
 */
const FounderSection = ({ founderData }) => {
	const [isExpanded, setIsExpanded] = useState(false);

	const tabs = [
		{ id: 'introduction', label: 'Introduction', icon: Users },
		{ id: 'founderVision', label: 'Vision', icon: Eye },
		{ id: 'goals', label: 'Goals', icon: Target },
		{ id: 'promises', label: 'Promises', icon: Heart },
	];

	return (
		<section className="py-16 mb-16">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
				{/* Founder Image */}
				<div className="relative h-[400px] lg:h-[600px] rounded-2xl overflow-hidden bg-muted">
					<LazyLoadImage
						effect='blur'
						useIntersectionObserver
						wrapperProps={{
							style: { transitionDelay: "0.5s" },
						}}
						placeholder={<div className="w-full h-full bg-muted animate-pulse"></div>}
						loading='lazy'
						src={founderData?.image}
						alt="Founder"
						className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
					/>
				</div>

				{/* Founder Information */}
				<div className="flex flex-col justify-center">
					<div className="mb-8">
						<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
							{founderData.designation || "Founder"}
						</h2>
					</div>

					{/* Tabs */}
					<Tabs defaultValue="introduction" className="w-full">
						<TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-6">
							{tabs.map((tab) => (
								<TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
									<tab.icon className="w-4 h-4" />
									<span className="hidden sm:inline">{tab.label}</span>
									<span className="sm:hidden">{tab.label.slice(0, 3)}..</span>
								</TabsTrigger>
							))}
						</TabsList>

						{tabs.map((tab) => {
							const content = founderData[tab.id] || '';
							const displayContent = isExpanded ? content : content?.slice(0, 300) + (content.length > 300 ? '...' : '');

							return (
								<TabsContent key={tab.id} value={tab.id} className="bg-muted/30 rounded-xl p-6 mt-0">
									<p className="text-muted-foreground leading-relaxed mb-4">
										{displayContent}
									</p>
									{content?.length > 300 && (
										<button
											onClick={() => setIsExpanded(!isExpanded)}
											className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
										>
											{isExpanded ? 'Show Less' : 'Show More'}
											<ChevronRight className="w-4 h-4" />
										</button>
									)}
								</TabsContent>
							);
						})}
					</Tabs>
				</div>
			</div>
		</section>
	);
};

/**
 * Helper function to get icons by index
 */
const getIconByIndex = (index) => {
	const icons = [Award, Trophy, TrendingUp, Heart, Target, Eye];
	return icons[index % icons.length];
};

export default About;
