import { createContext, useContext, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();
export const useSocketContext = () => useContext(SocketContext);

export const SocketContextProvider = ({ children }) => {
	const [onlineUsers, setOnlineUsers] = useState([]);
	const [socket, setSocket] = useState(null);
	const socketRef = useRef(null);

	useEffect(() => {
		const user = JSON.parse(localStorage.getItem("chat-user"));
		const userId = user?._id;

		if (userId && !socketRef.current) {
			const socketInstance = io(import.meta.env.VITE_SOCKET_URL, {
				transports: ["websocket"],
				withCredentials: true,
				auth: { userId },
				reconnection: true,
				reconnectionAttempts: 5,
				reconnectionDelay: 1000,
			});

			socketInstance.on("connect", () => {
				console.log("Socket connected:", socketInstance.id);
			});

			socketInstance.on("connect_error", (error) => {
				console.error("Socket connection error:", error);
			});

			socketInstance.on("reconnect", (attempt) => {
				console.log("Socket reconnected after attempt:", attempt);
			});

			socketRef.current = socketInstance;
			setSocket(socketInstance);

			socketInstance.on("getOnlineUsers", (users) => {
				setOnlineUsers(users);
			});
		}

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

