import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
export const getUser = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in getUser", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const editProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name } = req.body;
    let imageUrl = null;

    if (req.file) {
      const streamUpload = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "chatie-chat",
            },
            (err, result) => {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            },
          );

          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };
      const uploadedImage = await streamUpload();

      imageUrl = uploadedImage.secure_url;
    }

    const updatedData = {};

    if (name) {
      updatedData.name = name;
    }

    if (imageUrl) {
      updatedData.image = imageUrl;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log("Error in editProfile", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
