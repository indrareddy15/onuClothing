import React from 'react'
import accImg from '../../assets/account.jpg'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Orders from '@/components/shopping-view/Orders'
import Address from '@/components/shopping-view/Address'
const ShoppingAccountPage = () => {
    return (
        <div className='flex flex-col min-h-screen bg-gray-50'>
            <div className='relative h-[300px] w-full overflow-hidden'>
                <img
                    src={accImg}
                    alt='accountImg'
                    className='h-full w-full object-cover object-center'
                />
                <div className='absolute inset-0 bg-black/50'></div>
                <div className='absolute inset-0 flex items-center justify-center'>
                    <h1 className='text-4xl font-bold text-white'>My Account</h1>
                </div>
            </div>
            <div className='container mx-auto grid grid-cols-1 gap-8 py-8 px-4'>
                <div className='flex flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
                    <Tabs defaultValue='orders'>
                        <TabsList className="grid w-full grid-cols-2 mb-8">
                            <TabsTrigger value="orders">Orders</TabsTrigger>
                            <TabsTrigger value="address">Address</TabsTrigger>
                        </TabsList>
                        <TabsContent value="orders">
                            <Orders />
                        </TabsContent>
                        <TabsContent value="address">
                            <Address />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}

export default ShoppingAccountPage
