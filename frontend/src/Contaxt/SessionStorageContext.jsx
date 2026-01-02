import React, { createContext, useState, useEffect, useContext } from 'react';

// Create a context to hold session storage data
const SessionStorageContext = createContext();

// Custom hook to access session storage context
export const useSessionStorage = () => {
    return useContext(SessionStorageContext);
};

// Provider component to wrap around the app
export const SessionStorageProvider = ({ children }) => {
    const [sessionData, setSessionData] = useState(() => {
        // Initialize state with session storage data
        return JSON.parse(localStorage.getItem('wishListItem')) || [];
    });
    const [sessionBagData, setBagSessionData] = useState(() => {
        // Initialize state with session storage data
        return JSON.parse(localStorage.getItem('bagItem')) || [];
    });
    const [sessionRecentlyViewProducts, setRecentlyViewProducts] = useState(() => {
        // Initialize state with session storage data
        return JSON.parse(localStorage.getItem('recentlyViewProducts')) || [];
    });

    useEffect(() => {
        // Listen for changes in session storage
        const handleStorageChange = () => {
            const updatedData = JSON.parse(localStorage.getItem('wishListItem')) || [];
            const updatedBagData = JSON.parse(localStorage.getItem('bagItem')) || [];
            const updatedRecentlyViewProducts = JSON.parse(localStorage.getItem('recentlyViewProducts')) || [];
            setSessionData(updatedData);
            setBagSessionData(updatedBagData);
            setRecentlyViewProducts(updatedRecentlyViewProducts);
        };

        // Listen for session storage changes
        window.addEventListener('storage', handleStorageChange);

        // Clean up the event listener on unmount
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);
    const updateBagQuantity = (productId,size,color,quantity)=>{
        let bagItem = JSON.parse(localStorage.getItem("bagItem"));
        if (!bagItem) {
            bagItem = [];
        }
        let index = bagItem?.findIndex((item) => item.productId === productId && item.size?._id === size._id && item.color?._id === color._id);
        // console.log("Sesseon bag: ",bagItem)
        if (index !== -1) {
            bagItem[index].quantity = quantity;
            localStorage.setItem("bagItem", JSON.stringify(bagItem));
            setBagSessionData(bagItem)
        }
    }
	const toggleBagItemCheck = (productId,size,color)=>{
		let bagItem = JSON.parse(localStorage.getItem("bagItem"));
		if (!bagItem) {
			bagItem = [];
		}
		// console.log("bag: ",b)
		let index = bagItem?.findIndex((item) => item.productId === productId && item.color._id === color._id && item.size._id === size._id);
		if (index!== -1) {
			bagItem[index].isChecked = !bagItem[index].isChecked;
			localStorage.setItem("bagItem", JSON.stringify(bagItem));
			setBagSessionData(bagItem)
		}
	}
    const removeBagSessionStorage = (productId,size,color)=>{
        let bagItem = JSON.parse(localStorage.getItem("bagItem"));
        if (!bagItem) {
            bagItem = [];
        }
        // console.log("bag: ",b)
        let index = bagItem?.findIndex((item) => item.productId === productId && item.color._id === color._id && item.size._id === size._id);
        if (index!== -1) {
            bagItem.splice(index,1);
            localStorage.setItem("bagItem", JSON.stringify(bagItem));
            setBagSessionData(bagItem)
        }
    }
    const setSessionStorageBagListItem = (orderData,productId)=>{
        let bagItem = JSON.parse(localStorage.getItem("bagItem"));
        if (!bagItem) {
            bagItem = [];
        }
        console.log("Adding Items: bag: ",orderData,productId)
        let index = bagItem?.findIndex((item) => item.productId === productId);
        if (index !== -1) {
            if(bagItem[index].size._id === orderData.size._id && bagItem[index].color._id === orderData.color._id) {
                bagItem[index].quantity += 1;
            }else{
                bagItem.push(orderData);
            }
        } else {
            bagItem.push(orderData);
        }
        localStorage.setItem("bagItem", JSON.stringify(bagItem));
        setBagSessionData(bagItem)
    }
    const setWishListProductInfo = (product,productId)=>{
        const wishListData = {
          productId: {...product},
        };
        let wishListItem = JSON.parse(localStorage.getItem("wishListItem"));
        if (!wishListItem) {
            wishListItem = [];
        }
        // console.log("bag: ",b)
        let index = wishListItem?.findIndex((item) => item.productId?._id === productId);
        if (index === -1) {
            wishListItem.push(wishListData);
            localStorage.setItem("wishListItem", JSON.stringify(wishListItem));
        }else{
            wishListItem.splice(index,1);
            localStorage.setItem("wishListItem", JSON.stringify(wishListItem));
        }
        console.log("wishListItem Added or remove: ",wishListItem);
        setSessionData(JSON.parse(localStorage.getItem("wishListItem")));
    }
    const updateRecentlyViewProducts = (product)=>{
        let recentlyViewProductStorage = JSON.parse(localStorage.getItem("recentlyViewProducts"));
        if (!recentlyViewProductStorage) {
            recentlyViewProductStorage = [];
        }
        // console.log("bag: ",b)
        let index = recentlyViewProductStorage?.findIndex((item) => item?._id === product._id);
        if (index !== -1) {
            recentlyViewProductStorage.splice(index,1);
            localStorage.setItem("recentlyViewProducts", JSON.stringify(recentlyViewProductStorage));
            setRecentlyViewProducts(recentlyViewProductStorage)
        }else{
            recentlyViewProductStorage.unshift(product);
            if(recentlyViewProductStorage.length > 10){
                recentlyViewProductStorage.pop();
            }
            localStorage.setItem("recentlyViewProducts", JSON.stringify(recentlyViewProductStorage));
            setRecentlyViewProducts(recentlyViewProductStorage)
        }
    }
    const updateSessionStorage = (newData) => {
        localStorage.setItem('wishListItem', JSON.stringify(newData));
        setSessionData(newData);
    };

    return (
        <SessionStorageContext.Provider value={{ sessionData,sessionBagData,sessionRecentlyViewProducts, updateSessionStorage,setWishListProductInfo ,setSessionStorageBagListItem,updateBagQuantity,toggleBagItemCheck,removeBagSessionStorage,updateRecentlyViewProducts}}>
            {children}
        </SessionStorageContext.Provider>
    );
};