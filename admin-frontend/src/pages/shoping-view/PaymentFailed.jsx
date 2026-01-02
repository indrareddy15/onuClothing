import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
import { useNavigate } from 'react-router-dom';

const PaymentFailed = () => {
	const navigate = useNavigate();
	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50 p-4">
			<Card className="p-10 w-full max-w-md text-center space-y-6 border border-gray-200 shadow-lg">
				<CardHeader className="p-0">
					<div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
						<svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
						</svg>
					</div>
					<CardTitle className="text-3xl font-bold text-gray-900">
						Payment Failed
					</CardTitle>
					<p className="text-gray-500 mt-2">Something went wrong with your transaction.</p>
				</CardHeader>
				<Button className="w-full btn-primary" onClick={() => navigate('/shop/checkout')}>
					Try Again
				</Button>
			</Card>
		</div>
	)
}

export default PaymentFailed