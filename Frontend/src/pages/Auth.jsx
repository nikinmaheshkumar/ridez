import React, { useState } from "react";
import LoginForm from "../components/LoginForm.jsx";
import RegisterForm from "../components/RegisterForm.jsx";

export default function AuthPage() {
  const [isChecked, setIsChecked] = useState(false);

  const handleToggle = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className="min-h-screen bg-gradient-to-t from-black to-blue-700 flex flex-col items-center justify-center px-4 py-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-mono font-semibold text-white mb-6 sm:mb-8 text-center">Ridez</h1>
  
      <div className="relative flex flex-col items-center w-full max-w-md">

        <div className="relative flex flex-col items-center gap-6 sm:gap-8 mb-8 sm:mb-12">
          <label className="relative cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only" 
              checked={isChecked}
              onChange={handleToggle}
            />
            <div className="absolute -left-20 sm:-left-24 md:-left-28 top-0 w-16 sm:w-20 md:w-24 text-center">
              <span className={`text-md sm:text-base md:text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent tracking-wide transform transition-all duration-300 ${!isChecked ? 'scale-110 drop-shadow-lg' : 'scale-100 opacity-70'}`}>
                Welcome Back
              </span>
            </div>
            <div className="absolute -right-20 sm:-right-24 md:-right-28 top-0 w-16 sm:w-20 md:w-24 text-center">
              <span className={`text-md sm:text-base md:text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent tracking-wide transform transition-all duration-300 ${isChecked ? 'scale-110 drop-shadow-lg' : 'scale-100 opacity-70'}`}>
                Join Us
              </span>
            </div>
          
            <div className={`w-10 h-4 sm:w-12 sm:h-5 rounded border-2 border-white shadow-lg transition-all duration-300 ${isChecked ? 'bg-blue-500' : 'bg-white/15'}`}>
              <div className={`w-4 h-4 sm:w-5 sm:h-5 bg-white/90 backdrop-blur-sm border-2 border-white rounded -mt-0.5 -ml-0.5 shadow-md transition-transform duration-300 ${isChecked ? 'translate-x-6 sm:translate-x-7' : 'translate-x-0'}`}></div>
            </div>
          </label>
        </div>
        
        <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:w-100 h-110 sm:h-120 perspective-1000">
          <div className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${isChecked ? 'rotate-y-180' : ''}`}>
 
            <div className="absolute inset-0 w-full h-full backface-hidden">
              <div className="w-full h-full p-4 flex flex-col justify-center items-center bg-white/10 backdrop-blur-lg rounded-2xl border-2 border-white/20 shadow-2xl">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 md:mb-8 top-2">Log in</h2>
                <LoginForm />
              </div>
            </div>

            <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
              <div className="w-full h-full p-4 sm:p-6 md:p-8 flex flex-col justify-center items-center bg-white/10 backdrop-blur-lg rounded-2xl border-2 border-white/20 shadow-2xl">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 md:mb-8">Sign up</h2>
                <RegisterForm />
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}