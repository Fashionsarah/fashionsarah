import React, { useState } from 'react';

function AuditTool() {
  const [auditQuery, setAuditQuery] = useState('');
  const [results, setResults] = useState(null);

  const handleAudit = async () => {
    if (!auditQuery.startsWith('http://') && !auditQuery.startsWith('https://')) {
      setResults({ error: true, message: 'Please include http:// or https:// in the URL.' });
      return;
    }

    try {
      const response = await fetch(`/api/audit?url=${encodeURIComponent(auditQuery)}`);
      const data = await response.json();

      if (!response.ok) {
        setResults({ error: true, message: data.message || 'Audit failed.' });
      } else {
        setResults(data);
      }
    } catch (error) {
      setResults({ error: true, message: error.message });
    }
  };

  return (
    <div>
      <h2>SEO Site Audit</h2>
      <input
        type="text"
        value={auditQuery}
        onChange={(e) => setAuditQuery(e.target.value)}
        placeholder="Enter full URL (e.g. https://vogue.com)"
      />
      <button onClick={handleAudit}>Audit</button>
      {results && (
        <pre>
          {results.error
            ? `❌ Error: ${results.message}`
            : JSON.stringify(results, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default AuditTool;
