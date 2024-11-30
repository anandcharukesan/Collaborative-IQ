import React, { useState } from "react";

const LoginComponent = () => {
  const [isUserLogin, setIsUserLogin] = useState(true);
  const [credentials, setCredentials] = useState({
    registrationNumber: "",
    password: "",
    username: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Form submitted!");
    // Add your login logic here...
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
              placeholder="email"
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <input
              type="password"
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

export default LoginComponent;
