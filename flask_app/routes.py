from flask import Blueprint, request, render_template, jsonify
from flask_app.services.openai_service import generate_answer
import openai

main = Blueprint('main', __name__)

@main.route("/", methods=["GET"])
def index():
    return render_template("index.html")

@main.route("/", methods=["POST"])
def process_text():
    # parse JSON data
    data = request.get_json()
    if not data or 'text' not in data:  # 'text' matches the key in frontend fetch
        return jsonify({'error': 'テキストが入力されていません'}), 400
    if not data['text']:
        return jsonify({'error': 'テキストが空です'}), 400
    
    try:
        result_text = data['text']
        openai_ans = generate_answer(result_text)
        print(openai_ans)
        return jsonify({'answer': openai_ans})
    except openai.APIError as e:
        #Handle API error here, e.g. retry or log
        return jsonify({'error': f"OpenAI API returned an API Error: {str(e)}"})
    except openai.APIConnectionError as e:
        #Handle connection error here
        return jsonify({'error': f"Failed to connect to OpenAI API: {str(e)}"})
    except openai.RateLimitError as e:
        #Handle rate limit error
        return jsonify({'error': f"OpenAI API request exceeded rate limit: {str(e)}"})
    except Exception as e:
        return jsonify({'error': f'Error occurred during processing: {str(e)}'}), 500
