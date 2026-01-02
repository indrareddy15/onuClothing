import { createContext, useContext, useEffect, useState } from "react";


const LocalStorageContext = createContext();

export const useLocalStorage = () => {
    return useContext(LocalStorageContext);
};


export const LocalStorageContextProvider = ({ children }) => {
	const[keyWoards, setKeyWoards] = useState(JSON.parse(localStorage.getItem('keywoards')) || []);

	const saveSearchKeywoards = (newKeyWoard) => {
		const keywoards = getSearchKeywoards('keywoards') || [];
		if(newKeyWoard.trim() && !keywoards.includes(newKeyWoard)) {
			keywoards.push(newKeyWoard);
			if (keywoards.length > 10) {
				keywoards.shift();  // Removes the first item from the array (oldest keyword)
			}
            localStorage.setItem('keywoards', JSON.stringify(keywoards));
		}
		setKeyWoards(JSON.parse(localStorage.getItem('keywoards')) || []);
	}
	const removeKeyWoards = (keywoard) => {
		const keywoards = getSearchKeywoards('keywoards') || [];
        localStorage.setItem('keywoards', JSON.stringify(keywoards.filter(kw => kw !== keywoard)));
		setKeyWoards(JSON.parse(localStorage.getItem('keywoards')) || []);
	}
	const getSearchKeywoards = () => {
		return JSON.parse(localStorage.getItem('keywoards')) || [];
	}
	return (
		<LocalStorageContext.Provider value={{saveSearchKeywoards,keyWoards,getSearchKeywoards,removeKeyWoards}}>
            {children}
        </LocalStorageContext.Provider>
	)
}

