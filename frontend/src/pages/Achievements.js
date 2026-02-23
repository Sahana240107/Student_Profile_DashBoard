import React, { useEffect, useState } from 'react';
import { getAchievements } from '../api';

export default function Achievements({ reg }) {
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAchievements(reg).then(r => setData(r.data)).catch(() => setData([])).finally(() => setLoading(false));
  }, [reg]);

  if (loading) return <div className="loading">⏳ Loading achievements…</div>;
  if (!data.length) return (
    <div className="empty"><div className="empty-icon">🏆</div><p>No achievements recorded yet.</p></div>
  );

  // group by year
  const grouped = { 1: [], 2: [], 3: [], 4: [] };
  data.forEach(a => { if (grouped[a.year]) grouped[a.year].push(a); });

  return (
    <div className="card">
      <div className="card-head">🏆 Achievements</div>
      <div className="card-body">
        {[1, 2, 3, 4].map(yr => (
          <div key={yr} className="ach-group">
            <div className="ach-year-label">Year {yr}</div>
            {grouped[yr].length > 0
              ? grouped[yr].map(a => (
                  <div key={a.achievement_id} className="ach-item">{a.title}</div>
                ))
              : <div className="ach-item" style={{ color: 'var(--muted)', borderLeftColor: '#cbd5e1' }}>No achievements recorded for Year {yr}.</div>
            }
          </div>
        ))}
      </div>
    </div>
  );
}