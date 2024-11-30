import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/register",
        {
          name: credentials.username,
          email: credentials.email,
          password: credentials.password,
          is_entrepreneur: credentials.role === "ENTREPRENEUR",
        }
      );

      if (response.data.success) {
        setSuccess(true);
        setCredentials({
          username: "",
          email: "",
          password: "",
          role: "",
        });
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-80">
      <h2 className="text-xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={credentials.username}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={credentials.email}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <select
          name="role"
          value={credentials.role}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded mb-4"
        >
          <option value="" disabled>
            Select Role
          </option>
          <option value="USER">User</option>
          <option value="ENTREPRENEUR">Entrepreneur</option>
        </select>
        <button
          type="submit"
          className="w-full bg-black text-white p-2 rounded"
        >
          Register
        </button>
      </form>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {success && (
        <p className="text-green-500 text-sm mt-2">
          Registration successful! You can now{" "}
          <a href="/auth" className="text-black hover:underline">
            Login here
          </a>
          .
        </p>
      )}
      <p className="mt-4 text-sm text-center">
        Already have an account?{" "}
        <a href="/auth" className="text-black hover:underline">
          Login here
        </a>
      </p>
    </div>
  );
};

export default Register;
