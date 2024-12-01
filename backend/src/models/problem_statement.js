import  db  from '../database.js';

class Problem_statement {
  static async findLast() {
    const [problem_statement] = await db.execute(
      'SELECT * FROM problem_statement ORDER BY problem_statement_id DESC LIMIT 1'
    );
    return problem_statement[0];
  }

}

export default Problem_statement;