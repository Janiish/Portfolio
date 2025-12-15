import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS

try:
    import openai
except Exception:
    openai = None

from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
if OPENAI_API_KEY and openai:
    openai.api_key = OPENAI_API_KEY

# Serve static files from the project directory so Flask can host the SPA
app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

SYSTEM_PROMPT = (
    "You are Cipher, a helpful cyberpunk-styled portfolio assistant. "
    "Answer user questions about the portfolio, explain concepts clearly, and give code-level guidance when relevant. "
    "Be concise but thorough. Use friendly tone."
)


def fallback_response(user_message: str) -> str:
    # Simple rule-based fallback if OpenAI key is not configured
    lower = user_message.lower()
    if 'project' in lower:
        return "I see you're asking about projects — check the Projects section for demos and descriptions. Ask me about a specific project for details."
    if 'skill' in lower or 'experience' in lower:
        return "The Skills section shows proficiency. I can explain what each skill means or how you might learn it."
    if 'how' in lower or 'help' in lower:
        return "Ask me anything about this portfolio, the mascot Cipher, or how the site was built — HTML, CSS, or JavaScript."
    return "Nice question — I don't have an API key configured, so I'm answering from local rules. Provide more context or set an OPENAI_API_KEY to enable richer replies."


@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json() or {}
    user_message = data.get('message', '').strip()
    if not user_message:
        return jsonify({'error': 'No message provided'}), 400

    # If OpenAI is available and key present, proxy the request
    if OPENAI_API_KEY and openai:
        try:
            # Build simple chat history with system prompt and user message
            messages = [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message},
            ]
            resp = openai.ChatCompletion.create(
                model=os.getenv('OPENAI_MODEL', 'gpt-3.5-turbo'),
                messages=messages,
                max_tokens=800,
                temperature=0.15,
            )
            ai_text = resp['choices'][0]['message']['content'].strip()
            return jsonify({'reply': ai_text})
        except Exception as e:
            return jsonify({'error': 'OpenAI request failed', 'details': str(e)}), 500

    # Fallback
    reply = fallback_response(user_message)
    return jsonify({'reply': reply})


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_static(path):
    # Serve files from the project root (index.html, styles.css, script.js, etc.)
    if path == '':
        return app.send_static_file('index.html')
    return app.send_static_file(path)


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
