import { useState } from 'react';

export default function PaperResultsPage() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function analyze(event) {
    event.preventDefault();
    const file = event.currentTarget.elements.results.files[0];
    if (!file) return;
    setBusy(true); setError(''); setResult(null);
    try {
      if (file.size > 10 * 1024 * 1024) throw new Error('Choose a CSV smaller than 10 MiB.');
      const form = new FormData(); form.append('file', file);
      const base = (import.meta.env.VITE_PYTHON_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
      const response = await fetch(`${base}/paper/analyze`, { method: 'POST', body: form });
      const data = await response.json();
      if (!response.ok) throw new Error(typeof data.detail === 'string' ? data.detail : 'The CSV could not be analyzed.');
      setResult(data);
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }
  function download() {
    const url = URL.createObjectURL(new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' }));
    const a = document.createElement('a'); a.href = url; a.download = 'aaq-measured-results.json'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <section style={{ padding: '2rem', maxWidth: 1200, margin: 'auto' }}>
    <h1>AAQ measured benchmark results</h1>
    <p>Upload your JMH CSV to check coverage and inspect measured results. No reference scores are prefilled.</p>
    <form onSubmit={analyze}><label htmlFor="results">JMH CSV (maximum 10 MiB)</label>{' '}
      <input id="results" name="results" type="file" accept=".csv,text/csv" required disabled={busy}/>
      <button disabled={busy}>{busy ? 'Analyzing…' : 'Analyze results'}</button></form>
    <p>Required columns: Benchmark, Mode, Score, Unit, Param: size, Param: seed, Param: distribution. Param: algorithm is optional.</p>
    {error && <p role="alert">{error}</p>}
    {result && <div aria-live="polite"><h2>{result.rows.toLocaleString()} measured rows</h2>
      <p>Observed matrix: {result.observed_matrix_complete ? 'complete' : `${result.missing_observed_matrix_rows} combinations missing`}.</p>
      <p>Planned 6 × 15 × 5 × 30 dimensions: {result.matches_planned_dimensions ? 'match' : 'not matched'}.</p>
      <p>{result.interpretation}</p><button onClick={download}>Download analysis JSON</button>
      <div style={{ overflowX: 'auto' }}><table><caption>Descriptive scores grouped by algorithm, workload and size</caption>
      <thead><tr>{['Algorithm','Distribution','Size','Seeds','Mean','Median','Unit'].map(h=><th key={h}>{h}</th>)}</tr></thead>
      <tbody>{result.summary.map((row,i)=><tr key={i}>{[row.algorithm,row.distribution,row.size,row.seeds,row.mean.toPrecision(6),row.median.toPrecision(6),row.unit].map((v,j)=><td key={j}>{v}</td>)}</tr>)}</tbody></table></div>
      <p style={{ overflowWrap:'anywhere' }}>Source SHA-256: {result.sha256}</p></div>}
  </section>;
}
