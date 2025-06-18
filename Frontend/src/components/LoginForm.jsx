import { useState } from "react";
import { FaMobileAlt } from "react-icons/fa";
import { TbLockPassword } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function LoginForm() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/login/", {
        number: phone,
        password: password
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      console.log("Login success:", response.data);
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      const isDriver = response.data.user.is_driver;
      if (isDriver) {
        navigate("/driver");
      } else {
        navigate("/user");
      }

    } catch (error) {
      if (error.response) {
        console.error("Login failed:", error.response.data);
        alert("Login failed: " + error.response.data.detail || "An error occurred");
      } else {
        console.error("Error:", error.message);
        alert("An error occurred: " + error.message);
      }
    }
    e.target.reset();
  };



  return (
    <form
      onSubmit={handleLogin}
      className="flex flex-col gap-4 py-6 px-4 w-full max-w-md mx-auto items-start bg-white "
      autoComplete="off"
    >
      <label className="flex flex-row items-center border rounded-md p-3 w-full">
        <FaMobileAlt className="h-6 w-6 mr-4 text-[#068fff]" />
        <input
          type="tel"
          className="tabular-nums w-full border-none outline-none text-sm"
          required
          placeholder="Phone"
          pattern="[0-9]*"
          minLength="10"
          maxLength="10"
          title="Must be 10 digits"
          onChange={(e) => setPhone(e.target.value)}
        />
      </label>
      <label className="flex flex-row items-center border rounded-md p-3 w-full">
        <TbLockPassword className="h-6 w-6 mr-4 text-[#068fff]" />
        <input
          type="password"
          required
          placeholder="Password"
          minLength="8"
          pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
          title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
          className="w-full border-none outline-none text-sm"
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button
        type="submit"
        className="rounded-lg bg-[#068fff] text-white w-full sm:w-32 h-10 self-center hover:bg-[#0577d5] transition"
      >
        Login
      </button>
    </form>
  );
}
