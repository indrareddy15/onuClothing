import React, { useEffect, useRef, useState } from 'react';
import { Allproduct } from '../../action/productaction';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../../Contaxt/LocalStorageContext';
import { X, Search as SearchIcon } from 'lucide-react';
import { Input } from '../ui/input';

const Search = ({ toggleSearchBar }) => {
	const { saveSearchKeywoards, keyWoards, removeKeyWoards } = useLocalStorage();
	const [state, setState] = useState("");
	const dispatch = useDispatch();
	const navigate = useNavigate();
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

	const searchEnter = (e, activeSearch) => {
		e.preventDefault();
		const query = activeSearch || state;
		if (query.trim()) {
			navigate(`/products?keyword=${query}`);
			saveSearchKeywoards(query);
			dispatch(Allproduct());
			if (toggleSearchBar) {
				toggleSearchBar();
			}
		}
	};

	return (
		<div className="w-full relative">
			<form onSubmit={(e) => searchEnter(e, '')} className="relative flex items-center w-full">
				<SearchIcon className="absolute left-3 w-4 h-4 text-gray-400" />
				<Input
					ref={inputRef}
					type="text"
					placeholder="Search for products, brands and more"
					className="w-full pl-10 pr-4 h-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
					value={state}
					onChange={(e) => setState(e.target.value)}
				/>
			</form>

			{filterSearches.length > 0 && state && (
				<div className="absolute top-full left-0 w-full bg-white border border-gray-100 rounded-lg shadow-lg mt-2 py-2 z-50 max-h-64 overflow-y-auto">
					<div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
						Recent Searches
					</div>
					<ul>
						{filterSearches.map((search, index) => (
							<li
								key={index}
								className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 cursor-pointer group"
								onClick={(e) => {
									e.stopPropagation();
									setState(search);
									searchEnter(e, search);
								}}
							>
								<span className="text-sm text-gray-700 group-hover:text-black">{search}</span>
								<button
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										removeKeyWoards(search);
									}}
									className="text-gray-400 hover:text-red-500 transition-colors"
								>
									<X className="w-4 h-4" />
								</button>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

export default Search;
