import React, { useEffect, useState } from 'react';
import { getParents } from '../api';

export default function Parents({ reg }) {
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getParents(reg)
      .then(r => setParents(r.data))
      .catch(() => setParents([]))
      .finally(() => setLoading(false));
  }, [reg]);

  if (loading) return <div className="loading">Loading parent details…</div>;
  if (!parents.length) return (
    <div className="empty">
      <div className="empty-icon">—</div>
      <p>No parent details found.</p>
    </div>
  );

  const fields = p => [
    ['Full Name',      p.name          || '—'],
    ['Occupation',     p.occupation    || '—'],
    ['Annual Income',  p.annual_income != null
                         ? `₹${Number(p.annual_income).toLocaleString('en-IN')}`
                         : '—'],
    ['Phone Number',   p.phone_no      || '—'],
    ['Email Address',  p.email         || '—'],
    ['Address',        p.address       || '—'],
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {parents.map(p => (
        <div key={p.parent_id} className="parent-card">
          {/* Coloured header */}
          <div className="parent-card-head">
            <div>
              <div className="parent-card-head-title">{p.name || p.relation}</div>
              <span className="parent-relation-badge">{p.relation}</span>
            </div>
          </div>

          {/* Vertical info rows */}
          <div style={{ padding: '0 24px' }}>
            <div className="info-vertical">
              {fields(p).map(([label, val]) => (
                <div key={label} className="info-row">
                  <span className="info-label">{label}</span>
                  <span className="info-value">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}