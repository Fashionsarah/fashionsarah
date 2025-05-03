import React, { useState } from 'react';
import axios from 'axios';

export default function AuditTool() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);

  const handleAudit = async () => {
  const response = await fetch(`/api/audit?url=${encodeURIComponent(auditQuery)}`);
  const data = await response.json();

  if (!response.ok) {
    setResults({ error: true, message: data.message || "Audit failed" });
  } else {
    setResults(data);
  }
};

{results && (
  <pre>
    {results.error 
      ? `❌ Error: ${results.message}` 
      : JSON.stringify(results, null, 2)}
  </pre>
)}

