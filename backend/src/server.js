const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const solutionRoutes = require('./routes/solutionRoutes');


const app = express();
const PORT = 5000;

// Middleware
app.use(cors());  // Enable CORS
app.use(bodyParser.json());

// Routes
app.use('/api/users', userRoutes);
app.use("/api/solutions", solutionRoutes);

// Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
