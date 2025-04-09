# flask_app/services/openai_service.py
from openai import OpenAI
import os

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

def generate_answer(input_text, model="gpt-4o-mini"):
    """OpenAI APIを使用して回答を生成する"""

    prompt = f"""
    次の質問に簡潔に回答してください。
    質問: {input_text}
    """
    
    try:
        chat_completion = client.chat.completions.create(
            model=model,
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
        )
        return chat_completion.choices[0].message.content
    except Exception as e:
        # document error to the log and return apology
        print(f"OpenAI API error: {str(e)}")
        raise
