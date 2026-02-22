import os
from dotenv import load_dotenv
import requests

load_dotenv(".env.local")
API_KEY = os.environ.get("FEATHERLESS_API_KEY")

def test_model(model_name):
    url = "https://api.featherless.ai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": model_name,
        "messages": [
            {"role": "user", "content": "Hello!"}
        ]
    }
    response = requests.post(url=url, headers=headers, json=payload)
    print(f"Model: {model_name}")
    print(response.status_code)

test_model("deepseek-ai/DeepSeek-R1")
test_model("meta-llama/Llama-3-70b-chat-hf")
test_model("Qwen/Qwen2.5-72B-Instruct")
test_model("Qwen/Qwen2.5-32B-Instruct")
test_model("NousResearch/Hermes-3-Llama-3.1-8B")
