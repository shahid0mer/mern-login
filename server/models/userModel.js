import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAccountVerified: { type: Boolean, default: false },
  verifyOtp: { type: Number, default: "" },
  verifyOtpExpiresAt: { type: Number, default: 0 },
  resetOtp: { type: Number, default: "" },
  resetOtpExpiresAt: { type: Number, default: 0 },
});

const userModel = mongoose.models.User || mongoose.model("User", userSchema);

export default userModel;
