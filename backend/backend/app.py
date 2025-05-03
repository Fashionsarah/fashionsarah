from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
import re

app = Flask(__name__)
CORS(app)

SERP_API_KEY = os.getenv("SERP_API_KEY")
GOOGLE_PSI_KEY = os.getenv("GOOGLE_PSI_KEY")

# Simple URL validation
def is_valid_url(url):
    return re.match(r'^https?://', url)

@app.route('/api/keyword')
def keyword_search():
    query = request.args.get('q')
    url = f"https://serpapi.com/search.json?q={query}&api_key={SERP_API_KEY}"
    response = requests.get(url)
    return jsonify(response.json())

@app.route('/api/audit')
def site_audit():
    url = request.args.get('url')

    if not url or not is_valid_url(url):
        return jsonify({"error": True, "message": "Invalid or missing URL"}), 400

    psi_url = f"https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url={url}&key={GOOGLE_PSI_KEY}"
    response = requests.get(psi_url)

    try:
        data = response.json()
    except ValueError:
        return jsonify({"error": True, "message": "Invalid response from PageSpeed API"}), 502

    return jsonify(data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
