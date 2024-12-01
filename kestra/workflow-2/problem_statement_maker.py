import os
import json
import requests
import mysql.connector
from typing import Dict, Any
from datetime import datetime

class AdvancedProblemStatementGenerator:
    def __init__(self, api_key: str, db_config: Dict[str, str], model: str = "llama3-70b-8192"):
        """
        Initialize the Problem Statement Generator with API and Database Configuration

        Args:
            api_key (str): Groq API key
            db_config (dict): MySQL database configuration
            model (str): Groq model to use for generation
        """
        self.api_key = api_key
        self.model = model
        self.base_url = "https://api.groq.com/openai/v1/chat/completions"
        
        # Database configuration
        self.db_config = db_config

    def _generate_system_prompt(self) -> str:
        """Generate comprehensive system prompt for problem statement generation"""
        return """You are a world-class problem statement architect with expertise in:
        - Complex problem decomposition
        - Strategic problem framing
        - Multidisciplinary analysis
        - Technical and academic research synthesis

        Problem Statement Generation Guidelines:
        1. Decomposition Strategy
            - Break down complex problems into fundamental components
            - Identify root causes and systemic implications
            - Highlight interconnected challenges

        2. Comprehensive Problem Framing
            - Provide a crisp, intellectually rigorous problem title
            - Develop a nuanced, multi-dimensional problem description
            - Contextualize the problem within broader academic, technological, and societal frameworks

        3. Analytical Depth
            - Articulate key challenges with scientific precision
            - Present multiple perspectives and potential solution approaches
            - Demonstrate cross-disciplinary insights

        4. Resource Mapping
            - Curate high-quality, peer-reviewed academic resources
            - Include cutting-edge research publications
            - Reference authoritative institutional sources
            - Provide diverse, credible links spanning different domains

        5. Strategic Recommendation Framework
            - Propose actionable, research-driven next steps
            - Outline potential methodological approaches
            - Suggest preliminary research or investigation strategies

        Core Principles:
        - Prioritize intellectual honesty
        - Showcase systemic thinking
        - Demonstrate adaptability across diverse problem domains"""

    def generate_problem_statement(self, problem_text: str) -> Dict[str, Any]:
        """
        Generate a comprehensive problem statement using Groq API

        Args:
            problem_text (str): Raw problem description

        Returns:
            Dict: Structured problem statement with guaranteed keys
        """
        # Construct the full prompt
        prompt = f"""Transform the following problem text into a comprehensive problem statement:

Input Problem Text: {problem_text}

Please provide a response as a detailed JSON object with the following keys:
- problemTitle: str (concise, descriptive title)
- problemDescription: str (detailed, multi-dimensional explanation)
- keyDomains: list[str] (relevant domains/disciplines)
- criticalChallenges: list[dict] (challenges with explanations)
  * Each challenge should have 'title' and 'description' keys
- potentialApproaches: list[dict] (methodological approaches)
  * Each approach should have 'method' and 'insights' keys
- relevantResources: list[dict] (academic and professional resources)
  * Each resource should have 'title', 'type', and 'url' keys
- strategicRecommendations: list[dict] (actionable next steps)
  * Each recommendation should have 'step' and 'rationale' keys

Ensure academically rigorous, deep insights with comprehensive problem understanding."""

        # Prepare request payload
        payload = {
            "model": self.model,
            "messages": [
                {
                    "role": "system", 
                    "content": self._generate_system_prompt()
                },
                {
                    "role": "user", 
                    "content": prompt
                }
            ],
            "response_format": {"type": "json_object"},
            "temperature": 0.7,
            "max_tokens": 1500
        }

        # Send request to Groq API
        try:
            response = requests.post(
                self.base_url,
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                },
                json=payload
            )
            
            response.raise_for_status()
            
            # Parse the result and ensure all keys exist
            result = json.loads(response.json()['choices'][0]['message']['content'])
            
            # Validate and fill missing keys with defaults
            default_structure = {
                "problemTitle": "Untitled Problem",
                "problemDescription": "No description provided",
                "keyDomains": [],
                "criticalChallenges": [],
                "potentialApproaches": [],
                "relevantResources": [],
                "strategicRecommendations": []
            }
            
            # Merge the result with default structure
            for key, default_value in default_structure.items():
                result[key] = result.get(key, default_value)
            
            return result

        except requests.RequestException as e:
            return {
                "problemTitle": "Generation Error",
                "problemDescription": f"API Request Failed: {str(e)}",
                "keyDomains": [],
                "criticalChallenges": [],
                "potentialApproaches": [],
                "relevantResources": [],
                "strategicRecommendations": []
            }

    def store_problem_statement(self, problem_text: str, problem_statement: Dict[str, Any]) -> int:
        """
        Store problem statement in MySQL database

        Args:
            problem_text (str): Original problem text
            problem_statement (dict): Generated problem statement

        Returns:
            int: Inserted record ID
        """
        try:
            # Establish database connection
            connection = mysql.connector.connect(**self.db_config)
            cursor = connection.cursor()

            # Prepare SQL insertion
            insert_query = """
            INSERT INTO problem_statement 
            (problem_id, user_id, title, description, key_domains, 
            critical_challenges, potential_approaches, relevant_resources, 
            strategic_recommendations, created_at) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """

            # Convert complex structures to JSON strings
            values = (
                os.getenv('PROBLEM_ID', ''),
                os.getenv('USER_ID', ''),
                problem_statement['problemTitle'],
                problem_statement['problemDescription'],
                json.dumps(problem_statement['keyDomains']),
                json.dumps(problem_statement['criticalChallenges']),
                json.dumps(problem_statement['potentialApproaches']),
                json.dumps(problem_statement['relevantResources']),
                json.dumps(problem_statement['strategicRecommendations']),
                datetime.now()
            )

            print(values)
            # print("test: " + values)

            # Execute insertion
            cursor.execute(insert_query, values)
            connection.commit()
            
            record_id = cursor.lastrowid

            # Close connection
            cursor.close()
            connection.close()

            return record_id

        except mysql.connector.Error as err:
            print(f"MySQL Error: {err}")
            return -1

def main():
    # Replace with your actual credentials
    API_KEY = "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"

    # MySQL Database Configuration
    DB_CONFIG={
            'host': 'host url',
            'port': port,
            'user': 'user name',
            'password': 'password',
            'database': 'collaborativeIq'
        }
    

    
    # Initialize the generator
    generator = AdvancedProblemStatementGenerator(API_KEY, DB_CONFIG)
    
    # Example problem texts
    problem_texts = os.getenv('PROBLEM_DESCRIPTION', '')

    # Generate problem statement
    result = generator.generate_problem_statement(problem_texts)
        
    # Pretty print the result
    print(json.dumps(result, indent=2))
        
    # Store in database
    record_id = generator.store_problem_statement(problem_texts, result)
    print(f"Stored with Record ID: {record_id}")
    
         




if __name__ == "__main__":
    main()
