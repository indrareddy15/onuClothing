import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { useServerAuth } from '../../Contaxt/AuthContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '../../components/ui/card';
import SuccessAnimation from './SuccessAnimation';

const PaymentSuccess = () => {
	const [seconds, setSeconds] = useState(5);
	const navigate = useNavigate();
	const { userLoading, user } = useServerAuth();

	useEffect(() => {
		sessionStorage.removeItem("checkoutData");
	}, []);

	useEffect(() => {
		if (seconds === 0) {
			navigate('/products');
			return;
		}
		const timerId = setInterval(() => {
			setSeconds((prev) => prev - 1);
		}, 1000);
		return () => clearInterval(timerId);
	}, [seconds, navigate]);

	useEffect(() => {
		if (!user && !userLoading) {
			navigate('/products');
		}
	}, [user, userLoading, navigate]);

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
			<Card className="w-full max-w-md shadow-lg border-gray-100">
				<CardHeader className="flex flex-col items-center space-y-4 pb-2">
					<div className="mb-4">
						<SuccessAnimation />
					</div>
					<h1 className="text-2xl font-bold text-gray-900 text-center">Order Successful!</h1>
				</CardHeader>
				<CardContent className="text-center space-y-4">
					<p className="text-gray-600">
						Thank you for your purchase! Your order has been placed successfully and is being processed.
					</p>
					<div className="bg-gray-100 rounded-lg p-3 text-sm text-gray-700">
						Redirecting to shop in <span className="font-bold text-gray-900">{seconds}</span> seconds...
					</div>
				</CardContent>
				<CardFooter className="flex flex-col gap-3 pt-2">
					<Button
						className="w-full bg-gray-900 hover:bg-gray-800 h-11"
						onClick={() => navigate('/products')}
					>
						Continue Shopping
						<ArrowRight className="ml-2 w-4 h-4" />
					</Button>
					<Button
						variant="outline"
						className="w-full h-11"
						onClick={() => navigate('/dashboard?activetab=Orders-Returns')}
					>
						View Order Details
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
};

export default PaymentSuccess;
