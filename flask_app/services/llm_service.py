import requests
import os

def call_fastapi_llm(text):
    url = os.environ.get("LLM_URL") + "/predict"
    try:
        response = requests.post(url, json={"message": text})
        response.raise_for_status()
        return True, response.json().get("response", "返答がありませんでした")
    except requests.exceptions.RequestException as e:
        return False, f"FastAPIサーバーへの接続に失敗しました: {e}"
