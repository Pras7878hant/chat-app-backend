import { createContext, useContext, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();
export const useSocketContext = () => useContext(SocketContext);

export const SocketContextProvider = ({ children }) => {
	const [onlineUsers, setOnlineUsers] = useState([]);
	const [socket, setSocket] = useState(null); // ✅ Track socket in state
	const socketRef = useRef(null);

	useEffect(() => {
		const user = JSON.parse(localStorage.getItem("chat-user"));
		const userId = user?._id;

		if (userId && !socketRef.current) {
			const socketInstance = io(import.meta.env.VITE_SOCKET_URL, {
				transports: ["websocket"],
				withCredentials: true,
				auth: { userId },
			});

			socketRef.current = socketInstance;
			setSocket(socketInstance); // ✅ This makes context update immediately

			socketInstance.on("getOnlineUsers", (users) => {
				setOnlineUsers(users);
			});
		}

		// Cleanup on unmount
		return () => {
			if (socketRef.current) {
				socketRef.current.disconnect();
				socketRef.current = null;
				setSocket(null);
			}
		};
	}, []);

	return (
		<SocketContext.Provider value={{ socket, onlineUsers }}>
			{children}
		</SocketContext.Provider>
	);
};
