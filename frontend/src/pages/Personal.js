import React, { useEffect, useState } from 'react';
import { getPersonal } from '../api';

export default function Personal({ reg }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getPersonal(reg)
      .then(r => setData(r.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [reg]);

  if (loading) return <div className="loading">Loading personal details…</div>;
  if (!data)   return <div className="empty"><div className="empty-icon">✗</div><p>No personal details found.</p></div>;

  const admitted = data.admitted_on ? new Date(data.admitted_on).toLocaleDateString('en-IN') : '—';
  const hostelMap = {};
  (data.hostel || []).forEach(h => { hostelMap[h.year] = h; });

  const fields = [
    ['Admitted On',             admitted],
    ['Cutoff Mark',             data.cutoff_mark           ?? '—'],
    ['Community',               data.community              || '—'],
    ['Blood Group',             data.blood_group            || '—'],
    ['Special Category',        data.special_category       || '—'],
    ['Scholarship',             data.scholarship            || '—'],
    ['Volunteer Activity',      data.volunteer_activity     || '—'],
    ['Hobbies',                 data.hobbies                || '—'],
    ['Hosteller / Day Scholar', data.day_scholar_hosteller  || '—'],
  ];

  return (
    <>
      <div className="card">
        <div className="card-head">Personal Information</div>
        <div className="card-body" style={{ padding: '0 22px' }}>
          <div className="info-vertical">
            {fields.map(([label, val]) => (
              <div key={label} className="info-row">
                <span className="info-label">{label}</span>
                <span className="info-value">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {data.day_scholar_hosteller === 'Hosteller' && (
        <div className="card">
          <div className="card-head">Hostel Details</div>
          <div className="card-body">
            {data.hostel && data.hostel.length > 0 ? (
              <div className="hostel-grid">
                {[1, 2, 3, 4].map(yr => {
                  const h = hostelMap[yr];
                  return (
                    <div key={yr} className="hostel-cell">
                      <div className="hostel-cell-yr">Year {yr}</div>
                      <div className="hostel-cell-val">
                        <div>Block: {h?.block  || '—'}</div>
                        <div>Room:  {h?.room_no || '—'}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ color: 'var(--muted)' }}>No hostel records found.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}