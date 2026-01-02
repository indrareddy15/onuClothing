import React from 'react'
import { Outlet } from 'react-router-dom'
import ShoppingViewHeader from './shoppingViewHeader'
import Footer from './Footer'

const ShoppingViewLayout = () => {
    return (
        <div className="flex flex-col bg-white overflow-hidden">
            <div className="sticky top-0 z-50">
                <ShoppingViewHeader />
            </div>
            <main className="flex flex-col w-full">
                <Outlet />
            </main>
            <Footer />
        </div>

    )
}

export default ShoppingViewLayout