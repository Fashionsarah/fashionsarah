import React, { useState } from 'react';

export default function AuditTool() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAudit = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    let fullUrl = url.trim();
    if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
      fullUrl = 'https://' + fullUrl;
    }

    try {
      const response = await fetch(`/api/audit?url=${encodeURIComponent(fullUrl)}`);
      const text = await response.text();

      try {
        const data = JSON.parse(text);

        if (!response.ok || data.error) {
          setError(data.message || 'Audit failed.');
        } else {
          setResult(data);
        }
      } catch (jsonError) {
        console.error('Not JSON:', text);
        setError('Server returned invalid response');
      }
    } catch (err) {
      console.error('Fetch failed:', err);
      setError('Network or server error');
    }

    setLoading(false);
  };

  const renderAuditResults = () => {
    if (!result?.lighthouseResult) return null;

    const audits = result.lighthouseResult.audits;

    const get = (key) => audits[key]?.displayValue || 'N/A';
    const score = (s) => s ? s * 100 : 0;

    return (
      <div style={{ background: '#f9f9f9', padding: '1rem', marginTop: '1rem', borderRadius: '8px' }}>
        <h3>Audit Results for: {result.id}</h3>
        <ul>
          <li><strong>Performance Score:</strong> {score(result.lighthouseResult.categories.performance.score)}/100</li>
          <li><strong>First Contentful Paint:</strong> {get('first-contentful-paint')}</li>
          <li><strong>Largest Contentful Paint:</strong> {get('largest-contentful-paint')}</li>
          <li><strong>Total Blocking Time:</strong> {get('total-blocking-time')}</li>
          <li><strong>Time to Interactive:</strong> {get('interactive')}</li>
          <li><strong>Cumulative Layout Shift:</strong> {get('cumulative-layout-shift')}</li>
        </ul>
      </div>
    );
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '600px' }}>
      <h2>🔍 SEO Site Audit</h2>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com"
        style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
      />
      <button onClick={handleAudit} disabled={loading}>
        {loading ? 'Auditing...' : 'Run Audit'}
      </button>

      {error && (
        <p style={{ color: 'red', marginTop: '1rem' }}>❌ Error: {error}</p>
      )}

      {renderAuditResults()}

      {result && !result?.lighthouseResult && !error && (
        <pre style={{ background: '#eee', padding: '1rem', marginTop: '1rem' }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
