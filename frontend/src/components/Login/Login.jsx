import React, { Fragment, useEffect, useRef, useState } from 'react';
import './Login.css';
import { useDispatch } from 'react-redux';
import { loginmobile } from '../../action/useraction';
import { Link, useNavigate } from 'react-router-dom';
import { addItemArrayBag, createAndSendProductsArrayWishList } from '../../action/orderaction';
import { ImFacebook, ImGoogle, ImInstagram, ImTwitter } from 'react-icons/im';
import { useSessionStorage } from '../../Contaxt/SessionStorageContext';
import { X, ArrowRight, Loader2 } from 'lucide-react';
import { useSettingsContext } from '../../Contaxt/SettingsContext';
import { useServerWishList } from '../../Contaxt/ServerWishListContext';
import { useServerAuth } from '../../Contaxt/AuthContext';
import { Button } from '../../components/ui/button.jsx';
import { Input } from '../../components/ui/input.jsx';
import { Label } from '../../components/ui/label.jsx';
import LoginBG from '../images/Login_BG.png';

const Login = () => {
	const [isUpdating, setIsUpdating] = useState(false);
	const [loginInput, setLoginInput] = useState('');

	const { sessionData, sessionBagData } = useSessionStorage();
	const { fetchWishList, fetchBag } = useServerWishList();
	const { user, checkAuthUser } = useServerAuth();
	const dispatch = useDispatch();
	const navigation = useNavigate();
	const { checkAndCreateToast } = useSettingsContext();

	const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginInput);
	const isPhone = /^[0-9]{10}$/.test(loginInput);

	const continues = async (event) => {
		event.preventDefault();
		setIsUpdating(true);

		if (!isEmail && !isPhone) {
			checkAndCreateToast("error", 'Enter a valid email or 10-digit phone number');
			setIsUpdating(false);
			return;
		}

		try {
			const response = await dispatch(
				loginmobile({
					LoginData: loginInput
				})
			);

			const { success, message, result } = response;
			if (success) {
				checkAndCreateToast("success", "OTP sent successfully");
				navigation('/verifying', { state: { email: result.email, phoneNumber: result.phoneNumber } });
			} else {
				if (message === 'No User Found') {
					checkAndCreateToast("error", "Please Create an Account!", 1000);
					navigation('/registeruser');
					return;
				}
				checkAndCreateToast("error", message);
			}
		} catch (error) {
			checkAndCreateToast("error", 'Failed to login');
			console.error("Login error:", error);
		} finally {
			setIsUpdating(false);
		}
	};

	useEffect(() => {
		if (user) {
			navigation(-1);
		}
	}, [user]);

	return (
		<div className="h-screen w-full flex font-kumbsan relative overflow-hidden">
			{/* Background Image - Visible on all screens, acts as background for mobile */}
			<div className="absolute inset-0 lg:static lg:w-1/2 bg-black text-white flex flex-col justify-end items-center p-12 pb-24 overflow-hidden">
				<div
					className="absolute inset-0 bg-cover lg:opacity-40 opacity-60"
					style={{ backgroundImage: `url(${LoginBG})`, backgroundPosition: 'center 25%' }}
				></div>
				<div className="relative z-10 max-w-md text-center hidden lg:block">
					<h1 className="text-5xl font-bold mb-6 tracking-tight">Hey, welcome back to ON U ✨</h1>
					<p className="text-xl text-gray-200 mb-8">
						Explore new vibes, trending fits, and curated picks made just for you.
					</p>
				</div>
			</div>

			{/* Right Side - Login Form */}
			<div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10 overflow-y-auto h-full">
				<div className="w-full max-w-md space-y-8 bg-black/30 backdrop-blur-xl lg:bg-white p-8 rounded-[2rem] lg:rounded-2xl shadow-2xl lg:shadow-none border border-white/10 lg:border-none">
					<div className="text-center lg:text-left">
						<h2 className="text-3xl font-bold text-white lg:text-gray-900 tracking-tight">Sign in to your account</h2>
						<p className="mt-2 text-sm text-gray-300 lg:text-gray-600">
							Or{' '}
							<Link to="/registeruser" className="font-medium text-white lg:text-black hover:underline">
								create a new account
							</Link>
						</p>
					</div>

					<form onSubmit={continues} className="mt-8 space-y-6">
						<div className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="loginInput" className="text-sm font-medium text-gray-300 lg:text-gray-700">
									Email or Phone Number
								</Label>
								<Input
									id="loginInput"
									type="text"
									required
									value={loginInput}
									onChange={(e) => setLoginInput(e.target.value)}
									placeholder="name@example.com or 9876543210"
									className="h-12 bg-white/10 lg:bg-white text-white lg:text-black border-white/20 lg:border-gray-200 placeholder:text-gray-400"
								/>
							</div>
						</div>

						<div className="flex items-center justify-between text-sm">
							<div className="flex items-center">
								<input
									id="remember-me"
									name="remember-me"
									type="checkbox"
									className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
								/>
								<label htmlFor="remember-me" className="ml-2 block text-white lg:text-gray-900">
									Remember me
								</label>
							</div>
							<div className="text-sm">
								<Link to="/contact" className="font-medium text-gray-300 lg:text-gray-600 hover:text-white lg:hover:text-black">
									Need help?
								</Link>
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
									Sign In <ArrowRight className="w-4 h-4" />
								</span>
							)}
						</Button>

						<div className="relative my-8">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-white/20 lg:border-gray-300"></div>
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-2 bg-transparent lg:bg-white text-gray-300 lg:text-gray-500">Or continue with</span>
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
							By clicking continue, you agree to our{' '}
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

export default Login;
