const db = require("../database");

const Solution = {
  create: (data, callback) => {
    const query = `
      INSERT INTO solutions (solution_name, solution_description, entrepreneur_id, created_at, solution_link)
      VALUES (?, ?, ?, NOW(), ?)
    `;
    const values = [
      data.solution_name,
      data.solution_description,
      data.entrepreneur_id,
      data.solution_link,
    ];
    db.query(query, values, callback);
  },
};

module.exports = Solution;
