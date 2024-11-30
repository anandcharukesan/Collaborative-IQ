import React, { useState } from "react";
import axios from "axios";

const Login = () => {
  const [isUserLogin, setIsUserLogin] = useState(true); // Toggle between User and Entrepreneur login
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const endpoint = "http://localhost:5000/api/users/login";
      const payload = isUserLogin
        ? {
            email: formData.email,
            password: formData.password,
          }
        : {
            email: formData.username, // Assuming entrepreneur uses email as username
            password: formData.password,
          };

      const response = await axios.post(endpoint, payload);

      if (response.data.success) {
        alert("Login successful!");
        // Redirect user to dashboard or perform other actions
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-80">
      <h2 className="text-xl font-bold mb-4">
        {isUserLogin ? "User Login" : "Entrepreneur Login"}
      </h2>
      <form onSubmit={handleSubmit}>
        {isUserLogin ? (
          <>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <button
              type="submit"
              className="w-full bg-black text-white p-2 rounded"
            >
              Login
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <input
              type="password"
              name="password"
              placeholder="Entrepreneur Password"
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <button
              type="submit"
              className="w-full bg-black text-white p-2 rounded"
            >
              Login
            </button>
          </>
        )}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <p className="mt-4 text-sm text-center">
          <button
            type="button"
            onClick={() => setIsUserLogin(!isUserLogin)}
            className="text-black hover:underline"
          >
            Switch to {isUserLogin ? "Entrepreneur" : "User"} Login
          </button>
        </p>
        <p className="mt-2 text-sm text-center">
          Don't have an account?{" "}
          <a href="/register" className="text-black hover:underline">
            Register here
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
