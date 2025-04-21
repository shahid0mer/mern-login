import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
export const appContext = createContext();
const backEndUrl = import.meta.env.VITE_BACKEND_URL;
export const AppContextProvider = (props) => {
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [userData, setuserData] = useState(false);

  const authState = async () => {
    try {
      const { data } = await axios.get(backEndUrl + "/api/auth/is-auth");
      if (data.success) {
        setisLoggedIn(true);
        getUserdata();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    authState();
  }, []);

  const getUserdata = async () => {
    try {
      const { data } = await axios.get(backEndUrl + "/api/user/data");

      data.success ? setuserData(data.userData) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const value = {
    backEndUrl,
    isLoggedIn,
    setisLoggedIn,
    userData,
    setuserData,
    getUserdata,
  };

  return (
    <appContext.Provider value={value}>{props.children}</appContext.Provider>
  );
};
