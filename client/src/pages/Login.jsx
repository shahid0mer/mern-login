import React, { useState, useContext } from "react";
import { assets } from "../assets/assets";
import { Await, useNavigate } from "react-router-dom";
import { appContext } from "../contexts/AppContext";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const Login = () => {
  const [state, setstate] = useState("Sign up");
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const navigate = useNavigate();
  const { backEndUrl, setisLoggedIn, getUserdata } = useContext(appContext);

  const submitHandler = async (e) => {
    e.preventDefault();

    axios.defaults.withCredentials = true;
    console.log("Submitting:", { email, password });

    try {
      if (state === "Sign up") {
        const { data } = await axios.post(backEndUrl + "/api/auth/register", {
          name,
          email,
          password,
        }, { withCredentials: true});
        if (data.success) {
          setisLoggedIn(true);
          getUserdata();
          navigate("/");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backEndUrl + "/api/auth/login", {
          email,
          password,
        },{ withCredentials: true});
        console.log("Response:", data); // Log response data

        if (data.success) {
          setisLoggedIn(true);
          getUserdata();
          navigate("/");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 mt-30 border-1 w-[500px] rounded-xl shadow-md mx-auto">
      {state === "Sign up" ? (
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            onClick={() => navigate("/")}
            alt="SECURE"
            src={assets.logob}
            className="mx-auto w-45"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Create an Account
          </h2>
        </div>
      ) : (
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img alt="SECURE" src={assets.logob} className="mx-auto w-45" />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Login
          </h2>
        </div>
      )}

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={submitHandler} className="space-y-6">
          {state === "Sign up" && (
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Full name
              </label>
              <div className="mt-2">
                <input
                  onChange={(e) => setname(e.target.value)}
                  value={name}
                  id="name"
                  name="name"
                  type="name"
                  required
                  autoComplete="name"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
          )}
          <div>
            <label
              htmlFor="email"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                onChange={(e) => setemail(e.target.value)}
                value={email}
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Password
              </label>
              {state === "Sign up" && (
                <div className="text-sm">
                  <a
                    onClick={() => navigate("/reset-password")}
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </a>
                </div>
              )}
            </div>
            <div className="mt-2">
              <input
                onChange={(e) => setpassword(e.target.value)}
                value={password}
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className=" !text-gray-700 border border-gray-500  px-8 py-2.5 hover:bg-gray-100 active:scale-95 transition-all flex w-full justify-center rounded-md  text-sm/6 font-semibold  shadow-xs  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {state}
            </button>
          </div>
        </form>

        {state === "Sign up" ? (
          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Already a member ?{" "}
            <a
              onClick={() => setstate("Login")}
              className="cursor-pointer font-semibold text-indigo-600 hover:text-indigo-500 "
            >
              Login here !
            </a>
          </p>
        ) : (
          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Not a member?{" "}
            <a
              onClick={() => setstate("Sign up")}
              className="cursor-pointer font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Sign up here !
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
