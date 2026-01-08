import json
import requests
import os

# Configuration
API_URL = "http://127.0.0.1:8000/api/generate"
SAMPLE_URL = "https://en.wikipedia.org/wiki/Steve_Jobs"
OUTPUT_DIR = "sample_data"

# Ensure directory exists
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

def generate_sample():
    print(f"Testing URL: {SAMPLE_URL}...")
    
    # 1. Save the URL to a text file
    with open(f"{OUTPUT_DIR}/urls.txt", "w") as f:
        f.write(f"Example 1: {SAMPLE_URL}\n")
        f.write("Example 2: https://en.wikipedia.org/wiki/Python_(programming_language)\n")
    print(f"✅ Saved urls.txt")

    # 2. Call the API
    try:
        response = requests.post(API_URL, json={"url": SAMPLE_URL})
        response.raise_for_status()
        data = response.json()

        # 3. Save the JSON output
        with open(f"{OUTPUT_DIR}/example_output.json", "w") as f:
            json.dump(data, f, indent=4)
        print(f"✅ Saved example_output.json")
        print("\nSuccess! Sample data generated.")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print("Make sure your Backend server is running!")

if __name__ == "__main__":
    generate_sample()