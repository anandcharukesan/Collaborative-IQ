const Solution = require("../models/solutionModel");

const createSolution = (req, res) => {
  const { solution_name, solution_description, entrepreneur_id, solution_link } = req.body;

  if (!solution_name || !solution_description || !entrepreneur_id || !solution_link) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const data = { solution_name, solution_description, entrepreneur_id, solution_link };

  Solution.create(data, (err, result) => {
    if (err) {
      console.error("Error creating solution:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    res.status(201).json({ message: "Solution created successfully!", solutionId: result.insertId });
  });
};

module.exports = {
  createSolution,
};
