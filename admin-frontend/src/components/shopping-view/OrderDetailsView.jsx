import React, { useState } from 'react'
import { DialogContent, DialogTitle } from '../ui/dialog'
import { Label } from '../ui/label'
import { Separator } from '../ui/separator'
import { Badge } from '../ui/badge'
import { GetBadgeColor } from '@/config'
const initialFormData = {
	status:'',
}
const OrderDetailsView = ({order,user}) => {
	console.log("Order Details: ",order)
	return (
		<DialogContent className = "sm:max-w-[600px]">
			<DialogTitle>Order Details</DialogTitle>
			<div className='grid gap-6'>
				<div className='grid gap-6'>
					<div className='flex mt-6 items-center justify-between'>
						<p className='font-medium'>Order Id</p>
						<Label>{order?._id}</Label>
					</div>
					<div className='flex mt-2 items-center justify-between'>
						<p className='font-medium'>Order Date</p>
						<Label>{new Date(order?.createdAt).toLocaleString()}</Label>
					</div>
					<div className='flex mt-2 items-center justify-between'>
						<p className='font-medium'>Order Status</p>
						<Label>
							<Badge className={`justify-center items-center py-1 px-3 ${GetBadgeColor(order?.orderStatus)}`}>{order?.orderStatus}</Badge>
						</Label>
					</div>
					<div className='flex mt-2 items-center justify-between'>
						<p className='font-medium'>Order Amount</p>
						<Label className = {"text-red-500"}>₹ {order?.totalAmount}</Label>
					</div>
				</div>
				<Separator/>
				<div className='grid gap-4'>
					<div className='grid gap-2'>
						<div className='font-medium'>Order Details</div>
						<ul className='grid gap-3'>
							{
								order?.cartItems?.map((item, index) => (
									<li key={index} className='flex items-center justify-between'>
										<span>{item?.title}</span>
										<span>Quantity: {item?.quantity}</span>
										<span>Price: {item?.price}</span>
									</li>
								))
							}
						</ul>
					</div>
				</div>
				<Separator/>
				<div className='grid gap-4'>
					<div className='grid gap-2'>
						<div className='font-medium'>Shipping Info</div>
						<ul className='grid gap-0.5'>
							<span>Full Name: {user?.userName}</span>
							<span>Address: {order?.address?.address}</span>
							<span>Pin Code: {order?.address?.pinCode}</span>
							<span>Phone Number: {order?.address?.phoneNumber}</span>
							<span>Notes: {order?.address?.notes}</span>
						</ul>
					</div>
				</div>
			</div>
		</DialogContent>
	)
}

export default OrderDetailsView