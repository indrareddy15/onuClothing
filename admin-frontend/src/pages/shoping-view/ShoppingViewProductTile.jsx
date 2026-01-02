import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { brandOptions, categoryOptions } from '@/config'
import React from 'react'

const ShoppingViewProductTile = ({ product, handleGetProductDetails, handleAddToCart, isLoading }) => {
    return (
        <Card className="w-full max-w-[280px] mx-auto bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-300 cursor-pointer group overflow-hidden">
            <div onClick={() => handleGetProductDetails(product?._id)}>
                <div className="relative overflow-hidden">
                    <img
                        src={product?.image}
                        alt={product?.title}
                        className="w-full h-[200px] object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {product?.totalStock <= 0 ? (
                        <Badge className="absolute top-2 left-2 bg-red-600 hover:bg-red-700">Out Of Stock</Badge>
                    ) : (
                        <>
                            {product?.salePrice > 0 && (
                                <Badge className="absolute top-2 left-2 bg-red-600 hover:bg-red-700 rounded-sm">Sale</Badge>
                            )}
                            {product?.totalStock <= 10 && (
                                <Badge className="absolute top-2 left-2 bg-orange-600 hover:bg-orange-700 rounded-sm">
                                    Only {product?.totalStock} left
                                </Badge>
                            )}
                        </>
                    )}
                </div>
                <CardContent className="p-4 space-y-2">
                    <h2 className="text-lg font-bold text-gray-900 line-clamp-2">{product?.title}</h2>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{categoryOptions[product?.category]}</span>
                        <span>{brandOptions[product?.brand]}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`${product?.salePrice > 0 ? 'line-through text-gray-400 text-sm' : 'text-gray-900 text-lg font-semibold'}`}>
                            ₹ {product?.price}
                        </span>
                        {product?.salePrice > 0 && (
                            <span className="text-lg font-semibold text-red-600">
                                ₹ {product?.salePrice}
                            </span>
                        )}
                    </div>
                </CardContent>
            </div>
            <CardFooter className="p-4 pt-0">
                {product?.totalStock > 0 ? (
                    <Button
                        disabled={isLoading}
                        onClick={() => handleAddToCart(product._id, product?.totalStock)}
                        className="w-full btn-primary"
                    >
                        {isLoading ? 'Adding...' : 'Add to Cart'}
                    </Button>
                ) : (
                    <Button disabled className="w-full bg-gray-100 text-gray-400 cursor-not-allowed hover:bg-gray-100">
                        Out Of Stock
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}

export default ShoppingViewProductTile
