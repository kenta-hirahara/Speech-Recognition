from flask import Blueprint, request, render_template, jsonify
import os
from openai import OpenAI

main = Blueprint('main', __name__)

@main.route("/", methods=["GET"])
def index():
    return render_template("index.html")

@main.route("/", methods=["POST"])
def process_text():
    # parse JSON data
    data = request.get_json()
    if not data or 'text' not in data:  # 'text' matches the key in frontend fetch
        return jsonify({'error': 'Invalid input'}), 400
    
    result_text = data['text']
    openai_ans = openai_inference(result_text)
    print(openai_ans)
    return jsonify({'answer': openai_ans})

def openai_inference(input_text):
    import os
    from openai import OpenAI
    client = OpenAI( api_key=os.environ.get("OPENAI_API_KEY"))
    prompt = f"""
    次の質問に簡潔に回答してください。
    質問: {input_text}
    """
    chat_completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
    )

    return chat_completion.choices[0].message.content

