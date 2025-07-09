import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the AuthContext
export const AuthContext = createContext();

// AuthContextProvider component
export const AuthContextProvider = ({ children }) => {
	const [authUser, setAuthUser] = useState(null);


	useEffect(() => {
		const storedUser = localStorage.getItem('chat-user');
		if (storedUser) {
			setAuthUser(JSON.parse(storedUser));
		}
	}, []);


	useEffect(() => {
		if (authUser) {
			localStorage.setItem('chat-user', JSON.stringify(authUser));
		}
	}, [authUser]);

	return (
		<AuthContext.Provider value={{ authUser, setAuthUser }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuthContext = () => useContext(AuthContext);
