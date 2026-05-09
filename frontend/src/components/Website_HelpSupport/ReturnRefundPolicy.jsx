import React, { useEffect, useRef } from 'react';
import { FileText, CheckCircle, Package, CreditCard, Truck, RotateCcw, Shield, Mail, Phone, MapPin, Calendar, Clock, AlertCircle } from 'lucide-react';
import Footer from '../Footer/Footer';
import BackToTopButton from '../Home/BackToTopButton';
import WhatsAppButton from '../Home/WhatsAppButton';

const ReturnRefundPolicy = () => {
	const scrollableDivRef = useRef(null);

	useEffect(() => {
		if (scrollableDivRef.current) {
			scrollableDivRef.current.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}, []);

	const sections = [
		{
			id: 1,
			icon: RotateCcw,
			title: 'Returns',
			content: `We want you to be completely satisfied with your purchase. If you are not happy with your order, you may request a return within 7 days of delivery.

To be eligible for a return:
• The item must be unused, unwashed, and in its original condition.
• All original tags, labels, and packaging must be intact.
• The item should not have any stains, damage, perfume, or signs of wear.
• A valid order ID or proof of purchase is required.`
		},
		{
			id: 2,
			icon: AlertCircle,
			title: 'Non-Returnable Items',
			content: `The following items are not eligible for return:
• Innerwear and undergarments
• Accessories and jewelry
• Sale or clearance items
• Customized or personalized products
• Gift cards`
		},
		{
			id: 3,
			icon: Package,
			title: 'Damaged or Incorrect Products',
			content: `If you receive a damaged, defective, or incorrect item, please contact us within 48 hours of delivery with:
• Order ID
• Product images
• Packaging images

Our support team will review the request and arrange a replacement or refund if approved.`
		},
		{
			id: 4,
			icon: CreditCard,
			title: 'Refund Policy',
			content: `Once the returned product is received and inspected:
• Refunds will be processed within 5–7 business days.
• Refunds will be credited to the original payment method.
• COD orders may be refunded via bank transfer or store wallet.`
		},
		{
			id: 5,
			icon: Truck,
			title: 'Exchange Policy',
			content: `We offer size exchanges based on product availability. Exchange requests must be made within 40 days of delivery.`
		},
		{
			id: 6,
			icon: MapPin,
			title: 'Return Pickup',
			content: `• Return pickup service may be available depending on your location.
• If pickup is unavailable, customers may be asked to self-ship the product.`
		},
		{
			id: 7,
			icon: Clock,
			title: 'Cancellation Policy',
			content: `Orders can only be cancelled before they are shipped. Once shipped, the order cannot be cancelled.`
		}
	];

	return (
		<div ref={scrollableDivRef} className="min-h-screen bg-background overflow-y-auto scrollbar-thin scrollbar-track-muted scrollbar-thumb-border">
			{/* Hero Section */}
			<div className="bg-primary text-primary-foreground py-20">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<div className="inline-flex items-center justify-center w-16 h-16 bg-primary-foreground/10 rounded-full mb-6">
						<RotateCcw className="w-8 h-8" />
					</div>
					<h1 className="text-4xl md:text-5xl font-bold mb-4">
						Return & Refund Policy
					</h1>
					<p className="text-lg text-primary-foreground/80">
						Clear and easy returns for a worry-free shopping experience.
					</p>
				</div>
			</div>

			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				{/* Effective Date */}
				<div className="flex items-center gap-2 text-muted-foreground mb-12 pb-6 border-b border-border">
					<Calendar className="w-5 h-5" />
					<p className="font-medium">
						<span className="text-foreground">Effective Date:</span> {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
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
									<p className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm sm:text-base">
										{section.content}
									</p>
								</div>
							</div>
						</section>
					))}

					{/* Contact Section */}
					<section className="bg-muted/30 rounded-2xl p-8">
						<h2 className="text-2xl font-bold text-foreground mb-6">8. Contact Us</h2>
						<p className="text-muted-foreground mb-6">
							For any questions or concerns about return, refund, or exchange requests, please contact our support team:
						</p>
						<div className="space-y-4">
							<div className="flex items-center gap-3">
								<Mail className="w-5 h-5 text-muted-foreground" />
								<a href="mailto:onuclothing2@gmail.com" className="text-foreground hover:text-foreground/80 font-medium">
									onuclothing2@gmail.com
								</a>
							</div>
							<div className="flex items-center gap-3">
								<Phone className="w-5 h-5 text-muted-foreground" />
								<span className="text-foreground">+91 9326727797</span>
							</div>
						</div>
					</section>
				</div>

				{/* Quick Notice */}
				<div className="mt-12 bg-primary/5 border border-primary/10 rounded-xl p-6">
					<div className="flex items-start gap-3">
						<CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
						<div>
							<h3 className="font-semibold text-foreground mb-2">Shopping with Confidence</h3>
							<p className="text-muted-foreground text-sm">
								Our policies are designed to protect your interests and ensure a smooth shopping experience. By placing an order, you agree to these return and refund terms.
							</p>
						</div>
					</div>
				</div>
			</div>

			<Footer />
			<BackToTopButton scrollableDivRef={scrollableDivRef} />
			<WhatsAppButton scrollableDivRef={scrollableDivRef} />
		</div>
	);
};

export default ReturnRefundPolicy;
