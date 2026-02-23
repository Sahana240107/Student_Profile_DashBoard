import React, { useEffect, useState } from 'react';
import { getParents } from '../api';

const RELATION_ICON = { Father: '👨', Mother: '👩', Guardian: '🧑' };

export default function Parents({ reg }) {
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getParents(reg).then(r => setParents(r.data)).catch(() => setParents([])).finally(() => setLoading(false));
  }, [reg]);

  if (loading) return <div className="loading">⏳ Loading parent details…</div>;
  if (!parents.length) return (
    <div className="empty"><div className="empty-icon">👨‍👩‍👦</div><p>No parent details found.</p></div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {parents.map(p => (
        <div key={p.parent_id} className="card">
          <div className="card-head">
            <span>{RELATION_ICON[p.relation] || '👤'}</span>
            {p.relation} Details
          </div>
          <div className="card-body">
            <div className="info-grid">
              {[
                ['Relation',      p.relation      || '—'],
                ['Name',          p.name          || '—'],
                ['Occupation',    p.occupation    || '—'],
                ['Annual Income', p.annual_income != null
                                    ? `₹${Number(p.annual_income).toLocaleString('en-IN')}`
                                    : '—'],
                ['Phone No',      p.phone_no      || '—'],
                ['Email',         p.email         || '—'],
              ].map(([label, val]) => (
                <div key={label} className="info-item">
                  <span className="info-label">{label}</span>
                  <span className="info-value">{val}</span>
                </div>
              ))}
              <div className="info-item full-col">
                <span className="info-label">Address</span>
                <span className="info-value">{p.address || '—'}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}