import User from "../models/user.model.js";

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
