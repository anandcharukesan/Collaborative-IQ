const express = require("express");
const cors = require("cors");

const app = express();

// Configure CORS
app.use(cors({
  origin: "http://localhost:5173", // Replace with your frontend's URL
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  credentials: true, // Allow credentials if needed
}));

// Other middleware and routes...

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
