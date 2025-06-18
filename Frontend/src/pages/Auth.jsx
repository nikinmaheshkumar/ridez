import React, { useState } from "react";
import LoginForm from "../components/LoginForm.jsx";
import RegisterForm from "../components/RegisterForm.jsx";

export default function AuthPage() {
  const [mode, setMode] = useState("login");

  const isLogin = mode === "login";
  const isRegister = mode === "register";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-t from-black to-blue-700">
        <h1 className="text-3xl items-center justify-center mx-auto mb-4 font-mono font-semibold">Ridez</h1>
      <div className=" flex flex-col shadow-xl p-6 rounded-lg bg-white/10 dark:bg-black mb-4 max-w-xs sm:min-w-md" >
        <div className="flex flex-row mb-8 gap-2">
          <button onClick={() => setMode("login")} className={`rounded-lg basis-1/2 text-white text-lg h-12 transition ${isLogin ? "bg-black" : "bg-[#0f0f86]" }`}>Login</button>
          <button onClick={() => setMode("register")} className={`rounded-lg basis-1/2 text-white text-lg h-12 transition ${isRegister ? "bg-black" : "bg-[#0f0f86]" }`}>Register</button>
        </div>
        {mode === "login" ? <LoginForm /> : <RegisterForm setMode={setMode}/>}
      </div>
    </div>
  );
}
