import React, { useEffect, useRef } from 'react';
import { FileText, CheckCircle, Package, CreditCard, Truck, RotateCcw, Shield, Copyright, Scale, FileWarning, Edit, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import Footer from '../Footer/Footer';
import BackToTopButton from '../Home/BackToTopButton';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTermsAndCondition } from '../../action/common.action';
import Loader from '../Loader/Loader';
import WhatsAppButton from '../Home/WhatsAppButton';

/**
 * TermsAndConditions Page Component
 * Modern redesign following newCode design patterns
 * Using lucide-react icons and professional styling
 */
const TermsAndConditions = () => {
	const scrollableDivRef = useRef(null);
	const { termsAndCondition, loading } = useSelector(state => state.TermsAndConditions);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchTermsAndCondition());
	}, [dispatch])

	useEffect(() => {
		scrollableDivRef.current.scrollTo({ top: 0, behavior: 'smooth' });
	}, [])

	const sections = [
		{ id: 1, icon: CheckCircle, title: 'Acceptance of Terms', content: termsAndCondition?.acceptanceOfTerms },
		{ id: 2, icon: FileText, title: 'Use of the Website', content: termsAndCondition?.useOfWebsite },
		{ id: 3, icon: Package, title: 'Products and Pricing', content: termsAndCondition?.productsAndPricing },
		{ id: 4, icon: CreditCard, title: 'Orders and Payments', content: termsAndCondition?.ordersAndPayments },
		{ id: 5, icon: Truck, title: 'Shipping and Delivery', content: termsAndCondition?.shippingAndDelivery },
		{ id: 6, icon: RotateCcw, title: 'Returns and Refunds', content: termsAndCondition?.returnsAndRefunds },
		{ id: 7, icon: Shield, title: 'Privacy and Data Protection', content: termsAndCondition?.privacyAndDataProtection },
		{ id: 8, icon: Copyright, title: 'Intellectual Property', content: termsAndCondition?.intellectualProperty },
		{ id: 9, icon: FileWarning, title: 'Indemnification', content: termsAndCondition?.indemnification },
		{ id: 10, icon: Scale, title: 'Governing Law and Dispute Resolution', content: termsAndCondition?.governingLawAndDispute },
		{ id: 11, icon: Edit, title: 'Modifications to Terms', content: termsAndCondition?.modificationsToTerms },
	];

	return (
		<div ref={scrollableDivRef} className="min-h-screen bg-background overflow-y-auto scrollbar-thin scrollbar-track-muted scrollbar-thumb-border">
			{/* Hero Section */}
			<div className="bg-primary text-primary-foreground py-20">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<div className="inline-flex items-center justify-center w-16 h-16 bg-primary-foreground/10 rounded-full mb-6">
						<FileText className="w-8 h-8" />
					</div>
					<h1 className="text-4xl md:text-5xl font-bold mb-4">
						Terms & Conditions
					</h1>
					<p className="text-lg text-primary-foreground/80">
						Please read these terms and conditions carefully before using our service.
					</p>
				</div>
			</div>

			{!loading ? (
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					{/* Effective Date */}
					<div className="flex items-center gap-2 text-muted-foreground mb-12 pb-6 border-b border-border">
						<Calendar className="w-5 h-5" />
						<p className="font-medium">
							<span className="text-foreground">Effective Date:</span> {termsAndCondition?.effectiveDate}
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
										<p className="text-muted-foreground leading-relaxed whitespace-pre-line">
											{section.content}
										</p>
									</div>
								</div>
							</section>
						))}

						{/* Contact Section */}
						<section className="bg-muted/30 rounded-2xl p-8">
							<h2 className="text-2xl font-bold text-foreground mb-6">12. Contact Us</h2>
							<p className="text-muted-foreground mb-6">
								For any questions or concerns about these Terms and Conditions, please contact us at:
							</p>
							<div className="space-y-4">
								<div className="flex items-center gap-3">
									<Mail className="w-5 h-5 text-muted-foreground" />
									<a href={`mailto:${termsAndCondition?.contactInfo}`} className="text-foreground hover:text-foreground/80 font-medium">
										{termsAndCondition?.contactInfo}
									</a>
								</div>
								<div className="flex items-center gap-3">
									<Phone className="w-5 h-5 text-muted-foreground" />
									<span className="text-foreground">{termsAndCondition?.phoneNumber}</span>
								</div>
								<div className="flex items-start gap-3">
									<MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
									<span className="text-foreground">{termsAndCondition?.businessAddress}</span>
								</div>
							</div>
						</section>
					</div>

					{/* Agreement Notice */}
					<div className="mt-12 bg-primary/5 border border-primary/10 rounded-xl p-6">
						<div className="flex items-start gap-3">
							<CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
							<div>
								<h3 className="font-semibold text-foreground mb-2">Agreement</h3>
								<p className="text-muted-foreground text-sm">
									By using our website and services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
								</p>
							</div>
						</div>
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

export default TermsAndConditions;
