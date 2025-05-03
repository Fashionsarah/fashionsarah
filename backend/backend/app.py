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
    if not url or not url.startswith("http"):
        return jsonify({ "error": True, "message": "Invalid URL. Include http:// or https://" }), 400

    psi_url = f"https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url={url}&key={GOOGLE_PSI_KEY}"

    try:
        response = requests.get(psi_url)
        print("📤 Request to PSI URL:", psi_url)
        print("📄 PSI response headers:", response.headers)
        print("📄 PSI response text (first 300 chars):", response.text[:300])

        if 'application/json' not in response.headers.get('Content-Type', ''):
            return jsonify({
                "error": True,
                "message": "Google PSI returned HTML instead of JSON. Likely invalid key or quota exceeded.",
                "status_code": response.status_code
            }), 502

        return jsonify(response.json())

    except Exception as e:
        print("❌ Exception during audit:", e)
        return jsonify({ "error": True, "message": str(e) }), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
