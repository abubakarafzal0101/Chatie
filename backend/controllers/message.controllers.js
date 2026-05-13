import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
export const sendMessage = async (req, res) => {
  try {
    const sender = req.userId;
    const receiver = req.params.recieverId;

    // ===== Validation =====
    if (!sender || !receiver) {
      return res.status(400).json({
        success: false,
        message: "Sender and receiver are required",
      });
    }

    // Prevent self messaging
    if (sender.toString() === receiver.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot send message to yourself",
      });
    }

    const textMessage = req.body.message?.trim();

    // At least message or image required
    if (!textMessage && !req.file) {
      return res.status(400).json({
        success: false,
        message: "Message or image is required",
      });
    }

    let image = null;

    // ===== Image Upload =====
    if (req.file) {
      try {
        const uploadToCloudinary = () => {
          return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              {
                folder: "chatie-chat",
                resource_type: "image",
              },
              (error, result) => {
                if (error) {
                  return reject(error);
                }

                resolve(result);
              },
            );

            streamifier.createReadStream(req.file.buffer).pipe(stream);
          });
        };

        const uploadedImage = await uploadToCloudinary();

        image = uploadedImage.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary Upload Error:", uploadError);

        return res.status(500).json({
          success: false,
          message: "Image upload failed",
        });
      }
    }

    // ===== Find or Create Conversation =====
    let conversation = await Conversation.findOne({
      participants: { $all: [sender, receiver] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [sender, receiver],
        messages: [],
      });
    }

    // ===== Create Message =====
    const newMessage = await Message.create({
      sender,
      reciever: receiver,
      message: textMessage || "",
      image,
    });

    // ===== Push Message =====
    conversation.messages.push(newMessage._id);

    await conversation.save();

    // ===== Response =====
    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error("Error in sendMessage:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const getMessages = async (req, res) => {
  try {
    let sender = req.userId;
    let reciever = req.params.recieverId;

    let conversation = await Conversation.findOne({
      participants: { $all: [sender, reciever] },
    }).populate("messages");

    if (!conversation) {
      return res
        .status(404)
        .json({ success: false, message: "Conversation not found" });
    }
    res.status(200).json({ success: true, messages: conversation?.messages });
  } catch (error) {
    console.log("Error in getMessages", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
