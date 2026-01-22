import React, { useEffect, useRef, useState } from "react";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import Footer from "../Footer/Footer";
import { useDispatch } from "react-redux";
import axios from "axios";
import { BASE_API_URL } from "../../config";
import { useSettingsContext } from "../../Contaxt/SettingsContext";
import BackToTopButton from "../Home/BackToTopButton";
import WhatsAppButton from "../Home/WhatsAppButton";
import Loader from "../Loader/Loader";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";

/**
 * Contact Page Component
 * Modern redesign following newCode design patterns
 * Using lucide-react icons and clean form design
 */
const Contact = () => {
	const scrollableDivRef = useRef(null);
	const dispatch = useDispatch();
	const { checkAndCreateToast } = useSettingsContext();
	const [formData, setFormData] = useState({});
	const [sendingFormData, setSendingFormData] = useState({});
	const [sendingMessage, setSendingMessage] = useState('');
	const [sendingMessageLoading, setSendingMessageLoading] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const fetchContactUsPageData = async () => {
		setSendingMessageLoading(true);
		try {
			const res = await axios.get(`${BASE_API_URL}/api/common/website/contact-us`);
			setFormData(res?.data?.result || null);
		} catch (error) {
			console.error("Error Fetching Contact Data: ", error);
			setFormData({});
		} finally {
			setSendingMessageLoading(false);
		}
	}

	const sendContactQuery = async () => {
		setIsSubmitting(true);
		try {
			const res = await axios.post(`${BASE_API_URL}/api/common/website/send-contact-query`, { contactDetails: sendingFormData, message: sendingMessage });
			if (res?.data?.Success) {
				checkAndCreateToast("success", "Message sent! We will get back to you shortly.");
				setSendingFormData({})
				setSendingMessage('')
			} else {
				checkAndCreateToast("error", "Failed to send message. Please try again later.");
			}
		} catch (error) {
			console.error("Error Sending Contact Query: ", error);
			checkAndCreateToast("error", "Failed to send message. Please try again later.");
		} finally {
			setIsSubmitting(false);
			scrollableDivRef.current.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}

	useEffect(() => {
		scrollableDivRef.current.scrollTo({ top: 0, behavior: 'smooth' });
		fetchContactUsPageData();
	}, [dispatch])

	const handleChange = (data) => {
		const { name, value } = data;
		setSendingFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		sendContactQuery();
	};

	const mapUrl = formData?.mapLink;

	return (
		<div ref={scrollableDivRef} className="min-h-screen bg-background overflow-y-auto scrollbar-thin scrollbar-track-muted scrollbar-thumb-border">
			{sendingMessageLoading ? (
				<Loader />
			) : (
				<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					{/* Header Section */}
					<header className="text-center mb-16">
						<h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
							{formData.header || "Get in Touch"}
						</h1>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							{formData.subheader || "We would love to hear from you! Whether it's an inquiry, feedback, or support, reach out to us."}
						</p>
					</header>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
						{/* Contact Form */}
						<div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
							<h2 className="text-2xl font-bold text-foreground mb-6">Send Us a Message</h2>

							{formData && formData.formDataForContactUs && formData.formDataForContactUs.length > 0 && (
								<form onSubmit={handleSubmit} className="space-y-6">
									{formData.formDataForContactUs.map((field, i) => (
										<div key={i} className="space-y-2">
											<Label
												htmlFor={`${field?.fieldName}_field_${i}`}
												className="text-sm font-medium text-foreground"
											>
												{field?.fieldName}
												<span className="text-destructive ml-1">*</span>
											</Label>
											<Input
												required
												type="text"
												id={`${field?.fieldName}_field_${i}`}
												name={field?.fieldName.toLowerCase()}
												value={sendingFormData[field?.fieldName] || ''}
												onChange={(e) => handleChange({ name: field?.fieldName, value: e.target.value })}
												placeholder={`Enter your ${field?.fieldName.toLowerCase()}`}
												className="bg-background"
											/>
										</div>
									))}

									<div className="space-y-2">
										<Label
											htmlFor="message"
											className="text-sm font-medium text-foreground"
										>
											Your Message
											<span className="text-destructive ml-1">*</span>
										</Label>
										<Textarea
											placeholder="Please write your message here..."
											id="message"
											name="message"
											value={sendingMessage}
											onChange={(e) => setSendingMessage(e.target.value)}
											rows={6}
											required
											className="bg-background resize-none"
										/>
									</div>

									<p className="text-xs text-muted-foreground">
										<span className="text-destructive mr-1">*</span>
										By submitting this form, you hereby authorise us to contact you through SMS, WhatsApp, RCS Emails and any other available communication channels.
									</p>

									<Button
										type="submit"
										disabled={isSubmitting}
										className="w-full"
										size="lg"
									>
										{isSubmitting ? (
											<>
												<Loader2 className="w-5 h-5 animate-spin mr-2" />
												Sending...
											</>
										) : (
											<>
												<Send className="w-5 h-5 mr-2" />
												Send Message
											</>
										)}
									</Button>
								</form>
							)}
						</div>

						{/* Contact Information */}
						<div className="space-y-8">
							<div className="bg-muted/30 rounded-2xl p-8">
								<h2 className="text-2xl font-bold text-foreground mb-6">Contact Information</h2>
								<p className="text-muted-foreground mb-8">
									You can also reach us through the following contact details:
								</p>

								<div className="space-y-6">
									<div className="flex items-start gap-4">
										<div className="flex-shrink-0 w-12 h-12 bg-card rounded-lg flex items-center justify-center border border-border">
											<Mail className="w-6 h-6 text-foreground" />
										</div>
										<div>
											<p className="text-sm font-medium text-muted-foreground mb-1">Email</p>
											<a href={`mailto:${formData?.email}`} className="text-foreground hover:text-foreground/80 font-medium">
												{formData?.email}
											</a>
										</div>
									</div>

									<div className="flex items-start gap-4">
										<div className="flex-shrink-0 w-12 h-12 bg-card rounded-lg flex items-center justify-center border border-border">
											<Phone className="w-6 h-6 text-foreground" />
										</div>
										<div>
											<p className="text-sm font-medium text-muted-foreground mb-1">Phone</p>
											<a href={`tel:${formData?.phoneNumber}`} className="text-foreground hover:text-foreground/80 font-medium">
												{formData?.phoneNumber}
											</a>
										</div>
									</div>

									<div className="flex items-start gap-4">
										<div className="flex-shrink-0 w-12 h-12 bg-card rounded-lg flex items-center justify-center border border-border">
											<MapPin className="w-6 h-6 text-foreground" />
										</div>
										<div>
											<p className="text-sm font-medium text-muted-foreground mb-1">Address</p>
											<p className="text-foreground">{formData?.address}</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Map Section */}
					{mapUrl && (
						<section className="mb-16">
							<h3 className="text-3xl font-bold text-foreground text-center mb-8">Find Us Here</h3>
							<div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-lg border border-border">
								<iframe
									key={mapUrl}
									src={mapUrl}
									width="100%"
									height="100%"
									style={{ border: 0 }}
									allowFullScreen
									aria-hidden="false"
									tabIndex="0"
									loading="lazy"
									referrerPolicy="no-referrer-when-downgrade"
									onError={(error) => console.error("Error Loading Map:", error)}
								/>
							</div>
						</section>
					)}
				</div>
			)}
			<Footer />
			<BackToTopButton scrollableDivRef={scrollableDivRef} />
			<WhatsAppButton scrollableDivRef={scrollableDivRef} />
		</div>
	);
};

export default Contact;
