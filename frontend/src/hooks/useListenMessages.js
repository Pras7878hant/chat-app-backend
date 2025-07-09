import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";
import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {
	const { socket } = useSocketContext();
	const { setMessages } = useConversation();
	const channel = new BroadcastChannel("chat-messages");

	useEffect(() => {
		const handler = (newMessage) => {
			setMessages((prevMessages) => {
				// Prevent duplicates
				if (prevMessages.some((msg) => msg._id === newMessage._id)) {
					return prevMessages;
				}
				newMessage.shouldShake = true;
				const sound = new Audio(notificationSound);
				sound.play();
				// Broadcast to other tabs
				channel.postMessage({ type: "newMessage", message: newMessage });
				return [...prevMessages, newMessage];
			});
		};

		// Listen for messages from other tabs
		channel.onmessage = (event) => {
			if (event.data.type === "newMessage") {
				setMessages((prevMessages) => {
					if (prevMessages.some((msg) => msg._id === event.data.message._id)) {
						return prevMessages;
					}
					return [...prevMessages, event.data.message];
				});
			}
		};

		socket?.on("newMessage", (newMessage) => {
			console.log("New message received:", newMessage);
			handler(newMessage);
		});

		return () => {
			socket?.off("newMessage", handler);
			channel.close();
		};
	}, [socket, setMessages]);

	return null;
};

export default useListenMessages;

// change
// import { useEffect } from "react";
// import { useSocketContext } from "../context/SocketContext";
// import useConversation from "../zustand/useConversation";
// import notificationSound from "../assets/sounds/notification.mp3";

// const useListenMessages = () => {
// 	const { socket } = useSocketContext();
// 	const { setMessages } = useConversation();

// 	useEffect(() => {
// 		console.log("Socket listen activated");
// 		const handler = (newMessage) => {
// 			newMessage.shouldShake = true;

// 			const sound = new Audio(notificationSound);
// 			sound.play();

// 			setMessages((prevMessages) => [...prevMessages, newMessage]);
// 		};

// 		socket?.on("newMessage", handler);

// 		return () => socket?.off("newMessage", handler);
// 	}, [socket, setMessages]);
// };

// export default useListenMessages;
