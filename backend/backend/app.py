from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
CORS(app)

SERP_API_KEY = os.getenv("SERP_API_KEY")
GOOGLE_PSI_KEY = os.getenv("GOOGLE_PSI_KEY")

@app.route('/api/keyword')
def keyword_search():
    query = request.args.get('q')
    url = f"https://serpapi.com/search.json?q={query}&api_key={SERP_API_KEY}"
    response = requests.get(url)
    return jsonify(response.json())

@app.route('/api/audit')
def site_audit():
    url = request.args.get('url')
    if not url:
        return jsonify({'error': True, 'message': 'Missing URL parameter'}), 400

    psi_url = f"https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url={url}&key={GOOGLE_PSI_KEY}"

    try:
        response = requests.get(psi_url)
        if response.headers.get('Content-Type') != 'application/json':
            print("Non-JSON response:", response.text[:300])
            return jsonify({'error': True, 'message': 'Received non-JSON response from API'}), 500

        return jsonify(response.json())
    except Exception as e:
        print("Audit error:", e)
        return jsonify({'error': True, 'message': str(e)}), 500

@app.route('/')
def home():
    return 'API is running!'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
