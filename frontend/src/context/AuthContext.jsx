import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the AuthContext
export const AuthContext = createContext();

// AuthContextProvider component
export const AuthContextProvider = ({ children }) => {
	const [authUser, setAuthUser] = useState(null);

	// Ensure consistent localStorage key
	useEffect(() => {
		const storedUser = localStorage.getItem('chat-user'); // ✅ match with SocketContext
		if (storedUser) {
			setAuthUser(JSON.parse(storedUser));
		}
	}, []);

	// Also update localStorage whenever authUser changes
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

// ✅ Hook to access AuthContext
export const useAuthContext = () => useContext(AuthContext);
