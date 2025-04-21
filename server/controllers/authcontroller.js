import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

import transporter from "../config/nodemailer.js";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(404).json({
      success: false,
      message: "fill the missing details",
    });
  }

  try {
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.json({
        success: false,
        message: "user already exist ",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // required for SameSite=None
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const sendRegMail = {
      from: process.env.SENDER_MAIL,
      to: email,
      subject: "welcome to our website",
      text: `Your account has been associated with : ${email}`,
    };
    await transporter.sendMail(sendRegMail);

    return res.json({
      success: true,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const userLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt:", email, password);
  if (!email || !password) {
    console.log("Missing email or password");
    return res.status(404).json({
      success: false,
      message: "Email or Password missing",
    });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      console.log("User not found:", email);
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }
    const isPassMatch = await bcrypt.compare(password, user.password);
    if (!isPassMatch) {
      console.log("Invalid password for:", email);
      return res.json({
        success: false,
        message: "invalid Password",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // required for SameSite=None
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    console.log("Login successful:", email);
    return res.json({
      success: true,
    });
  } catch (error) {
    console.log("Login error:", error);
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const userlogout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // https on production (cookies)
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // strict for development
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7days expire in ms converted
    });

    return res.json({
      success: true,
      message: "logged out",
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const sendVerifyOtp = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (user.isAccountVerified) {
      return res.json({
        success: false,
        message: "User already verified",
      });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpiresAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    const sendOtpMail = {
      from: process.env.SENDER_MAIL,
      to: user.email,
      subject: "Account verification OTP",
      text: `Your OTP is ${otp}, Please use this OTP to verify your account`,
    };

    await transporter.sendMail(sendOtpMail);
    res.json({
      success: true,
      message: "OTP for verification sent! Please check your mail",
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyRecievedOtp = async (req, res) => {
  const userId = req.userId;
  const { otp } = req.body;

  console.log("Received OTP:", otp, "User ID:", userId); // Received OTP

  if (!userId || !otp) {
    return res.json({
      success: false,
      message: "missing details",
    });
  }
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({
        success: false,
        message: "user not found",
      });
    }
    console.log("Stored OTP:", user.verifyOtp); // Log the OTP stored in the DB

    if (!user.verifyOtp || String(user.verifyOtp) !== String(otp).trim()) {
      return res.json({
        success: false,
        message: "Invalid OTP",
      });
    }
    if (user.verifyOtpExpiresAt < Date.now()) {
      return res.json({
        success: false,
        message: "OTP expired",
      });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpiresAt = 0;

    await user.save();
    return res.json({
      success: true,
      message: "Email verification successfull",
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const isAuthorised = async (req, res) => {
  try {
    return res.json({
      success: true,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const sendResetOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.json({ success: false, message: "Email not found" });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      res.json({
        success: false,
        message: "User not found",
      });
    }

    const otp = String(Math.floor(900000 + Math.random() * 100000));

    user.resetOtp = otp;

    user.resetOtpExpiresAt = Date.now() + 15 * 60 * 1000;

    await user.save();

    const mailResetOtp = {
      from: process.env.SENDER_MAIL,
      to: user.email,
      subject: "Reset your password",
      text: `Your OTP for resetting your Password is ${otp}`,
    };
    await transporter.sendMail(mailResetOtp);

    res.json({
      success: true,
      message: "OTP for resetting your password is sent to your mail",
    });
  } catch (error) {}
};

export const resetPassword = async (req, res) => {
  const { email, newPassword, otp } = req.body;
  console.log("Received data:", { email, newPassword, otp });

  if (!email || !newPassword || !otp) {
    return res.json({
      success: false,
      message: "Details missing",
    });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (!user.resetOtp || String(user.resetOtp).trim() !== String(otp).trim()) {
      return res.json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (user.resetOtpExpiresAt < Date.now()) {
      return res.json({ message: false, message: "OTP expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpiresAt = 0;

    await user.save();

    res.json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
