// Login.jsx

import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

import {
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  LoaderCircle,
} from "lucide-react";

import { motion } from "motion/react";

const Login = ({ setToken }) => {
  const navigate = useNavigate();

  const serverUrl = import.meta.env.VITE_SERVER_URL;

  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await axios.post(
        `${serverUrl}/api/auth/login`,
        loginData,
      );

      if (response.data.success) {
        toast.success(response.data.message);

        localStorage.setItem("token", response.data.token);

        setToken(response.data.token);

        navigate("/");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error while Login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center px-4 py-10 overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute top-[-120px] left-[-100px] w-[320px] h-[320px] bg-cyan-500/20 blur-[120px] rounded-full"></div>

      <div className="absolute bottom-[-120px] right-[-100px] w-[320px] h-[320px] bg-violet-600/20 blur-[120px] rounded-full"></div>

      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:45px_45px]" />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 70 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-[30px] p-8 shadow-[0_0_60px_rgba(6,182,212,0.2)]">
          {/* App Name */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Sparkles className="text-white" size={28} />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-white">Chatie Chat</h1>

              <p className="text-gray-400 text-sm">
                Premium Messaging Platform
              </p>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-white">Welcome Back 👋</h2>

            <p className="text-gray-400 mt-2">
              Login to continue your premium chat experience.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={loginData.email}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-500 outline-none focus:border-cyan-500 focus:bg-white/10 transition-all"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={loginData.password}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-500 outline-none focus:border-violet-500 focus:bg-white/10 transition-all"
                required
              />
            </div>

            {/* Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              type="submit"
              className="w-full cursor-pointer bg-gradient-to-r from-cyan-500 to-blue-600 py-4 rounded-2xl text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-all"
            >
              {loading ? (
                <>
                  <LoaderCircle className="animate-spin" size={20} />
                  Logging in...
                </>
              ) : (
                <>
                  Login
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <ShieldCheck size={16} className="text-green-400" />
              Secure Authentication
            </div>

            <Link
              to="/signup"
              className="text-cyan-400 hover:text-cyan-300 transition"
            >
              Create new account
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
