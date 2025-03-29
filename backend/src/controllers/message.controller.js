import User from "../models/user.model.js"
import Message from "../models/message.model.js"
import cloudinary from "../lib/cloudinary.js"
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error in getUsersForSidebar controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getMessage = async (req, res) => {
    try {
        const { id: otherId } = req.params;
        const myId = req.user._id;
        const message = await Message.find({
            $or: [
                { senderId: myId, receiverId: otherId },
                { senderId: otherId, receiverId: myId }
            ]
        })

        res.status(200).json(message);
    } catch (error) {
        console.log("Error in getMessage controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text,image } = req.body;

        const senderId = req.user._id;
        
        const { id: receiverId } = req.params;

        let imageUrl;

        if (image) {
            const uploadImage = await cloudinary.uploader.upload(image);
           imageUrl = uploadImage.secure_url
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl
        })

       await newMessage.save()

        const receiverSocketId = getReceiverSocketId(receiverId)
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("getLiveMessages",newMessage)
        }

        res.status(200).json(newMessage)
    } catch (error) {
        console.log("Error in sendMessage controller",error.message);
        res.status(500).json({message:"Internal server error"})
    }
}