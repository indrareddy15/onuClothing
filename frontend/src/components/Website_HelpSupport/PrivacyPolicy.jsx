import React, { useEffect, useRef } from 'react';
import { Shield, Lock, Eye, Share2, Cookie, ExternalLink, Calendar, Mail, Phone, MapPin } from 'lucide-react';
import Footer from '../Footer/Footer';
import BackToTopButton from '../Home/BackToTopButton';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPrivacyAndPolicy } from '../../action/common.action';
import Loader from '../Loader/Loader';
import WhatsAppButton from '../Home/WhatsAppButton';


/**
 * PrivacyPolicy Page Component
 * Modern redesign following newCode design patterns
 * Using lucide-react icons and clean typography
 */
const PrivacyPolicy = () => {
	const { privacyPolicy, loading } = useSelector(state => state.PrivacyPolicy);
	const scrollableDivRef = useRef(null);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchPrivacyAndPolicy());
	}, [])

	useEffect(() => {
		scrollableDivRef.current.scrollTo({ top: 0, behavior: 'smooth' });
	}, [])

	const sections = [
		{ id: 1, icon: Shield, title: 'Introduction', content: privacyPolicy?.introduction },
		{ id: 2, icon: Eye, title: 'Information We Collect', content: privacyPolicy?.informationCollect },
		{ id: 3, icon: Lock, title: 'How We Use Your Information', content: privacyPolicy?.usageInfo },
		{ id: 4, icon: Shield, title: 'Data Security', content: privacyPolicy?.dataSecurity },
		{ id: 5, icon: Share2, title: 'Sharing Your Information', content: privacyPolicy?.sharingInfo },
		{ id: 6, icon: Shield, title: 'Your Rights', content: privacyPolicy?.rights },
		{ id: 7, icon: Cookie, title: 'Cookies and Tracking Technologies', content: privacyPolicy?.cookiesInfo },
		{ id: 8, icon: ExternalLink, title: 'Third-Party Links', content: privacyPolicy?.thirdPartyLinks },
		{ id: 9, icon: Shield, title: 'Changes to This Privacy Policy', content: privacyPolicy?.changesPolicy },
	];

	return (
		<div ref={scrollableDivRef} className="min-h-screen bg-background overflow-y-auto scrollbar-thin scrollbar-track-muted scrollbar-thumb-border">
			{/* Hero Section */}
			<div className="bg-primary text-primary-foreground py-20">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<div className="inline-flex items-center justify-center w-16 h-16 bg-primary-foreground/10 rounded-full mb-6">
						<Shield className="w-8 h-8" />
					</div>
					<h1 className="text-4xl md:text-5xl font-bold mb-4">
						Privacy Policy
					</h1>
					<p className="text-lg text-primary-foreground/80">
						Your privacy is important to us. Learn how we protect and handle your information.
					</p>
				</div>
			</div>

			{!loading ? (
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					{/* Effective Date */}
					<div className="flex items-center gap-2 text-muted-foreground mb-12 pb-6 border-b border-border">
						<Calendar className="w-5 h-5" />
						<p className="font-medium">
							<span className="text-foreground">Effective Date:</span> {privacyPolicy?.effectiveDate}
						</p>
					</div>

					{/* Sections */}
					<div className="space-y-12">
						{sections.map((section) => (
							<section key={section.id} className="scroll-mt-20">
								<div className="flex items-start gap-4 mb-4">
									<div className="flex-shrink-0 w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
										<section.icon className="w-5 h-5 text-foreground" />
									</div>
									<div className="flex-1">
										<h2 className="text-2xl font-bold text-foreground mb-3">
											{section.id}. {section.title}
										</h2>
										<p className="text-muted-foreground leading-relaxed">
											{section.content}
										</p>
									</div>
								</div>
							</section>
						))}

						{/* Contact Section */}
						<section className="bg-muted/30 rounded-2xl p-8">
							<h2 className="text-2xl font-bold text-foreground mb-6">10. Contact Us</h2>
							<p className="text-muted-foreground mb-6">
								If you have any questions about this Privacy Policy, please contact us at:
							</p>
							<div className="space-y-4">
								<div className="flex items-center gap-3">
									<Mail className="w-5 h-5 text-muted-foreground" />
									<a href={`mailto:${privacyPolicy?.contactInfo}`} className="text-foreground hover:text-foreground/80 font-medium">
										{privacyPolicy?.contactInfo}
									</a>
								</div>
								<div className="flex items-center gap-3">
									<Phone className="w-5 h-5 text-muted-foreground" />
									<span className="text-foreground">{privacyPolicy?.phoneNumber}</span>
								</div>
								<div className="flex items-start gap-3">
									<MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
									<span className="text-foreground">{privacyPolicy?.businessAddress}</span>
								</div>
							</div>
						</section>
					</div>
				</div>
			) : (
				<div className="py-20">
					<Loader />
				</div>
			)}
			<Footer />
			<BackToTopButton scrollableDivRef={scrollableDivRef} />
			<WhatsAppButton scrollableDivRef={scrollableDivRef} />
		</div>
	);
};

export default PrivacyPolicy;
