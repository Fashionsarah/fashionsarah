import React, { useState } from 'react';
import axios from 'axios';

export default function KeywordTool() {
  const [keyword, setKeyword] = useState('');
  const [result, setResult] = useState(null);

  const handleSearch = async () => {
    const res = await axios.get(`https://fashionsarah.onrender.com/api/keyword?q=${keyword}`);
    setResult(res.data);
  };

  return (
    <div>
      <h2>Keyword Research</h2>
      <input value={keyword} onChange={e => setKeyword(e.target.value)} />
      <button onClick={handleSearch}>Search</button>
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}