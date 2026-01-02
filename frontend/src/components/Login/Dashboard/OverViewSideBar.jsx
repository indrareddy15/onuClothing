import React from 'react';
import { User, ShoppingBag, MapPin } from 'lucide-react';
import { Card, CardContent } from '../../ui/card';

const OverViewSideBar = ({ activeSection, onChange }) => {
	const menuItems = [
		{ id: 'User-Details', label: 'Profile Information', icon: User },
		{ id: 'Orders-Returns', label: 'Orders & Returns', icon: ShoppingBag },
		{ id: 'Saved-Addresses', label: 'Saved Addresses', icon: MapPin },
	];

	return (
		<Card className="w-full border-none shadow-none lg:border lg:shadow-sm bg-transparent lg:bg-card">
			<CardContent className="p-0 lg:p-2">
				<nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
					{menuItems.map((item) => (
						<button
							key={item.id}
							onClick={() => onChange(item.id)}
							className={`flex-shrink-0 lg:w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-all duration-200 ${activeSection === item.id
								? 'bg-primary text-primary-foreground shadow-md'
								: 'bg-card lg:bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground border lg:border-none'
								}`}
						>
							<item.icon className={`w-4 h-4 ${activeSection === item.id ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'}`} />
							{item.label}
						</button>
					))}
				</nav>
			</CardContent>
		</Card>
	);
};

export default OverViewSideBar;
