import requests
import os

def call_fastapi_llm(text):
    base_url = os.environ.get("LLM_URL")
    if not base_url:
        raise EnvironmentError("環境変数 \'LLM_URL\' が設定されていません")
    fastapi_endpoint_url = base_url + "/predict"
    try:
        response = requests.post(fastapi_endpoint_url , json={"message": text})
        response.raise_for_status()
        return True, response.json().get("response", "返答がありませんでした")
    except requests.exceptions.RequestException as e:
        return False, f"FastAPIサーバーへの接続に失敗しました: {e}"
