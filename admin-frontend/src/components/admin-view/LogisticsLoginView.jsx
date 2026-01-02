import React, { useState } from 'react'
import { DialogContent, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import axios from 'axios';
import { BASE_URL, Header } from '@/config';
import { useSettingsContext } from '@/Context/SettingsContext';
const defaultView = {
	email: '', password: ''
}
const LogisticsLoginView = ({OnLoginComplete})=>{
	const{checkAndCreateToast} = useSettingsContext();
	const[logisticsLoginForm,setLogisticsLoginForm] = useState(defaultView);
	const handleLogisticsTokenChange = async(e) => {
		e.preventDefault();
		try {
			// const response = await axios.post(`${BASE_URL}/api/logistic/login`,logisticsLoginForm,Header())
			const response = await axios.post(`${BASE_URL}/api/logistic/login`,logisticsLoginForm,Header())
			if(response){
				console.log("Logistics Login Response: ", response?.data?.result);
				OnLoginComplete(response?.data?.result);
				checkAndCreateToast("success","Logged In Success" );
				setLogisticsLoginForm(defaultView);
			}else{
				checkAndCreateToast("error","Invalid Email or Password");
			}
		} catch (error) {
			console.error ("Error logging in logistics: ", error);
			checkAndCreateToast("error","Error logging in logistics");
		}
	}
	return(
		<DialogContent className="sm:max-w-[600px] h-fit p-8 bg-white rounded-lg shadow-lg">
			<DialogTitle className="text-2xl font-semibold mb-6 text-gray-800 text-center">Generate Shiprockt Logistics API Token</DialogTitle>
			<p className="text-gray-700 text-lg">Note: After Every 10 days Please enter your email and password to Re-login Shiprocket logistics user.</p>
			<form onSubmit={handleLogisticsTokenChange} className="flex flex-col space-y-4">
				<Input
					value={logisticsLoginForm?.email}
					onChange={(e)=> setLogisticsLoginForm({...logisticsLoginForm, email: e.target.value})}
					type="email"
					placeholder="Email"
					required
					className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
				<Input
					value={logisticsLoginForm?.password}
					onChange={(e)=> setLogisticsLoginForm({...logisticsLoginForm, password: e.target.value})}
					type="password"
					placeholder="Password"
					required
					className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
				<Button
					type="submit"
					className="py-3 bg-black text-white font-semibold rounded-md hover:bg-gray-800 transition duration-200 ease-in-out"
				>
					Login
				</Button>
			</form>
		</DialogContent>

	)
}

export default LogisticsLoginView
