import React, { createContext,  useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getuser } from '../action/useraction';

// Create the context
const ServerAuthContext = createContext();

// Provider component
export const SeverAuthProvider = ({ children }) => {
	const {loading:userLoading, user, isAuthentication} = useSelector(state => state.user)
	const dispatch = useDispatch();
	const checkAuthUser = async ()=>{
		if(!userLoading && !user){
			dispatch(getuser())
		}
	}
	useEffect(()=>{
		checkAuthUser();
	},[])
	return (
		<ServerAuthContext.Provider value={{userLoading:userLoading === undefined ? true : userLoading,checkAuthUser, user, isAuthentication }}>
			{children}
		</ServerAuthContext.Provider>
	);
};

// Custom hook to use the toast context
export const useServerAuth = () => {
	return useContext(ServerAuthContext);
};
