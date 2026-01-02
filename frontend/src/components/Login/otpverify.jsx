import React, { Fragment, useState, useEffect, useRef } from 'react'
import './Login.css'
import { otpverifie, resendotp } from '../../action/useraction'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSettingsContext } from '../../Contaxt/SettingsContext'
import { ArrowRight, Loader2, ShieldCheck } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { InputOTP } from '../../components/ui/input-otp'
import LoginBG from '../images/Login_BG.png';

const Otpverify = () => {
	const navigation = useNavigate()
	const dispatch = useDispatch()
	const [isUpdating, setIsUpdating] = useState(false);
	const { checkAndCreateToast } = useSettingsContext();
	const [otp, setotp] = useState('')
	const { user, error, loading } = useSelector(state => state.Registeruser)
	const { userVerify } = useSelector(state => state.userdetails)
	const location = useLocation();
	const { email: ReceivedUserEmail, phoneNumber: ReceivedUserPhoneNumber } = location.state || {};

	const continues = async (e) => {
		setIsUpdating(true);
		e.preventDefault();
		const response = await dispatch(otpverifie({ otp: otp, email: ReceivedUserEmail, phoneNumber: ReceivedUserPhoneNumber }))
		setIsUpdating(false);
		if (response?.success) {
			checkAndCreateToast("success", "Verification Successful")
			navigation('/');
		} else {
			checkAndCreateToast("error", 'invalid Otp')
		}
		if (error) {
			checkAndCreateToast("error", error);
		}
	}

	const Resndotp = async () => {
		setIsUpdating(true);
		if (ReceivedUserEmail) {
			const response = await dispatch(resendotp({ email: ReceivedUserEmail, phoneNumber: ReceivedUserPhoneNumber }))
			if (!response.success) {
				checkAndCreateToast("error", 'invalid Otp')
				return
			}
			checkAndCreateToast("success", "Otp Successfully Resent");
		} else {
			checkAndCreateToast("error", "otp Failed to Resent! no User found!")
		}
		setIsUpdating(false);
	}

	useEffect(() => {
		if (!ReceivedUserPhoneNumber || !ReceivedUserEmail) {
			navigation(-1);
		}
	}, [location])

	useEffect(() => {
		if (userVerify) {
			if (userVerify.verify === "verified") {
				navigation('/')
			}
		}
	}, [userVerify, user, loading, navigation, checkAndCreateToast]);

	const handleOtpChange = (value) => {
		setotp(value);
	};

	return (
		<div className="h-screen w-full flex font-kumbsan relative overflow-hidden">
			{/* Background Image - Visible on all screens, acts as background for mobile */}
			<div className="absolute inset-0 lg:static lg:w-1/2 bg-black text-white flex flex-col justify-end items-center p-12 pb-24 overflow-hidden">
				<div
					className="absolute inset-0 bg-cover lg:opacity-30 opacity-60"
					style={{ backgroundImage: `url(${LoginBG})`, backgroundPosition: 'center 25%' }}
				></div>
				<div className="relative z-10 max-w-md text-center hidden lg:block">
					<div className="mx-auto bg-white/10 w-20 h-20 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm">
						<ShieldCheck className="w-10 h-10 text-white" />
					</div>
					<h1 className="text-4xl font-bold mb-6 tracking-tight">Secure Verification</h1>
					<p className="text-xl text-gray-200 mb-8">
						To protect your account, please verify your identity by entering the code sent to your device.
					</p>
				</div>
			</div>

			{/* Right Side - OTP Form */}
			<div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 relative z-10 overflow-y-auto h-full">
				<div className="w-full max-w-md space-y-6 sm:space-y-8 bg-black/30 backdrop-blur-xl lg:bg-white p-6 sm:p-8 rounded-[2rem] lg:rounded-2xl shadow-2xl lg:shadow-none border border-white/10 lg:border-none">
					<div className="text-center lg:text-left">
						<h2 className="text-2xl sm:text-3xl font-bold text-white lg:text-gray-900 tracking-tight">Enter verification code</h2>
						<p className="mt-2 text-sm sm:text-base text-gray-300 lg:text-gray-600">
							We've sent a code to <span className="font-medium text-white lg:text-black break-all">{ReceivedUserEmail}</span>
						</p>
					</div>

					<form onSubmit={continues} className="mt-6 sm:mt-8 space-y-6 sm:space-y-8">
						<div className="w-full px-2 sm:px-0">
							<InputOTP
								maxLength={6}
								value={otp}
								onChange={handleOtpChange}
								variant="standard"
								className="border-white/20 lg:border-gray-300 focus:border-white lg:focus:border-black bg-white/10 lg:bg-white text-white lg:text-black"
							/>
						</div>

						<div className="flex flex-col gap-3 sm:gap-4">
							<Button
								disabled={isUpdating || otp.length !== 6}
								type="submit"
								size="lg"
								className="w-full h-11 sm:h-12 text-sm sm:text-base bg-white lg:bg-black hover:bg-gray-100 lg:hover:bg-gray-800 text-black lg:text-white transition-all duration-200"
							>
								{isUpdating ? (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								) : (
									<span className="flex items-center justify-center gap-2">
										Verify Account <ArrowRight className="w-4 h-4" />
									</span>
								)}
							</Button>

							<div className="text-center">
								<button
									type="button"
									onClick={Resndotp}
									disabled={isUpdating}
									className="text-sm sm:text-base font-medium text-gray-300 lg:text-gray-600 hover:text-white lg:hover:text-black hover:underline disabled:opacity-50 touch-manipulation"
								>
									Didn't receive the code? Resend
								</button>
							</div>
						</div>

						<div className="relative my-6 sm:my-8">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-white/20 lg:border-gray-300"></div>
							</div>
							<div className="relative flex justify-center text-xs sm:text-sm">
								<span className="px-2 bg-black/30 lg:bg-white text-gray-300 lg:text-gray-500">Need help?</span>
							</div>
						</div>

						<p className="text-center text-xs sm:text-sm text-gray-300 lg:text-gray-600">
							Having trouble?{' '}
							<Link to="/contact" className="font-medium text-white lg:text-black hover:underline touch-manipulation">
								Contact Support
							</Link>
						</p>
					</form>
				</div>
			</div>
		</div>
	)
}

export default Otpverify
