import React, { useState } from "react";

const DashboardComponent = () => {
  const [inputText, setInputText] = useState("");

  const handleChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the submission logic here
    alert(`Submitted: ${inputText}`);
    setInputText(""); // Clear the input after submission
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
            rows={8} // Optional, still usable
            style={{
              height: "100px", // Customize height
              width: "700px", // Customize width
            }}
            className="p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-black focus:outline-none mb-4"
          />
          <button
            type="submit"
            className="w-36 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition duration-200"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default DashboardComponent;
