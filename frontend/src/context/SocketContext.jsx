import { createContext, useContext, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();
export const useSocketContext = () => useContext(SocketContext);

export const SocketContextProvider = ({ children }) => {
	const [onlineUsers, setOnlineUsers] = useState([]);
	const socketRef = useRef(null);

	useEffect(() => {
		const user = JSON.parse(localStorage.getItem("chat-user"));
		const userId = user?._id;

		if (userId && !socketRef.current) {
			socketRef.current = io(import.meta.env.VITE_SOCKET_URL, {
				transports: ["websocket"],
				withCredentials: true,
				auth: { userId },
			});

			socketRef.current.on("getOnlineUsers", (users) => {
				setOnlineUsers(users);
			});
		}

		// Cleanup on unmount
		return () => {
			if (socketRef.current) {
				socketRef.current.disconnect();
			}
		};
	}, []);

	return (
		<SocketContext.Provider value={{ socket: socketRef.current, onlineUsers }}>
			{children}
		</SocketContext.Provider>
	);
};
