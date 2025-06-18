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
      <button
        type="submit"
        className="rounded-lg bg-[#068fff] text-white w-full sm:w-32 h-10 self-center hover:bg-[#0577d5] transition"
      >
        Register
      </button>
    </form>
  );
}
