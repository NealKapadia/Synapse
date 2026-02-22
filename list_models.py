import os
import json
import requests
from dotenv import load_dotenv

load_dotenv(".env.local")
API_KEY = os.environ.get("FEATHERLESS_API_KEY")

def list_models():
    url = "https://api.featherless.ai/v1/models"
    headers = {
        "Authorization": f"Bearer {API_KEY}",
    }
    response = requests.get(url=url, headers=headers)
    if response.status_code == 200:
        data = response.json()
        models = [m['id'] for m in data.get('data', [])]
        for m in models:
            if 'meta-llama' in m.lower():
                print(m)
        for m in models:
            if 'qwen' in m.lower():
                print(m)
    else:
        print(f"Error {response.status_code}")

list_models()
