import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { appContext } from "../contexts/AppContext";
import axios from "axios";
import toast from "react-hot-toast";

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, backEndUrl, setuserData, setisLoggedIn } =
    useContext(appContext);

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backEndUrl + "/api/auth/logout");

      data.success && setisLoggedIn(false);
      data.success && setuserData(false);
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        backEndUrl + "/api/auth/sendverification-otp"
      );

      if (data.success) {
        navigate("/verify-email");
        toast.success(data.message);
      } else {
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <div className="fixed top-0 left-0 w-full z-50 bg-white  backdrop-blur-lg bg-opacity-80">
        <div className=" w-vw px-8 sm:px-6 mx-10 my-6  ">
          <div className="relative flex h-16 justify-between items-center">
            <div className="flex flex-1 items-stretch justify-start">
              <a className="flex flex-shrink-0 items-center" href="#">
                <img className="block h-24 w-auto" src={assets.logob} />
              </a>
            </div>

            <div>
              {userData ? (
                <div className="flex items-center justify-center gap-5">
                  <div className="relative group w-10 h-10 flex gap-4 justify-center items-center rounded-full text-white bg-black">
                    {userData.name[0].toUpperCase()}
                  </div>

                  {!userData.isAccountVerified && (
                    <div className="">
                      <button
                        onClick={sendVerificationOtp}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded active:scale-95 transition-all"
                      >
                        Verify Email
                      </button>
                    </div>
                  )}

                  <div>
                    <button
                      onClick={logout}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded active:scale-95 transition-all"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="flex-shrink-0 flex px-2 py-3 items-center space-x-8"
                >
                  <a className="!text-gray-800 border border-gray-500 rounded-4xl hover:bg-gray-100 text-xl  flex items-center px-3 py-1.5 gap-3 active:scale-95 transition-all">
                    <span className="!text-gray-700">Login</span>
                    <img className="w-4 h-5" src={assets.rightarrow} alt="" />
                  </a>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
