import React, { useState } from "react";
import { useSettingsContext } from "../../../Contaxt/SettingsContext";
import { X } from "lucide-react";
import { Input } from "../../../components/ui/input.jsx";
import { Label } from "../../../components/ui/label.jsx";
import { Button } from "../../../components/ui/button.jsx";

const ReturnsOptionsWindow = ({ OnSubmit, OnClose }) => {
	const { checkAndCreateToast } = useSettingsContext();
	const [paymentOption, setPaymentOption] = useState("Bank");
	const [formData, setFormData] = useState({
		bankAccountNumber: "",
		confirmBankAccountNumber: "",
		ifscCode: "",
		phoneNumber: "",
		bankName: "",
		upiId: "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const validateUpiId = (upiId) => {
		const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
		return upiRegex.test(upiId);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (paymentOption === 'Bank') {
			if (formData.bankAccountNumber !== formData.confirmBankAccountNumber) {
				checkAndCreateToast("error", "Bank account numbers do not match.");
				return;
			}
		} else {
			if (!validateUpiId(formData.upiId)) {
				checkAndCreateToast("error", "Please Enter a Valid UPI ID.");
				return;
			}
		}
		const digitsOnly = formData.phoneNumber.replace(/\D/g, '');

		if (digitsOnly.length !== 10) {
			checkAndCreateToast('error', 'Phone number should be 10 digits!');
			return;
		}
		OnSubmit(formData);
	};

	return (
		<div className="fixed inset-0 bg-background/80 flex justify-center items-center z-50 backdrop-blur-sm">
			<div className="bg-card p-6 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border border-border">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-xl font-bold text-foreground">Select Refund Options</h2>
					<button
						onClick={OnClose}
						className="text-muted-foreground hover:text-foreground transition-colors"
					>
						<X size={20} />
					</button>
				</div>

				<div className="mb-6">
					<div className="flex p-1 bg-muted rounded-lg">
						<button
							onClick={() => setPaymentOption('Bank')}
							className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${paymentOption === 'Bank'
								? 'bg-background text-foreground shadow-sm'
								: 'text-muted-foreground hover:text-foreground'
								}`}
						>
							Bank Transfer
						</button>
						<button
							onClick={() => setPaymentOption('UPI')}
							className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${paymentOption === 'UPI'
								? 'bg-background text-foreground shadow-sm'
								: 'text-muted-foreground hover:text-foreground'
								}`}
						>
							UPI
						</button>
					</div>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					{paymentOption === "Bank" && (
						<>
							<div className="space-y-2">
								<Label htmlFor="bankAccountNumber" className="text-foreground">Bank Account Number</Label>
								<Input
									type="password"
									name="bankAccountNumber"
									id="bankAccountNumber"
									placeholder="Enter Account Number"
									value={formData.bankAccountNumber}
									onChange={handleChange}
									required
									className="bg-background border-input text-foreground"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="confirmBankAccountNumber" className="text-foreground">Confirm Account Number</Label>
								<Input
									type="password"
									name="confirmBankAccountNumber"
									id="confirmBankAccountNumber"
									placeholder="Confirm Account Number"
									value={formData.confirmBankAccountNumber}
									onChange={handleChange}
									required
									className="bg-background border-input text-foreground"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="ifscCode" className="text-foreground">IFSC Code</Label>
								<Input
									type="text"
									name="ifscCode"
									id="ifscCode"
									placeholder="Enter IFSC Code"
									value={formData.ifscCode}
									onChange={handleChange}
									required
									className="uppercase bg-background border-input text-foreground"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="bankName" className="text-foreground">Account Holder Name</Label>
								<Input
									type="text"
									name="bankAccountName"
									id="bankName"
									placeholder="Enter Account Holder Name"
									value={formData.bankName}
									onChange={handleChange}
									required
									className="bg-background border-input text-foreground"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="phoneNumber" className="text-foreground">Phone Number</Label>
								<Input
									type="number"
									name="phoneNumber"
									id="phoneNumber"
									placeholder="Enter Linked Phone Number"
									value={formData.phoneNumber}
									onChange={handleChange}
									required
									className="bg-background border-input text-foreground"
								/>
							</div>
						</>
					)}

					{paymentOption === "UPI" && (
						<>
							<div className="space-y-2">
								<Label htmlFor="upiId" className="text-foreground">UPI ID</Label>
								<Input
									type="email"
									name="upiId"
									id="upiId"
									placeholder="username@upi"
									value={formData.upiId}
									onChange={handleChange}
									required
									className="bg-background border-input text-foreground"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="phoneNumber" className="text-foreground">Phone Number</Label>
								<Input
									type="number"
									name="phoneNumber"
									id="phoneNumber"
									placeholder="Enter Phone Number"
									value={formData.phoneNumber}
									onChange={handleChange}
									required
									className="bg-background border-input text-foreground"
								/>
							</div>
						</>
					)}

					<Button
						type="submit"
						className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90"
						size="lg"
					>
						Submit Refund Request
					</Button>
				</form>
			</div>
		</div>
	);
};

export default ReturnsOptionsWindow;