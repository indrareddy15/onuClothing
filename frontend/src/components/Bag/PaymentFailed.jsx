import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, RefreshCcw, ShoppingBag } from 'lucide-react';
import { useServerAuth } from '../../Contaxt/AuthContext';
import { useSettingsContext } from '../../Contaxt/SettingsContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '../../components/ui/card';

const PaymentFailed = () => {
	const navigate = useNavigate();
	const { userLoading, user } = useServerAuth();
	const { checkAndCreateToast } = useSettingsContext();

	useEffect(() => {
		if (!user && !userLoading) {
			checkAndCreateToast('error', 'Please Login to check for Payment Status');
			navigate('/products');
		}
	}, [user, userLoading, navigate, checkAndCreateToast]);

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
			<Card className="w-full max-w-md shadow-lg border-gray-100">
				<CardHeader className="flex flex-col items-center space-y-4 pb-2">
					<div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-2">
						<XCircle className="w-10 h-10 text-red-600" strokeWidth={2} />
					</div>
					<h1 className="text-2xl font-bold text-gray-900 text-center">Payment Failed</h1>
				</CardHeader>
				<CardContent className="text-center space-y-4">
					<p className="text-gray-600">
						Oops! Something went wrong with your transaction. Your payment could not be processed.
					</p>
					<div className="bg-red-50 border border-red-100 rounded-lg p-3 text-sm text-red-700">
						Please try again or use a different payment method.
					</div>
				</CardContent>
				<CardFooter className="flex flex-col gap-3 pt-2">
					<Button
						className="w-full bg-red-600 hover:bg-red-700 h-11 text-white"
						onClick={() => navigate('/bag/checkout')}
					>
						<RefreshCcw className="mr-2 w-4 h-4" />
						Try Again
					</Button>
					<Button
						variant="outline"
						className="w-full h-11"
						onClick={() => navigate('/bag')}
					>
						<ShoppingBag className="mr-2 w-4 h-4" />
						Return to Bag
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
};

export default PaymentFailed;
