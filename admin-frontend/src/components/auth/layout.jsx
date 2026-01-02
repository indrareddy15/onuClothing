import React from 'react'
import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
	return (
		<div className='flex min-h-screen w-full'>
			<div className='hidden lg:flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 w-1/2 px-12 animate-fadeIn'>
				<div className='max-w-md space-y-6 text-white text-center animate-slideUp'>
					<h1 className='text-4xl font-extrabold tracking-tight leading-tight'>
						Welcome to <span className="text-gray-300">On U</span>
					</h1>
					<p className="text-lg text-gray-400">
						Manage your store with ease and style.
					</p>
				</div>
			</div>
			<div className='flex flex-1 justify-center bg-background px-4 py-12 sm:px-6 lg:px-8'>
				<Outlet />
			</div>
		</div>
	)
}

export default AuthLayout