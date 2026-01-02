import React from 'react'
import { Card, CardContent, CardFooter } from '../ui/card'
import { Label } from '../ui/label'
import { Button } from '../ui/button'

const AddressCard = ({addressInfo,handleDeleteAddress,handleEditAddress,setCurrentSelectedAddress,selectedAddressCard}) => {
	console.log(selectedAddressCard?._id === addressInfo?._id);
	return (
		<Card onClick = {()=> setCurrentSelectedAddress ? setCurrentSelectedAddress(addressInfo) : null} className = "cursor-pointer ">
			<CardContent className = {`grid gap-4 ${selectedAddressCard?._id === addressInfo?._id ? "border-blue-600 border":''}`}>
				<div className='flex flex-col gap-2 pt-6'>
					<Label>Address: {addressInfo?.address}</Label>
					<Label>City: {addressInfo?.city}</Label>
					<Label>State: {addressInfo?.state}</Label>
					<Label>PinCode: {addressInfo?.pinCode}</Label>
					<Label>Country: {addressInfo?.country}</Label>
					<Label>PhoneNumber: {addressInfo?.phoneNumber}</Label>
					<Label>Notes: {addressInfo?.notes}</Label>
				</div>
			</CardContent>
			<CardFooter className = "flex justify-between items-center p-3">
                <Button onClick = {()=> handleEditAddress(addressInfo)}>Edit</Button>
                <Button onClick = {()=> handleDeleteAddress(addressInfo?._id)}>Delete</Button>
            </CardFooter>
		</Card>
	)
}

export default AddressCard