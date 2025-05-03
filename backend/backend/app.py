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
    
    # Validation
    if not url or not url.startswith("http"):
        return jsonify({'error': True, 'message': 'Invalid or missing URL. Include http:// or https://'}), 400

    # Build PSI API URL
    psi_key = os.getenv("GOOGLE_PSI_KEY")
    psi_url = f"https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url={url}&key={psi_key}"

    try:
        response = requests.get(psi_url)
        content_type = response.headers.get('Content-Type', '')

        # Debug info to Render logs
        print("🔍 PSI request URL:", psi_url)
        print("📄 Content-Type:", content_type)

        if 'application/json' not in content_type:
            print("⚠️ HTML response instead of JSON:", response.text[:300])
            return jsonify({'error': True, 'message': 'PSI API returned HTML instead of JSON. Check API key or quota.'}), 500

        return jsonify(response.json())

    except Exception as e:
        print("❌ Exception during audit request:", e)
        return jsonify({'error': True, 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
