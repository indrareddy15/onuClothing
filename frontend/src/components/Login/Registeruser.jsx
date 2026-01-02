import React, { useState, useEffect } from 'react';
import './Login.css';
import { clearErrors, registerUser } from '../../action/useraction';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ImFacebook, ImGoogle, ImInstagram, ImTwitter } from 'react-icons/im';
import { useSettingsContext } from '../../Contaxt/SettingsContext';
import { Input } from '../../components/ui/input.jsx';
import { Button } from '../../components/ui/button.jsx';
import { Label } from '../../components/ui/label.jsx';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { ArrowRight, Loader2 } from 'lucide-react';
import LoginBG from '../images/Login_BG.png';

const Registeruser = () => {
	const { checkAndCreateToast } = useSettingsContext();
	const [isUpdating, setIsUpdating] = useState(false);
	const navigation = useNavigate();
	const { error, loading } = useSelector(state => state.Registeruser);
	const [name, setname] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [gender, setgender] = useState('');
	const [email, setemail] = useState('');
	const dispatch = useDispatch();

	const onsubmit = async (e) => {
		setIsUpdating(true);
		e.preventDefault();
		if (!name || !phoneNumber || !gender || !email) {
			checkAndCreateToast('error', 'All Fields are required!');
			return;
		}
		// Remove non-digit characters from phoneNumber
		const digitsOnly = phoneNumber.replace(/\D/g, '');

		// Check if the length is greater than 10
		if (digitsOnly.length !== 10) {
			checkAndCreateToast('error', 'Phone number should be 10 digits or fewer!');
			setIsUpdating(false);
			return;
		}
		const myForm = {
			phonenumber: phoneNumber,
			name: name,
			gender: gender,
			email: email,
		};
		const registerUserResponse = await dispatch(registerUser(myForm));
		setIsUpdating(false);
		const { user: ReceivedUser } = registerUserResponse;
		if (ReceivedUser) {
			if (ReceivedUser.verify === 'verified') {
				checkAndCreateToast('success', 'You are Already Registered!');
				navigation('/Login');
				return;
			}
			navigation('/verifying', { state: { email: ReceivedUser.email, phoneNumber: ReceivedUser.phoneNumber } });
		} else {
			checkAndCreateToast('error', 'Failed to Register! Please try again');
		}
	};

	useEffect(() => {
		if (error) {
			dispatch(clearErrors());
		}
	}, [error, dispatch]);

	return (
		<div className="h-screen w-full flex font-kumbsan relative overflow-hidden">
			{/* Background Image - Visible on all screens, acts as background for mobile */}
			<div className="absolute inset-0 lg:static lg:w-1/2 bg-black text-white flex flex-col justify-end items-center p-12 pb-24 overflow-hidden">
				<div
					className="absolute inset-0 bg-cover lg:opacity-40 opacity-60"
					style={{ backgroundImage: `url(${LoginBG})`, backgroundPosition: 'center 25%' }}
				></div>
				<div className="relative z-10 max-w-md text-center hidden lg:block">
					<h1 className="text-5xl font-bold mb-6 tracking-tight">Hop in, ON U crew..!</h1>
					<p className="text-xl text-gray-200 mb-8">
						Join to snag member only perks, early drops, and custom recommendations.
					</p>
				</div>
			</div>

			{/* Right Side - Registration Form */}
			<div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10 overflow-y-auto h-full">
				<div className="w-full max-w-md space-y-8 bg-black/30 backdrop-blur-xl lg:bg-white p-8 rounded-[2rem] lg:rounded-2xl shadow-2xl lg:shadow-none border border-white/10 lg:border-none">
					<div className="text-center lg:text-left">
						<h2 className="text-3xl font-bold text-white lg:text-gray-900 tracking-tight">Create an account</h2>
						<p className="mt-2 text-sm text-gray-300 lg:text-gray-600">
							Already have an account?{' '}
							<Link to="/Login" className="font-medium text-white lg:text-black hover:underline">
								Sign in
							</Link>
						</p>
					</div>

					<form onSubmit={onsubmit} className="mt-8 space-y-6">
						<div className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="name" className="text-gray-300 lg:text-gray-700">Full Name</Label>
								<Input
									id="name"
									type="text"
									required
									placeholder="John Doe"
									value={name}
									onChange={(e) => setname(e.target.value)}
									className="h-12 bg-white/10 lg:bg-white text-white lg:text-black border-white/20 lg:border-gray-200 placeholder:text-gray-400"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="email" className="text-gray-300 lg:text-gray-700">Email Address</Label>
								<Input
									id="email"
									type="email"
									required
									placeholder="name@example.com"
									onChange={(e) => setemail(e.target.value)}
									className="h-12 bg-white/10 lg:bg-white text-white lg:text-black border-white/20 lg:border-gray-200 placeholder:text-gray-400"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="PhoneNumber" className="text-gray-300 lg:text-gray-700">Phone Number</Label>
								<Input
									id="PhoneNumber"
									type="number"
									required
									placeholder="9876543210"
									value={phoneNumber}
									onChange={(e) => setPhoneNumber(e.target.value)}
									className="h-12 bg-white/10 lg:bg-white text-white lg:text-black border-white/20 lg:border-gray-200 placeholder:text-gray-400"
								/>
							</div>

							<div className="space-y-3 pt-2">
								<Label className="text-gray-300 lg:text-gray-700">Gender</Label>
								<RadioGroup value={gender} onValueChange={setgender} className="grid grid-cols-2 gap-4">
									<div className="flex items-center space-x-2 border border-white/20 lg:border-gray-200 rounded-lg p-3 hover:bg-white/10 lg:hover:bg-gray-50/50 cursor-pointer transition-colors bg-white/10 lg:bg-white">
										<RadioGroupItem value="Men" id="men" className="text-white lg:text-black border-white lg:border-black" />
										<Label htmlFor="men" className="cursor-pointer flex-1 text-white lg:text-black">Men</Label>
									</div>
									<div className="flex items-center space-x-2 border border-white/20 lg:border-gray-200 rounded-lg p-3 hover:bg-white/10 lg:hover:bg-gray-50/50 cursor-pointer transition-colors bg-white/10 lg:bg-white">
										<RadioGroupItem value="Women" id="women" className="text-white lg:text-black border-white lg:border-black" />
										<Label htmlFor="women" className="cursor-pointer flex-1 text-white lg:text-black">Women</Label>
									</div>
								</RadioGroup>
							</div>
						</div>

						<Button
							disabled={isUpdating}
							type="submit"
							className="w-full h-12 bg-white lg:bg-black hover:bg-gray-100 lg:hover:bg-gray-800 text-black lg:text-white transition-all duration-200"
						>
							{isUpdating ? (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							) : (
								<span className="flex items-center justify-center gap-2">
									Create Account <ArrowRight className="w-4 h-4" />
								</span>
							)}
						</Button>

						<div className="relative my-8">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-white/20 lg:border-gray-300"></div>
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-2 bg-transparent lg:bg-white text-gray-300 lg:text-gray-500">Or sign up with</span>
							</div>
						</div>

						<div className="grid grid-cols-4 gap-4">
							<button type="button" className="flex justify-center items-center py-3 border border-white/20 lg:border-gray-300 rounded-lg hover:bg-white/10 lg:hover:bg-gray-50 transition-colors bg-white/10 lg:bg-white">
								<ImGoogle className="text-xl text-red-600" />
							</button>
							<button type="button" className="flex justify-center items-center py-3 border border-white/20 lg:border-gray-300 rounded-lg hover:bg-white/10 lg:hover:bg-gray-50 transition-colors bg-white/10 lg:bg-white">
								<ImFacebook className="text-xl text-blue-600" />
							</button>
							<button type="button" className="flex justify-center items-center py-3 border border-white/20 lg:border-gray-300 rounded-lg hover:bg-white/10 lg:hover:bg-gray-50 transition-colors bg-white/10 lg:bg-white">
								<ImTwitter className="text-xl text-blue-400" />
							</button>
							<button type="button" className="flex justify-center items-center py-3 border border-white/20 lg:border-gray-300 rounded-lg hover:bg-white/10 lg:hover:bg-gray-50 transition-colors bg-white/10 lg:bg-white">
								<ImInstagram className="text-xl text-pink-600" />
							</button>
						</div>

						<p className="text-xs text-center text-gray-400 lg:text-gray-500 mt-8">
							By creating an account, you agree to our{' '}
							<Link to="/tc" className="underline hover:text-white lg:hover:text-gray-900">Terms of Service</Link>{' '}
							and{' '}
							<Link to="/privacyPolicy" className="underline hover:text-white lg:hover:text-gray-900">Privacy Policy</Link>.
						</p>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Registeruser;
