import express from "express";
import { viewUserDetails } from "../controllers/usercontroller.js";
import userAuth from "../middlewares/userAuth.js";

const userRouter = express.Router();

userRouter.get("/data", userAuth ,viewUserDetails);

export default userRouter;
