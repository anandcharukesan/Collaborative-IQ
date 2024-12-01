// DashboardComponent.jsx
import React, { useState } from "react";
import axios from "axios"; // Import Axios for making API calls

const DashboardComponent = () => {
  const [inputText, setInputText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the input is not empty
    if (!inputText.trim()) {
      setError("Please enter a question.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Send POST request with the input text to your backend
      const response = await axios.post("http://localhost:5000/api/submit", {
        question: inputText,
      });

      if (response.status === 200) {
        setSuccess("Your question has been submitted successfully!");
        setInputText(""); // Clear input after successful submission
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while submitting your question.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-20 items-center justify-center h-screen p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Unleash your curiosity
        </h2>
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Ask anything..."
            value={inputText}
            onChange={handleChange}
            required
            rows={8}
            style={{
              height: "100px",
              width: "700px",
            }}
            className="p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-black focus:outline-none mb-4"
          />
          <button
            type="submit"
            className="w-36 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition duration-200"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Send"}
          </button>
        </form>

        {error && (
          <div className="mt-4 text-red-500 text-center">
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="mt-4 text-green-500 text-center">
            <p>{success}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardComponent;
