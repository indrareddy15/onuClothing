import { ChevronDown, ChevronRight, HelpCircle } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import Footer from '../Footer/Footer';
import BackToTopButton from '../Home/BackToTopButton';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFAQ } from '../../action/common.action';
import Loader from '../Loader/Loader';
import WhatsAppButton from '../Home/WhatsAppButton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/ui/accordion';

/**
 * FAQ Page Component
 * Modern redesign following newCode design patterns
 * Using lucide-react icons and smooth animations
 */
const FAQ = () => {
	const { faqs, loading } = useSelector(state => state.faqsArray);
	const dispatch = useDispatch();
	const scrollableDivRef = useRef(null);

	useEffect(() => {
		scrollableDivRef.current.scrollTo({ top: 0, behavior: 'smooth' });
	}, [])

	useEffect(() => {
		dispatch(fetchFAQ())
	}, [dispatch])

	return (
		<div ref={scrollableDivRef} className="min-h-screen bg-background overflow-y-auto scrollbar-thin scrollbar-track-muted scrollbar-thumb-border">
			<div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				{/* Header Section */}
				<header className="text-center mb-16">
					<div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-6">
						<HelpCircle className="w-8 h-8 text-foreground" />
					</div>
					<h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
						Frequently Asked Questions
					</h1>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Find answers to some of the most common questions about our platform
					</p>
				</header>

				{/* FAQ Section */}
				<div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden p-6">
					{!loading ? (
						<Accordion type="single" collapsible className="w-full">
							{faqs && faqs.length > 0 && faqs.map((faq, index) => (
								<AccordionItem key={index} value={`item-${index}`}>
									<AccordionTrigger className="text-lg font-semibold text-foreground hover:no-underline">
										{faq.question}
									</AccordionTrigger>
									<AccordionContent className="text-muted-foreground leading-relaxed">
										{faq.answer}
									</AccordionContent>
								</AccordionItem>
							))}
						</Accordion>
					) : (
						<div className="p-12">
							<Loader />
						</div>
					)}
				</div>

				{/* Still Have Questions Section */}
				<div className="mt-16 text-center bg-muted/30 rounded-2xl p-8">
					<h3 className="text-2xl font-bold text-foreground mb-4">
						Still have questions?
					</h3>
					<p className="text-muted-foreground mb-6">
						Can't find the answer you're looking for? Please reach out to our support team.
					</p>
					<a
						href="/contact"
						className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
					>
						<HelpCircle className="w-5 h-5" />
						Contact Support
					</a>
				</div>
			</div>
			<Footer />
			<BackToTopButton scrollableDivRef={scrollableDivRef} />
			<WhatsAppButton scrollableDivRef={scrollableDivRef} />
		</div>
	);
};

export default FAQ;
