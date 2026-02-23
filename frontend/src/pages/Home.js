import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchStudents } from '../api';

export default function Home() {
  const [query,   setQuery]   = useState('');
  const [results, setResults] = useState([]);
  const [open,    setOpen]    = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const wrapRef  = useRef();

  // close dropdown on outside click
  useEffect(() => {
    const fn = e => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  // debounced search
  useEffect(() => {
    if (!query.trim()) { setResults([]); setOpen(false); return; }
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const { data } = await searchStudents(query.trim());
        setResults(data);
        setOpen(true);
      } catch { setResults([]); }
      finally { setLoading(false); }
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const pick = (reg) => { setOpen(false); setQuery(''); navigate(`/student/${reg}/profile`); };

  return (
    <div className="home-hero">
      <h1>Student Profile System</h1>
      <p>Search by register number or student name to view a complete profile</p>

      <div className="search-wrap" ref={wrapRef}>
        <span className="search-icon-abs">🔍</span>
        <input
          className="search-input"
          placeholder="Search register no or name…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => results.length && setOpen(true)}
        />
        {open && (
          <div className="search-drop">
            {results.length === 0 && !loading && (
              <div className="search-row" style={{ color: '#94a3b8', cursor: 'default' }}>
                No students found
              </div>
            )}
            {results.map(s => (
              <div key={s.register_no} className="search-row" onClick={() => pick(s.register_no)}>
                <div>
                  <strong>{s.name}</strong>
                  <span style={{ marginLeft: 8, fontSize: 12, color: '#94a3b8' }}>{s.degree} · {s.department}</span>
                </div>
                <span className="search-meta">#{s.register_no}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="feature-grid">
        {[
          { icon: '👤', title: 'Student Profiles',   desc: 'Complete student information at a glance' },
          { icon: '📚', title: 'Academic Records',    desc: 'Semester marks, grades & GPA tracking' },
          { icon: '🏆', title: 'Achievements',        desc: 'Year-wise accomplishments & placements' },
        ].map(f => (
          <div key={f.title} className="feature-tile">
            <div className="fi">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}