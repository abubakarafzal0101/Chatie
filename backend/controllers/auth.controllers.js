import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const genToken = async (userId) => {
  try {
    const token = await jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return token;
  } catch (error) {
    console.log("Error in genToken", error.message);
  }
};

export const signup = async (req, res) => {
  try {
    let { userName, email, password } = req.body;

    if (!userName || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const checkByUserName = await User.findOne({ userName });
    const checkByEmail = await User.findOne({ email });

    if (checkByUserName || checkByEmail) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      userName,
      email,
      password: hashedPassword,
    });

    const token = await genToken(user._id);

    res
      .status(201)
      .json({ success: true, message: "User REgistered Successfully", token });
  } catch (error) {
    console.log("Error in signup", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = await genToken(user._id);

    res
      .status(200)
      .json({ success: true, message: "Login Successfull!", token });
  } catch (error) {
    console.log("Error in login", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
