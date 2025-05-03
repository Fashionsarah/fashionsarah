import React, { useState } from 'react';

function AuditTool() {
  const [auditQuery, setAuditQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAudit = async () => {
    let url = auditQuery.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    setLoading(true);
    setResults(null);

    try {
      const response = await fetch(`/api/audit?url=${encodeURIComponent(auditQuery)}`);
      const data = await response.json();

      if (!response.ok || data.error) {
        setResults({ error: true, message: data.message || 'Audit failed. Please try again.' });
      } else {
        setResults(data);
      }
    } catch (error) {
      setResults({ error: true, message: 'Unexpected error: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc', marginTop: '2rem' }}>
      <h2>🔍 SEO Site Audit</h2>
      <input
        type="text"
        value={auditQuery}
        onChange={(e) => setAuditQuery(e.target.value)}
        placeholder="Enter URL (e.g. fashionsarah.com or https://example.com)"
        style={{ width: '80%', padding: '0.5rem', marginBottom: '0.5rem' }}
      />
      <br />
      <button onClick={handleAudit} disabled={loading}>
        {loading ? 'Auditing...' : 'Run Audit'}
      </button>

      {results && (
        <pre style={{ background: '#f9f9f9', padding: '1rem', marginTop: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
          {results.error
            ? `❌ Error: ${results.message}`
            : JSON.stringify(results, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default AuditTool;
