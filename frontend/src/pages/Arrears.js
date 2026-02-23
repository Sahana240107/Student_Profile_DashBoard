import React, { useEffect, useState } from 'react';
import { getArrears } from '../api';

const STATUS_CHIP = {
  Cleared: 'chip chip-green',
  Pending: 'chip chip-red',
  'Re-Do': 'chip chip-orange',
};

export default function Arrears({ reg }) {
  const [arrears, setArrears] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getArrears(reg).then(r => setArrears(r.data)).catch(() => setArrears([])).finally(() => setLoading(false));
  }, [reg]);

  if (loading) return <div className="loading">⏳ Loading arrear details…</div>;

  const pending = arrears.filter(a => a.status === 'Pending').length;
  const cleared = arrears.filter(a => a.status === 'Cleared').length;
  const redo    = arrears.filter(a => a.status === 'Re-Do').length;

  return (
    <>
      {/* Summary stats */}
      <div className="stat-row">
        <div className="stat-box"><div className="stat-num col-blue">{arrears.length}</div><div className="stat-lbl">Total</div></div>
        <div className="stat-box"><div className="stat-num col-red">{pending}</div><div className="stat-lbl">Pending</div></div>
        <div className="stat-box"><div className="stat-num col-green">{cleared}</div><div className="stat-lbl">Cleared</div></div>
        <div className="stat-box"><div className="stat-num col-orange">{redo}</div><div className="stat-lbl">Re-Do</div></div>
      </div>

      <div className="card">
        <div className="card-head">⚠️ Details of Arrears & RE-DO</div>
        {arrears.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">✅</div>
            <p>No arrears — clean academic record!</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Semester</th>
                  <th>Course Code</th>
                  <th>Course Name</th>
                  <th>Internals</th>
                  <th>Name of Advisor</th>
                  <th>Cleared Sem</th>
                  <th>Grade</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {arrears.map((a, i) => (
                  <tr key={a.arrear_id}>
                    <td>{i + 1}</td>
                    <td>Sem {a.semester_failed}</td>
                    <td><code>{a.course_code}</code></td>
                    <td>{a.subject_name}</td>
                    <td>{a.internal_marks ?? '—'}</td>
                    <td>{a.advisor_name || '—'}</td>
                    <td>{a.cleared_semester ? `Sem ${a.cleared_semester}` : '—'}</td>
                    <td>{a.cleared_grade
                      ? <span className="chip chip-blue">{a.cleared_grade}</span>
                      : '—'}
                    </td>
                    <td>
                      <span className={STATUS_CHIP[a.status] || 'chip chip-gray'}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}