import axios from "axios";
import React, { useState, useRef, useContext } from "react";
import { appContext } from "../contexts/AppContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1);
  const [newPassword, setNewPassword] = useState("");
  const [otp, setOtp] = useState("");

  const { backEndUrl } = useContext(appContext);

  const inputRefs = useRef([]);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    console.log("Email value:", email); // Add this log to verify email
    try {
      const { data } = await axios.post(
        backEndUrl + "/api/auth/send-reset-otp",
        { email }
      );
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && setStep(2);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();

    // Gather OTP from all input fields
    const otpValue = inputRefs.current
      .map((input) => input?.value || "")
      .join("");

    console.log("OTP Value from inputs:", otpValue); // Check the OTP values here

    if (otpValue.length !== 6) {
      toast.error("Enter the full 6-digit OTP");
      return;
    }

    setOtp(otpValue);
    setStep(3);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        backEndUrl + "/api/auth/reset-password",
        {
          email,
          otp, 
          newPassword,
        }
      );
      console.log("Response data:", data);
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && navigate("/");
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen flex-col gap-10">
      {step === 1 && (
        <form
          onSubmit={handleEmailSubmit}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-[500px] text-sm"
        >
          <h1 className="text-white text-3xl font-semibold text-center mb-4">
            Reset Password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter your registered Email
          </p>
          <div className="bg-[#333a5c] w-full rounded-2xl">
            <input
              className="bg-transparent outline-none rounded-md w-full h-10 p-5 text-white"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-center my-10">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full active:scale-95 transition-all">
              Send OTP
            </button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form
          onSubmit={handleOtpSubmit}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-auto text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Verify OTP
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter the 6-digit code sent to your email.
          </p>
          <div
            className="flex justify-between mb-8 gap-5"
            onPaste={handlePaste}
          >
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  key={index}
                  className="w-14 h-14 text-white text-center text-xl rounded-md bg-[#333A5C]"
                  type="text"
                  maxLength={1}
                  required
                  ref={(e) => (inputRefs.current[index] = e)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onInput={(e) => handleInput(e, index)}
                />
              ))}
          </div>
          <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded active:scale-95 transition-all">
            Submit OTP
          </button>
        </form>
      )}

      {step === 3 && (
        <form
          onSubmit={handlePasswordSubmit}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-[500px] text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Set New Password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Choose a strong password.
          </p>
          <div className="bg-[#333a5c] w-full rounded-2xl mb-6">
            <input
              className="bg-transparent outline-none rounded-md w-full h-10 p-5 text-white"
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded active:scale-95 transition-all">
            Reset Password
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
