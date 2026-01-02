import axios from 'axios';
import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { BASE_API_URL } from '../config';

const TrackVisite = () => {
	const location = useLocation();
	const getClientIP = async () => {
		try {
			const response = await axios.get('https://api.ipify.org?format=json');
			
			return response.data.ip;
		} catch (error) {
			console.error('Error getting client IP:', error);
		}
	};
	const checkWebsiteVisit = async()=>{
		try {
			const ip =  await getClientIP();
			console.log('Client IP address:', ip);
			const response =  await axios.post(`${BASE_API_URL}/api/common/stats/track-visit`, {
				page: location.pathname // Track which page the user is visiting
			},{
				headers: {
					'x-forwarded-for': ip // Replace with actual IP if needed
				}
			})
			console.log("Website visit tracked",response.data);
		} catch (error) {
			console.error("Error checking website visit: ",error);
		}
		
	}
	useEffect(()=>{
		checkWebsiteVisit();
	},[])
	return (
		<div>
			
		</div>
	)
}

export default TrackVisite
