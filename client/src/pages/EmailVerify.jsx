import React, { useContext, useEffect } from "react";

import { assets } from "../assets/assets";
import axios from "axios";
import { appContext } from "../contexts/AppContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const EmailVerify = () => {
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();

  const { backEndUrl, isLoggedIn, userData, getUserdata } =
    useContext(appContext);

  const inputRefs = React.useRef([]);
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
  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      const otpArray = inputRefs.current.map((e) => e.value);
      const otp = otpArray.join("").trim();

      const { data } = await axios.post(
        backEndUrl + "/api/auth/verifythe-otp",
        { otp }
      );
      if (data.success) {
        toast.success("Email verified");
        getUserdata();
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    isLoggedIn && userData && userData.isAccountVerified && navigate("/");
  }, [isLoggedIn, userData]);
  return (
    <div className="flex items-center justify-center min-h-screen">
      <img
        className="block h-24 w-auto absolute left-5 top-5 "
        src={assets.logob}
      />

      <form
        onSubmit={submitHandler}
        className="bg-slate-900 p-8 rounded-lg shadow-lg w-auto text-sm "
      >
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Email Verify OTP
        </h1>
        <p className="text-center mb-6 text-indigo-300">
          Enter 6-digit code sent to your email id.
        </p>
        <div
          className="flex justify-between  mb-8 gap-5 "
          onPaste={handlePaste}
        >
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                className="w-14 h-14 text-white text-center text-xl  rounded-md bg-[#333A5C]"
                type="text"
                maxLength={1}
                key={index}
                required
                ref={(e) => (inputRefs.current[index] = e)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onInput={(e) => handleInput(e, index)}
              />
            ))}
        </div>
        <button className=" w-full  bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded active:scale-95 transition-all">
          Submit
        </button>
      </form>
    </div>
  );
};

export default EmailVerify;
