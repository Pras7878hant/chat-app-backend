import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
     try {
          const { message } = req.body;
          const { id: receiverId } = req.params;
          const senderId = req.user._id;

          // Find or create conversation
          let conversation = await Conversation.findOne({
               participants: { $all: [senderId, receiverId] },
          });

          if (!conversation) {
               conversation = await Conversation.create({
                    participants: [senderId, receiverId],
               });
          }

          // Create new message
          const newMessage = new Message({
               senderId,
               receiverId,
               message,
          });

          // Add message to conversation
          if (newMessage) {
               conversation.messages.push(newMessage._id);
          }


          await Promise.all([conversation.save(), newMessage.save()]);

          // ✅ SOCKET.IO - Emit message to both receiver and sender
          const receiverSocketId = getReceiverSocketId(receiverId);
          const senderSocketId = getReceiverSocketId(senderId);

          if (receiverSocketId) {
               io.to(receiverSocketId).emit("newMessage", newMessage);
          }
          if (senderSocketId) {
               io.to(senderSocketId).emit("newMessage", newMessage);
          }

          // ✅ Send back response to frontend
          res.status(201).json(newMessage);
     } catch (error) {
          console.log("Error in sendMessage controller: ", error.message);
          res.status(500).json({ error: "Internal server error" });
     }
};

export const getMessages = async (req, res) => {
     try {
          const { id: userToChatId } = req.params;
          const senderId = req.user._id;

          const conversation = await Conversation.findOne({
               participants: { $all: [senderId, userToChatId] },
          }).populate("messages");

          if (!conversation) return res.status(200).json([]);

          const messages = conversation.messages;

          res.status(200).json(messages);
     } catch (error) {
          console.log("Error in getMessages controller: ", error.message);
          res.status(500).json({ error: "Internal server error" });
     }
};
