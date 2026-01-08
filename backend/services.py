import requests
from bs4 import BeautifulSoup
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
import json
import os
import re
from dotenv import load_dotenv

# Load environment variables (API keys)
load_dotenv()

# Initialize Groq LLM (Llama 3.3)
# Updated model name because the old one was decommissioned
llm = ChatGroq(
    temperature=0.3,
    model_name="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY")
)

def scrape_wikipedia(url: str):
    """
    Fetches the HTML content of a Wikipedia page and extracts the main text.
    """
    try:
        # --- User-Agent Header ---
        # Wikipedia blocks requests without a User-Agent string.
        headers = {
            "User-Agent": "WikiQuizApp/1.0 (Educational Project; contact: yourname@example.com)"
        }
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')

        # Get Title
        title_tag = soup.find(id="firstHeading")
        title = title_tag.text if title_tag else "Unknown Title"
        
        # Get Main Content Text
        content_div = soup.find(id="mw-content-text")
        if not content_div:
            raise Exception("Could not find article content on this page.")
            
        paragraphs = content_div.find_all('p')
        
        # Join the first 15 paragraphs for context
        # We limit text size to avoid sending too much to the AI
        text_content = "\n".join([p.text for p in paragraphs[:15] if len(p.text) > 50])
        
        if not text_content:
            raise Exception("No readable text found in this article.")

        # Get Section Headers
        headers = soup.find_all(['h2', 'h3'])
        sections = [h.text.replace('[edit]', '').strip() for h in headers]
        
        # Filter out utility sections
        ignored_sections = ['Contents', 'References', 'External links', 'See also', 'Notes']
        clean_sections = [s for s in sections if s not in ignored_sections][:5]
        
        return {
            "title": title,
            "text": text_content,
            "sections": clean_sections
        }
    except Exception as e:
        print(f"Scraping Error: {e}")  # Prints error to terminal for debugging
        raise Exception(f"Error scraping URL: {str(e)}")

def generate_quiz_content(scraped_data: dict):
    """
    Sends the text to Groq (Llama 3) and asks for a JSON response.
    """
    
    prompt_template = """
    You are an AI teacher. Read the following text about "{title}" and generate a quiz.
    
    TEXT CONTENT:
    {text_content}
    
    INSTRUCTIONS:
    1. Create a 50-word summary.
    2. Extract key entities (People, Organizations, Locations).
    3. Generate 5 multiple-choice questions. Each question must have:
       - 'difficulty' (easy, medium, or hard)
       - 'explanation' (why the answer is correct)
    4. Suggest 3 related topics.
    
    FORMAT:
    Strictly output valid JSON only. Do not add markdown blocks like ```json.
    
    JSON STRUCTURE:
    {{
        "summary": "...",
        "key_entities": {{
            "people": [],
            "organizations": [],
            "locations": []
        }},
        "quiz": [
            {{
                "question": "...",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "answer": "Option B",
                "difficulty": "medium",
                "explanation": "..."
            }}
        ],
        "related_topics": []
    }}
    """
    
    prompt = PromptTemplate(
        template=prompt_template,
        input_variables=["title", "text_content"]
    )
    
    # Call the API
    chain = prompt | llm
    response = chain.invoke({
        "title": scraped_data["title"],
        "text_content": scraped_data["text"]
    })
    
    # Clean the output string to ensure it's pure JSON
    clean_json_string = response.content.strip()
    # Remove markdown code blocks if the AI added them
    clean_json_string = re.sub(r'^```json', '', clean_json_string)
    clean_json_string = re.sub(r'```$', '', clean_json_string)
    
    try:
        return json.loads(clean_json_string)
    except json.JSONDecodeError:
        # Fallback if the JSON is malformed
        raise Exception("AI returned invalid JSON data. Please try again.")