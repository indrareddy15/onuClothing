import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const PaymentSuccess = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50 p-4">
      <Card className="p-10 w-full max-w-md text-center space-y-6 border border-gray-200 shadow-lg">
        <CardHeader className="p-0">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">
            Payment Successful!
          </CardTitle>
          <p className="text-gray-500 mt-2">Your order has been placed successfully.</p>
        </CardHeader>
        <Button className="w-full btn-primary" onClick={() => navigate('/shop/account')}>
          View Orders
        </Button>
      </Card>
    </div>
  )
}

export default PaymentSuccess	