import os
import json
import mysql.connector
import requests
from groq import Groq
from typing import Dict, Any, Optional
from datetime import datetime
from kestra import Kestra

class ProblemStatementHandler:
    def __init__(self, 
                 groq_api_key: str, 
                 mysql_config: Dict[str, str], 
                 kestra_webhook_url: str,
                 current_user_id: str):
        """
        Initialize the Problem Statement Handler
        
        :param groq_api_key: API key for Groq
        :param mysql_config: Configuration for MySQL connection
        :param kestra_webhook_url: Webhook URL for Kestra
        :param current_user_id: ID of the current user
        """
        self.groq_client = Groq(api_key=groq_api_key)
        self.mysql_config = mysql_config
        self.kestra_webhook_url = kestra_webhook_url
        self.current_user_id = current_user_id

    def _get_mysql_connection(self):
        """
        Create and return a MySQL database connection
        """
        return mysql.connector.connect(**self.mysql_config)

    def _semantic_similarity_check(self, input_problem: Dict[str, str], existing_problems: list) -> Dict:
        """
        Use Groq to perform semantic similarity check
        
        :param input_problem: User's input problem (title and description)
        :param existing_problems: List of existing problems with title and description
        :return: Similarity check result
        """
        # Prepare the input and existing problems for analysis
        input_problem_str = f"Title: {input_problem.get('title', '')} Description: {input_problem.get('description', '')}"
        existing_problems_str = "\n".join([
            f"Title: {prob['title']} Description: {prob['description']}" 
            for prob in existing_problems
        ])
        
        prompt = f"""
        Analyze semantic similarity between the following problems:
        
        Input Problem:
        {input_problem_str}
        
        Existing Problems:
        {existing_problems_str}
        
        Determine if the input problem is semantically similar to any existing problems.
        
        Respond with a JSON containing:
        - is_similar: true/false
        - matched_problem: title of the most similar existing problem (if any)
        - similarity_score: numerical score of similarity (0-100)
        
        Focus on thematic overlap, core challenges, and conceptual similarities.
        """
        
        try:
            chat_completion = self.groq_client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model="llama3-70b-8192",
                response_format={"type": "json_object"}
            )
            
            return json.loads(chat_completion.choices[0].message.content)
        except Exception as e:
            return {
                "is_similar": False,
                "matched_problem": None,
                "similarity_score": 0,
                "error": str(e)
            }

    def process_problem_statement(self, problem_query: Dict[str, str]) -> Dict[str, Any]:
        """
        Process the problem statement
        
        :param problem_query: Input problem details
        :return: Processing result
        """

        try:
            # Establish MySQL Connection
            connection = self._get_mysql_connection()
            cursor = connection.cursor(dictionary=True)
            
            # Fetch existing problem statements with title and description
            cursor.execute("""
                SELECT problem_statement_id, title, description 
                FROM problem_statement
            """)
            existing_problems = cursor.fetchall()
            
            # Semantic Similarity Check
            similarity_result = self._semantic_similarity_check(problem_query, existing_problems)
            
            # If similar problem found
            if similarity_result.get('is_similar', False):
                # Find the matching problem
                matched_problem = next(
                    (prob for prob in existing_problems 
                     if prob['title'] == similarity_result['matched_problem']), 
                    None
                )
                
                if matched_problem:
                    # Check for existing solutions
                    # print("match")
                    Kestra.outputs(
                    {
                        "status": "similar_problem_found",
                        "is_trigger": False
                    })
                    # print("log check")
                    cursor.execute("""
                    SELECT * FROM solutions
                    WHERE solution_for = %s
                    """, (matched_problem['problem_statement_id'],))
                   
                    existing_solution = cursor.fetchone()
                    # print("matched_problem543 error must be here")
                    # If no existing solution, add one
                    if existing_solution:
                        # print("match2")
                        return {
                            existing_solution
                        }
                        
                    # print("match3")
                    insert_query = """
                    INSERT INTO upvotes 
                    (upvoted_by, voted_at, upvoted_for) 
                    VALUES (%s, %s, %s)
                    """

                    # Convert complex structures to JSON strings
                    values = (
                    os.getenv('USER_ID', ''),
                    datetime.now(),
                    matched_problem['problem_statement_id']
                    )

                
                    cursor.execute(insert_query, values)
                    connection.commit()

                    
                    return {
                        "status": "similar_problem_found",
                        "problem_id": matched_problem['problem_statement_id'],
                        "title": matched_problem['title'],
                        "description": matched_problem['description'],
                        "similarity_score": similarity_result.get('similarity_score', 0)
                    }

            print("test2")
            # If no similar problem, trigger webhook
            # response = requests.post(self.kestra_webhook_url, json={
                
            # })

            Kestra.outputs(
            {
                "status": "new_problem",
                "is_trigger": True
            })
            
            return {
                "status": "new_problem",
                "webhook_url": self.kestra_webhook_url,
                "problem_query": problem_query,
                "created_by": self.current_user_id,
                "timestamp": datetime.now().isoformat()
            }
        
        except Exception as e:
            return {
                "status": "error",
                "message": str(e)
            }
        
        finally:
            if connection and connection.is_connected():
                connection.close()

# Example Usage
def main():
    print("test")
    handler = ProblemStatementHandler(
        groq_api_key='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',
        mysql_config={
            'host': 'mysql-83d1e8d-iqcollaborative-ea09.e.aivencloud.com',
            'port': 21505,
            'user': 'avnadmin',
            'password': 'AVNS_7fXFdQalrC_FpC7bLrD',
            'database': 'collaborativeIq'
        },
        kestra_webhook_url='http://localhost:8080/api/v1/executions/webhook/company.team/mysql_batch/4wjtkzwVGBM9yKnjm3yv8r',
        current_user_id=os.getenv('USER_ID', '')
    )
    
    problem_query = {
        "title": os.getenv('PROBLEM_TITLE', ''),
        "description": os.getenv('PROBLEM_DESCRIPTION', ''),
        'user_id': os.getenv('USER_ID', '')
    }
    
    result = handler.process_problem_statement(problem_query)
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()
