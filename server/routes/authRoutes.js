import express from "express";
import {
  isAuthorised,
  registerUser,
  resetPassword,
  sendResetOtp,
  sendVerifyOtp,
  userLogin,
  userlogout,
  verifyRecievedOtp,
} from "../controllers/authcontroller.js";
import userAuth from "../middlewares/userAuth.js";

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", userLogin);
authRouter.post("/logout", userlogout);
authRouter.post("/sendverification-otp", userAuth, sendVerifyOtp);
authRouter.post("/verifythe-otp", userAuth, verifyRecievedOtp);
authRouter.get("/is-auth", userAuth, isAuthorised);
authRouter.post("/send-reset-otp", sendResetOtp);
authRouter.post("/reset-password", resetPassword);

export default authRouter;
