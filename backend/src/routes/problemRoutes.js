import express from 'express';
import { getProblemStatements } from '../controllers/problemStatementController.js';

const router = express.Router();

router.get("/get-last", getProblemStatements);

export default router;
