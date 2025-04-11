import requests

def call_fastapi_llm(text):
    url = "https://e936-34-125-91-115.ngrok-free.app" + "/predict"  # ngrokのURLに合わせて
    try:
        response = requests.post(url, json={"message": text})
        response.raise_for_status()
        return response.json().get("response", "返答がありませんでした")
    except requests.exceptions.RequestException as e:
        return f"FastAPIサーバーへの接続に失敗しました: {e}"
