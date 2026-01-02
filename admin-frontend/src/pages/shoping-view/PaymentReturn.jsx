import { Card, CardHeader } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { verifyingOrder } from '@/store/shop/order-slice';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const PaymentReturn = () => {
	const { toast } = useToast();
	const dispatch = useDispatch();
	const verifyAnyOrdersPayment = async () => {
		try {
			const data = JSON.parse(sessionStorage.getItem("checkoutData"))
			console.log("Session Data:", data)
			const resp = await dispatch(verifyingOrder({
				paymentData: data?.responseResult,
				orderId: data?.orderId,
				cartId: data?.cartId
			}))
			console.log(resp);
			if (resp.payload.result === "SUCCESS") {
				toast({
					title: "Payment Successful",
					description: "Your order has been placed successfully",
				});
				window.location.href = "/shop/payment-success"
			} else {
				window.location.href = "/shop/payment-failed"
			}
		} catch (error) {
			console.error(`Error Verifying order`)
		}
	}
	useEffect(() => {
		verifyAnyOrdersPayment();
	}, [])
	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50 p-4">
			<Card className="p-10 w-full max-w-md text-center space-y-6 border border-gray-200 shadow-lg">
				<CardHeader className="p-0">
					<div className="mx-auto w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mb-4"></div>
					<h2 className="text-2xl font-bold text-gray-900">Processing Payment...</h2>
					<p className="text-gray-500">Please wait while we verify your payment.</p>
				</CardHeader>
			</Card>
		</div>
	)
}

export default PaymentReturn