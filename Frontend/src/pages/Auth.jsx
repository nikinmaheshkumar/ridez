import React, { useState } from "react";
import LoginForm from "../components/LoginForm.jsx";
import RegisterForm from "../components/RegisterForm.jsx";

export default function AuthPage() {
  const [mode, setMode] = useState("login");

  const isLogin = mode === "login";
  const isRegister = mode === "register";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f2f2f2] ">
      <div className=" flex flex-col shadow-lg p-6 rounded-lg bg-white dark:bg-black border border-black dark:border-white mb-4 max-w-xs sm:min-w-md" >
        <div className="flex flex-row mb-8 gap-2">
          <button onClick={() => setMode("login")} className={`rounded-lg basis-1/2 text-white text-lg h-12 transition ${isLogin ? "bg-black" : "bg-[#0f0f86]" }`}>Login</button>
          <button onClick={() => setMode("register")} className={`rounded-lg basis-1/2 text-white text-lg h-12 transition ${isRegister ? "bg-black" : "bg-[#0f0f86]" }`}>Register</button>
        </div>
        {mode === "login" ? <LoginForm /> : <RegisterForm setMode={setMode}/>}
      </div>
    </div>
  );
}
