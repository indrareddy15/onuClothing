import React from 'react'
import { Button } from '../ui/button'
import { Star } from 'lucide-react'

const StarRating = ({rating,handleRatingChange}) => {
	return (
		[1,2,3,4,5].map((r,i)=>(
			<Button onClick = {()=> {
				if(handleRatingChange){
					handleRatingChange(r)
				}
			}} variant = "outline" size = "icon" key={i} className={`star ${r <= Math.floor(i/2) + (i%2 === 0? '.5' : '')} ${r <= rating ? 'text-yellow-200' :'text-black hover:text-primary-foreground hover:bg-primary'} p-2 rounded-full transition-colors`}>
				<Star className={`rating ${r <= rating ? "fill-yellow-500":'fill-none'}`}/>
			</Button>
		))
	)
}

export default StarRating