import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the AuthContext
export const AuthContext = createContext();

// AuthContextProvider component
export const AuthContextProvider = ({ children }) => {
	const [authUser, setAuthUser] = useState(null);

	// Optional: auto-login from localStorage
	useEffect(() => {
		const storedUser = localStorage.getItem('user');
		if (storedUser) {
			setAuthUser(JSON.parse(storedUser));
		}
	}, []);

	return (
		<AuthContext.Provider value={{ authUser, setAuthUser }}>
			{children}
		</AuthContext.Provider>
	);
};

// ✅ Correctly named export for use in components
export const useAuthContext = () => useContext(AuthContext);
