import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '../ui/button'
import { Dialog } from '../ui/dialog'
import OrderDetailsView from './OrderDetailsView'
import { useDispatch, useSelector } from 'react-redux'
import { getAllOrders, getUsersOrdersById, resetOrderDetails } from '@/store/shop/order-slice'
import { Badge } from '../ui/badge'
import { GetBadgeColor } from '@/config'

const Orders = () => {
    const [openDetailsDialogue, setOpenDetailsDialogue] = useState(false);
    const dispatch = useDispatch();
    const {user} = useSelector(state => state.auth);
    const {orderList,orderDetails} = useSelector(state => state.shopOrder);
    useEffect(()=>{
        dispatch(getAllOrders(user?.id));
    },[dispatch])
    console.log("Order List ALL: ",orderList)
    const handleFetchOrderDetails = async(orderId)=>{
        try {
            await dispatch(getUsersOrdersById(orderId));
        } catch (error) {
            console.error("Error fetching order: ",error);
        }
    }
    useEffect(()=>{
        if(orderDetails){
            setOpenDetailsDialogue(true);
        }
    },[orderDetails])
    return (
        <Card>
            <CardHeader>
                <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order Id</TableHead>
                            <TableHead>Order Date</TableHead>
                            <TableHead>Order Status</TableHead>
                            <TableHead>Order Price</TableHead>
                        </TableRow>
                        <TableHead>
                            <span className='sr-only'>Details</span>
                        </TableHead>
                    </TableHeader>
                    <TableBody>
                        {
                            orderList && orderList.length && orderList.map((order) => (
                                <TableRow key={order?._id}>
                                    <TableCell>{order?._id}</TableCell>
                                    <TableCell>{new Date(order?.createdAt).toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Badge className={`justify-center items-center py-1 px-3 ${GetBadgeColor(order?.orderStatus)}`}>{order?.orderStatus}</Badge>
                                    </TableCell>
                                    <TableCell>₹ {order?.totalAmount}</TableCell>
                                    <TableCell>
                                        <Button onClick = {()=> handleFetchOrderDetails(order?._id)}  className='btn btn-primary'>View Details</Button>
                                        <Dialog open = {openDetailsDialogue} onOpenChange={()=>{
                                            setOpenDetailsDialogue(false);
                                            dispatch(resetOrderDetails());
                                        }} >
                                            <OrderDetailsView order={orderDetails} user = {user}/>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                        
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

export default Orders