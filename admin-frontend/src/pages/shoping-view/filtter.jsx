import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { filterOptions } from '@/config'
import React, { Fragment } from 'react'

const ProductFilter = ({ filters, handleFilters }) => {
    return (
        <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
            <div className='p-4 border-b border-gray-200'>
                <h2 className='text-lg font-bold text-gray-900'>Filters</h2>
            </div>
            <div className='p-4 space-y-6'>
                {
                    Object.keys(filterOptions).map((keyItems, i) => (
                        <Fragment key={i}>
                            <div>
                                <h3 className='text-sm font-semibold text-gray-900 mb-3 capitalize'>
                                    {keyItems}
                                </h3>
                                <div className="grid gap-2">
                                    {
                                        filterOptions[keyItems].map((option, l) => (
                                            <Label key={l} className="flex items-center gap-2 font-medium text-gray-600 hover:text-gray-900 cursor-pointer">
                                                <Checkbox
                                                    className="border-gray-300 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900"
                                                    checked={
                                                        filters && Object.keys(filters).length > 0 && filters[keyItems] && filters[keyItems].indexOf(option.id) > -1
                                                    }
                                                    onCheckedChange={(checked) => handleFilters(keyItems, option.id)} />
                                                {
                                                    option.label
                                                }
                                            </Label>
                                        ))
                                    }
                                </div>
                            </div>
                            {i < Object.keys(filterOptions).length - 1 && <Separator className="bg-gray-100" />}
                        </Fragment>
                    ))
                }
            </div>
        </div>
    )
}

export default ProductFilter