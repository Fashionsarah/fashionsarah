import React, { useState } from 'react';
import axios from 'axios';

export default function AuditTool() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);

  const handleAudit = async () => {
    const res = await axios.get(`https://fashionsarah.onrender.com/api/audit?url=${url}`);
    setResult(res.data);
  };

  return (
    <div>
      <h2>SEO Site Audit</h2>
      <input value={url} onChange={e => setUrl(e.target.value)} />
      <button onClick={handleAudit}>Audit</button>
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}