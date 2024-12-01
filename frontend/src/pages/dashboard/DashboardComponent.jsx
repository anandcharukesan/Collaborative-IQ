import React, { useState } from "react";
import axios from "axios";

const DashboardComponent = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [problemData, setProblemData] = useState(null);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input fields
    if (!title.trim() || !description.trim()) {
      setError("Both title and description are required.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const user = localStorage.getItem("user");
      console.log(user);
      
      // Step 1: Trigger Kestra Workflow
      const kestraResponse = await axios.post('http://localhost:8080/api/v1/executions/webhook/company.team/workflow_1/7yxBdQmT32KLzvNw6WpQr4', {
        title: title,
        description: description,
        created_by: user.id,
        created_at: new Date().toISOString()
    });

      if (kestraResponse.status === 200) {
        const executionId = kestraResponse.data.executionId;

        // Step 2: Poll the Express API
        const pollExecutionStatus = async () => {
          try {
            const expressResponse = await axios.get(
              `http://localhost:8080/api/v1/executions/${executionId}`
            );

            if (expressResponse.data.state === "SUCCESS") {
              clearInterval(pollingInterval);

              // Display the problem data returned from Express
              const response = await axios.get(`http://localhost:5000/api/problem_statements/get-last`)
              setProblemData(expressResponse.data.problem);
              setSuccess("Problem retrieved successfully!");
            }
          } catch (pollError) {
            console.error("Error polling execution status:", pollError);
            setError("An error occurred while polling execution status.");
          }
        };

        // Poll every 30 seconds
        const pollingInterval = setInterval(pollExecutionStatus, 30000);
      } else {
        setError("Failed to initiate workflow in Kestra.");
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
          Submit a Problem Statement
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={handleTitleChange}
            required
            className="p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none mb-4 w-full"
          />
          <textarea
            placeholder="Enter description"
            value={description}
            onChange={handleDescriptionChange}
            required
            rows={8}
            className="p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-black focus:outline-none mb-4 w-full"
          />
          <button
            type="submit"
            className="w-36 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition duration-200"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
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

        {problemData && (
          <div className="mt-6 bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-2">Problem Details:</h3>
            <p>
              <strong>Title:</strong> {problemData.title}
            </p>
            <p>
              <strong>Description:</strong> {problemData.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardComponent;
