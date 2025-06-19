import { useState } from "react";
import { FaMobileAlt } from "react-icons/fa";
import { TbLockPassword } from "react-icons/tb";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import api from "../services/api";
import { toast } from "react-toastify";

export default function RegisterForm({ setMode }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/signup/", {
        number: phone,
        email: email,
        name: name,
        password: password,
      }, {
        headers: {
          "Content-Type": "application/json",
        }
      });
      console.log("Registration success:", response.data);
   
    
    } catch (error) {
      if (error.response) {
        console.error("Registration failed:", error.response.data);
        toast.error("Registration failed: " + error.response.data.detail || "An error occurred");
      } else {
        console.error("Error:", error.message);
        toast.error("An error occurred: " + error.message);
      }
    }
     setMode("login");
  };

  return (
    <form
      onSubmit={handleRegister}
      className="flex flex-col gap-4 py-6 px-4 w-full max-w-md mx-auto items-start"
      autoComplete="off"
    >
      <label className="flex flex-row items-center border border-white rounded-md p-3 w-full">
        <FaRegUser  className="h-6 w-6 mr-4 text-[#068fff]" />
        <input
          type="text"
          className="w-full border-none outline-none text-sm text-white"
          required
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label className="flex flex-row items-center border border-white rounded-md p-3 w-full text-white">
        <MdOutlineEmail className="h-6 w-6 mr-4 text-[#068fff]" />
        <input type="email" placeholder="Email ID" required className=" w-full border-none outline-none text-sm" onChange={(e) => setEmail(e.target.value)}/>
      </label>


      <label className="flex flex-row items-center border border-white rounded-md p-3 w-full">
        <FaMobileAlt className="h-6 w-6 mr-4 text-[#068fff]" />
        <input
          type="tel"
          className="tabular-nums w-full border-none outline-none text-sm text-white"
          required
          placeholder="Phone"
          pattern="[0-9]*"
          minLength="10"
          maxLength="10"
          title="Must be 10 digits"
          onChange={(e) => setPhone(e.target.value)}
        />
      </label>
      <label className="flex flex-row items-center border border-white rounded-md p-3 w-full">
        <TbLockPassword className="h-6 w-6 mr-4 text-[#068fff]" />
        <input
          type="password"
          required
          placeholder="Password"
          minLength="8"
          pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
          title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
          className="w-full border-none outline-none text-sm text-white"
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button className="mt-2 self-center relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 w-full sm:w-32" type="submit">
        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_180deg_at_50%_50%,#068fff_0%,#00c2ff_25%,#a1e3ff_50%,#005eff_75%,#068fff_100%)]" />
        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-black px-3 py-1 font-medium text-white backdrop-blur-3xl">
          Register
        </span>
      </button>
    </form>
  );
}
