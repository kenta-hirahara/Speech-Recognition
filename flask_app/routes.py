from flask import Blueprint, request, render_template, jsonify
from flask_app.services.openai_service import generate_response

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
        openai_ans = generate_response(result_text)
        print(openai_ans)
        return jsonify({'answer': openai_ans})
    except Exception as e:
        return jsonify({'error': f'処理中にエラーが発生しました: {str(e)}'}), 500
