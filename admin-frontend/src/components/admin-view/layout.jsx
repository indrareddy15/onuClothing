import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminHeaderLayout from './header'

const AdminViewLayout = ({ user }) => {
	return (
		<div className='flex min-h-screen w-full flex-col bg-gray-50/50'>
			<AdminHeaderLayout user={user} />
			<main className='flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full'>
				<Outlet />
			</main>
		</div>
	)
}

export default AdminViewLayout