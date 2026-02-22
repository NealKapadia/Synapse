import requests
import json
import os

API_KEY = os.environ.get("FEATHERLESS_API_KEY")

def test_featherless_api():
    url = "https://api.featherless.ai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "deepseek-ai/DeepSeek-V3-0324",
        "messages": [
            {"role": "user", "content": "Hello!"}
        ]
    }
    
    print(f"Sending request to {url} using model {payload['model']}...")
    try:
        response = requests.post(url=url, headers=headers, json=payload)
        response.raise_for_status()
        print("Response:")
        print(json.dumps(response.json(), indent=2))
    except requests.exceptions.RequestException as e:
        print(f"Error calling API: {e}")
        if response is not None:
            print(response.text)

if __name__ == "__main__":
    test_featherless_api()
