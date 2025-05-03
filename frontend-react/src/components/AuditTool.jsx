import React, { useState } from 'react';

export default function AuditTool() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

const handleAudit = async () => {
  try {
    const response = await fetch(`/api/audit?url=${encodeURIComponent(url)}`);
    const text = await response.text();

    try {
      const data = JSON.parse(text);

      if (!response.ok) {
        setError(data.message || 'Audit failed');
        setResult(null);
      } else {
        setResult(data);
        setError(null);
      }
    } catch (parseError) {
      console.error('Failed to parse JSON:', text);
      setError('Server returned invalid JSON');
    }
  } catch (err) {
    console.error('Unexpected fetch error:', err);
    setError('Unexpected error occurred.');
    setResult(null);
  }
};

  const renderAuditResults = () => {
    if (!result?.lighthouseResult) return null;

    const audits = result.lighthouseResult.audits;

    const metricsToShow = [
      'first-contentful-paint',
      'speed-index',
      'largest-contentful-paint',
      'interactive',
      'total-blocking-time',
      'cumulative-layout-shift'
    ];

    return (
      <div>
        <h3>Audit Results for: {result.id}</h3>
        <ul>
          {metricsToShow.map((key) => {
            const audit = audits[key];
            return (
              <li key={key}>
                <strong>{audit.title}:</strong> {audit.displayValue || audit.numericValue} ({audit.score * 100}/100)
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <div>
      <h2>SEO Site Audit</h2>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com"
        style={{ width: '300px' }}
      />
      <button onClick={handleAudit}>Audit</button>

      {error && <p style={{ color: 'red' }}>❌ Error: {error}</p>}
      {renderAuditResults()}
    </div>
  );
}
