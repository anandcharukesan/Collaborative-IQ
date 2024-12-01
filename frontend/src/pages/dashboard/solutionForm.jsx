import React, { useState } from "react";
import axios from "axios";

const SolutionForm = () => {
  const [solutionName, setSolutionName] = useState("");
  const [solutionDescription, setSolutionDescription] = useState("");
  const [entrepreneurId, setEntrepreneurId] = useState("");
  const [solutionLink, setSolutionLink] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !solutionName ||
      !solutionDescription ||
      !entrepreneurId ||
      !solutionLink
    ) {
      setMessage("All fields are required.");
      return;
    }

    const solutionData = {
      solution_name: solutionName,
      solution_description: solutionDescription,
      entrepreneur_id: entrepreneurId,
      solution_link: solutionLink,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/solutions/create",
        solutionData
      );
      setMessage(response.data.message);
      setSolutionName("");
      setSolutionDescription("");
      setEntrepreneurId("");
      setSolutionLink("");
    } catch (error) {
      console.error("Error creating solution:", error);
      setMessage("There was an error creating the solution.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 border rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Create Solution
      </h2>

      {message && <div className="mb-4 text-center text-black">{message}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Solution Name</label>
          <input
            type="text"
            value={solutionName}
            onChange={(e) => setSolutionName(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Solution Description</label>
          <textarea
            value={solutionDescription}
            onChange={(e) => setSolutionDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Entrepreneur ID</label>
          <input
            type="text"
            value={entrepreneurId}
            onChange={(e) => setEntrepreneurId(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Solution Link</label>
          <input
            type="url"
            value={solutionLink}
            onChange={(e) => setSolutionLink(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="px-6 py-2 bg-black text-white rounded-md hover:bg-black"
          >
            Create Solution
          </button>
        </div>
      </form>
    </div>
  );
};

export default SolutionForm;
