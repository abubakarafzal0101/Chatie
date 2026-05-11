import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import { editProfile, getUser } from "../controllers/user.controllers.js";
import upload from "../middlewares/multer.js";
const userRouter = express.Router();

userRouter.get("/me", isAuth, getUser);
userRouter.put("/update-profile", isAuth, upload.single("image"), editProfile);

export default userRouter;
