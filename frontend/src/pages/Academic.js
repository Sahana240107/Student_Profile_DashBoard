import React, { useEffect, useState } from 'react';
import { getAcademic } from '../api';

// colour-map grades to chip variants
function gradeChip(grade) {
  if (!grade) return null;
  const g = grade.toUpperCase();
  let cls = 'chip chip-blue';
  if (g === 'O' || g === 'A+') cls = 'chip chip-green';
  else if (g === 'A')           cls = 'chip chip-blue';
  else if (g === 'B+' || g === 'B') cls = 'chip chip-orange';
  else                          cls = 'chip chip-red';
  return <span className={cls}>{grade}</span>;
}

export default function Academic({ reg }) {
  const [data,      setData]      = useState(null);
  const [activeSem, setActiveSem] = useState(null);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    setLoading(true);
    getAcademic(reg)
      .then(r => {
        setData(r.data);
        const sems = [...new Set(r.data.subjects.map(s => s.semester))].sort((a,b) => a-b);
        setActiveSem(sems[0] ?? null);
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [reg]);

  if (loading) return <div className="loading">⏳ Loading academic details…</div>;
  if (!data)   return <div className="empty"><div className="empty-icon">📚</div><p>No academic data found.</p></div>;

  const semesters = [...new Set(data.subjects.map(s => s.semester))].sort((a,b) => a-b);
  const filtered  = data.subjects.filter(s => s.semester === activeSem);
  const gpaMap    = Object.fromEntries(data.gpas.map(g => [g.semester, Number(g.gpa)]));
  const cgpa      = data.gpas.length
    ? (data.gpas.reduce((sum, g) => sum + Number(g.gpa), 0) / data.gpas.length).toFixed(2)
    : null;

  return (
    <>
      {/* GPA strip */}
      {data.gpas.length > 0 && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-head">📈 Semester GPA</div>
          <div className="card-body">
            <div className="gpa-strip">
              {data.gpas.map(g => (
                <div key={g.semester} className="gpa-tile">
                  <div className="gpa-sem">Sem {g.semester}</div>
                  <div className="gpa-val">{Number(g.gpa).toFixed(2)}</div>
                </div>
              ))}
              {cgpa && (
                <div className="gpa-tile cgpa">
                  <div className="gpa-sem">CGPA</div>
                  <div className="gpa-val">{cgpa}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Subject table */}
      <div className="card">
        <div className="card-head">📚 Subject Details</div>
        <div className="card-body" style={{ paddingBottom: 0 }}>
          <div className="tab-strip">
            {semesters.map(sem => (
              <button
                key={sem}
                className={`tab-btn${activeSem === sem ? ' active' : ''}`}
                onClick={() => setActiveSem(sem)}
              >
                Semester {sem}
                {gpaMap[sem] && (
                  <span style={{ marginLeft: 6, fontSize: 11, opacity: .8 }}>
                    GPA: {gpaMap[sem].toFixed(2)}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Course Code</th>
                <th>Subject Name</th>
                <th>Type</th>
                <th>Credit</th>
                <th>Internal Mark</th>
                <th>Grade</th>
                <th>Result</th>
                <th>Attempt</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} style={{ textAlign: 'center', color: '#94a3b8', padding: 30 }}>No subjects for this semester.</td></tr>
              ) : filtered.map((s, i) => (
                <tr key={s.academic_id}>
                  <td>{i + 1}</td>
                  <td><code>{s.course_code}</code></td>
                  <td>{s.subject_name}</td>
                  <td><span className="chip chip-blue" style={{ fontSize: 11 }}>{s.subject_type}</span></td>
                  <td>{s.credit}</td>
                  <td>{s.internal_mark ?? '—'}</td>
                  <td>{gradeChip(s.grade)}</td>
                  <td>
                    <span className={`chip ${s.result === 'Pass' ? 'chip-pass' : s.result === 'Fail' ? 'chip-fail' : 'chip-orange'}`}>
                      {s.result || '—'}
                    </span>
                  </td>
                  <td>{s.attempt_no}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}