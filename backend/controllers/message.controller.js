import { asyncHandler } from "../utils/asyncHandler.js";
import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { getReceiverSocket } from "../socket/socket.js";
import { io } from "../socket/socket.js";

const sendMessage = asyncHandler(async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        });

        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        // await conversation.save();
        // await newMessage.save();

        // this will run parallelly
        await Promise.all([conversation.save(), newMessage.save()]);

        // TODO: SOCKET IO FUNCTIONALITY WILL GO HERE
        const receiverSocketId = getReceiverSocket(receiverId);

        if (receiverSocketId) {
            // io.to(<socketId>).emit(<event>, <data>)  uesd to send events to specific events
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller : ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const getMessage = asyncHandler(async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] },
        }).populate("messages"); // NOT REFERENCES BUT ACTUAL MESSAGES

        if (!conversation) return res.status(200).json([]);

        const messages = conversation.messages;

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessage controller : ", error.message);

        res.status(500).json({ error: "Internal Server Error" });
    }
});

export { sendMessage, getMessage };
