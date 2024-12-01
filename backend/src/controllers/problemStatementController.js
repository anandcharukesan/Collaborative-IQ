import Problem_statement from "../models/problem_statement.js";

export const getProblemStatements = async (req, res) => {
    try {
        const problem_statement = await Problem_statement.findLast();
        
        
        res.status(200).json({data : problem_statement});
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

