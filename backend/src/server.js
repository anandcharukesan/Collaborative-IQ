import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import problem_statement_router from './routes/problemRoutes.js';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());  // Enable CORS
app.use(bodyParser.json()); // Parse JSON bodies

// Routes
app.use('/api/users', userRoutes);
app.use('/api/problem_statements', problem_statement_router);

// Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
