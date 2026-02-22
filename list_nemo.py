import os
import requests
from dotenv import load_dotenv
load_dotenv(".env.local")
API_KEY = os.environ.get("FEATHERLESS_API_KEY")
response = requests.get("https://api.featherless.ai/v1/models", headers={"Authorization": f"Bearer {API_KEY}"})
if response.status_code == 200:
    data = response.json()
    for m in data.get("data", []):
        if "nemo" in m["id"].lower():
            print(m["id"])
else:
    print(response.status_code)
