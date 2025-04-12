from flask import Blueprint, request, render_template, jsonify
from flask_app.services.llm_service import call_fastapi_llm

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
        success, ai_ans = call_fastapi_llm(result_text)
        if success:
            print(f'Success: {ai_ans}')
            return jsonify({'ai_answer': ai_ans})
        else:
            print(f'Error: {ai_ans}')
            return jsonify({'ai_answer': ai_ans}), 500

    except Exception as e:
        return jsonify({'error': f'予期せぬエラーが発生しました: {str(e)}'}), 500
