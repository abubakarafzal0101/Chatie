import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import {
  getMessages,
  sendMessage,
} from "../controllers/message.controllers.js";
import upload from "../middlewares/multer.js";
const messageRouter = express.Router();

messageRouter.post(
  "/send/:recieverId",
  isAuth,
  upload.single("image"),
  sendMessage,
);

messageRouter.get("/get/:recieverId", isAuth, getMessages);

export default messageRouter;
