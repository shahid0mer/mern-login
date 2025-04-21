import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { appContext } from "../contexts/AppContext";


const Header = () => {

  const {userData} = useContext(appContext)
    
  return (
    <div className="flex flex-col items-center mt-35 px-4 text-center text-gray-800">
      <img
        src={assets.homelogo}
        alt=""
        className="w-[400px] h-[300px] "
      />

      <h1 className="flex items-center gap-2 text-xl sm:text-4xl font-medium mb-2">
        Hey {userData ? userData.name : 'Developer'} !
        <img className="w-9 aspect-square" src={assets.hand} alt="" />
      </h1>

      <h2 className="text-3xl sm:text-6xl font-semibold mb-4">
        Welcome to our app
      </h2>

      <p className="mb-8 max-w-md">
        Let's start with a quick product tour and we will have you up and
        running in no time!
      </p>

      <button 
      className="border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 active:scale-95 transition-all">
        Get Started
      </button>
    </div>
  );
};

export default Header;
