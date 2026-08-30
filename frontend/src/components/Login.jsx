import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { Link,useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        BASE_URL + "/login",
        { emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(response.data));
      return navigate("/");
    } catch (err) {
      setError(err?.response?.data || "Invalid Credentials");
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg">
            <span className="text-3xl font-bold text-black">D</span>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-light text-center text-white mb-8">
          Sign in to DevMatch
        </h1>

        {/* Login Card */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">

          {/* Email */}
          <div className="form-control mb-5">
            <label className="label">
              <span className="label-text text-white font-semibold">
                Email address
              </span>
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={emailId}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full bg-[#0d1117] border-[#30363d] text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Password */}
          <div className="form-control mb-6">
            <div className="flex justify-between mb-2">
              <label className="label p-0">
                <span className="label-text text-white font-semibold">
                  Password
                </span>
              </label>

              <a
                href="#"
                className="text-sm text-blue-400 hover:underline"
              >
                Forgot password?
              </a>
            </div>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full bg-[#0d1117] border-[#30363d] text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Login Button */}
          <button
            className="btn w-full bg-[#238636] hover:bg-[#2ea043] border-none text-white text-base"
            onClick={handleLogin}
          >
            Sign in
          </button>

          {/* Error Message */}
          {error && (
            <div className="alert alert-error mt-4 py-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="divider text-gray-500 my-7">or</div>

        {/* Google Button */}
        <button className="btn w-full bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            width="22"
            height="22"
          >
            <path
              fill="#FFC107"
              d="M43.6 20.5H42V20H24v8h11.3C33.6 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
            />
            <path
              fill="#FF3D00"
              d="M6.3 14.7l6.6 4.8C14.7 15.4 19 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c5.2 0 10-2 13.6-5.3l-6.3-5.2C29.2 35.7 26.7 36 24 36c-5.2 0-9.6-3.3-11.2-8l-6.5 5C9.6 39.6 16.2 44 24 44z"
            />
            <path
              fill="#1976D2"
              d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.3 5.4-6.3 6.9l6.3 5.2C39 36.5 44 31 44 24c0-1.3-.1-2.4-.4-3.5z"
            />
          </svg>

          Continue with Google
        </button>

        {/* Create Account */}
        <div className="border border-[#30363d] rounded-lg p-4 mt-6 text-center">
          <span className="text-white">
            New to DevMatch?{" "}
          </span>

          <Link to="/signup"
            
            className="text-blue-400 hover:underline"
          >
            Create an account
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;