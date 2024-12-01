const express = require("express");
const solutionController = require("../controllers/solutionController");

const router = express.Router();

router.post("/create", solutionController.createSolution);

module.exports = router;
