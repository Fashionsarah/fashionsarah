import React, { useState } from 'react';

export default function AuditTool() {
  const [auditQuery, setAuditQuery] = useState('');
  const [results, setResults] = useState(null);

  const handleAudit = async () => {
    try {
      const response = await fetch(`https://fashionsarah.onrender.com/api/audit?url=${encodeURIComponent(auditQuery)}`);
      const data = await response.json();

      if (!response.ok) {
        setResults({ error: true, message: data.message || "Audit failed" });
      } else {
        setResults(data);
      }
    } catch (err) {
      setResults({ error: true, message: "Unexpected error: " + err.message });
    }
  };

  return (
    <>
      <h2>SEO Site Audit</h2>
      <input
        type="text"
        value={auditQuery}
        onChange={(e) => setAuditQuery(e.target.value)}
        placeholder="https://example.com"
      />
      <button onClick={handleAudit}>Audit</button>
      {results && (
        <pre>
          {results.error ? `❌ Error: ${results.message}` : JSON.stringify(results, null, 2)}
        </pre>
      )}
    </>
  );
}
