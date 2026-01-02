import React, { useEffect, useRef, useState } from 'react';
import { useLocalStorage } from '../../../Contaxt/LocalStorageContext';
import { X, Search, ArrowLeft } from 'lucide-react';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';

const MKeywoardSerach = ({ setserdiv, state, setstate, searchenter, searchenters }) => {
	const { keyWoards, removeKeyWoards } = useLocalStorage();
	const [filterSearches, setFilterSearches] = useState(keyWoards);
	const inputRef = useRef(null);

	useEffect(() => {
		setFilterSearches(keyWoards.filter(search =>
			search.toLowerCase().includes(state.toLowerCase())
		));
	}, [keyWoards, state]);

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
	}, []);

	const applySerach = (e) => {
		searchenter(e);
	};

	const startSerach = (e, activeSearch) => {
		e.preventDefault();
		searchenters(activeSearch);
	};

	return (
		<div className="fixed inset-0 z-50 bg-white flex flex-col">
			{/* Search Header */}
			<div className="flex items-center gap-2 p-2 border-b">
				<Button variant="ghost" size="icon" onClick={() => setserdiv('hidden')}>
					<ArrowLeft className="w-6 h-6 text-gray-900" />
				</Button>
				<div className="flex-1 relative">
					<Input
						ref={inputRef}
						type="text"
						value={state}
						placeholder="Search for products"
						className="w-full pl-4 pr-10 h-10 bg-gray-50 border-none focus:ring-0"
						onChange={(e) => setstate(e.target.value)}
						onKeyUp={applySerach}
					/>
				</div>
				<Button variant="ghost" size="icon" onClick={(e) => startSerach(e, state)}>
					<Search className="w-6 h-6 text-gray-900" />
				</Button>
			</div>

			{/* Recent Searches */}
			<div className="flex-1 overflow-y-auto bg-gray-50">
				{filterSearches.length > 0 && (
					<div className="bg-white mt-2 shadow-sm">
						<div className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">
							Recent Searches
						</div>
						<ul>
							{filterSearches.map((search, index) => (
								<li
									key={index}
									className="flex items-center justify-between px-4 py-3 border-b last:border-0 hover:bg-gray-50 active:bg-gray-100 cursor-pointer"
									onClick={(e) => {
										e.stopPropagation();
										setstate(search);
										startSerach(e, search);
									}}
								>
									<span className="text-sm text-gray-900">{search}</span>
									<button
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();
											removeKeyWoards(search);
										}}
										className="p-2 -mr-2 text-gray-400 hover:text-red-500"
									>
										<X className="w-4 h-4" />
									</button>
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
		</div>
	);
};

export default MKeywoardSerach;
