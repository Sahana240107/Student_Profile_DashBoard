import React, { useEffect, useState } from 'react';
import { getProjects } from '../api';

export default function Projects({ reg }) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProjects(reg).then(r => setData(r.data)).catch(() => setData(null)).finally(() => setLoading(false));
  }, [reg]);

  if (loading) return <div className="loading">⏳ Loading projects & placements…</div>;
  if (!data)   return <div className="empty"><div className="empty-icon">💼</div><p>No data found.</p></div>;

  const { projects, placements } = data;
  const internships  = placements.filter(p => p.type === 'Internship');
  const placed       = placements.filter(p => p.type === 'Placement');

  return (
    <>
      {/* Projects */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-head">🔬 Project Details</div>
        {projects.length === 0 ? (
          <div className="empty" style={{ padding: 24 }}>
            <div className="empty-icon" style={{ fontSize: 28 }}>🔬</div>
            <p>No project details available.</p>
          </div>
        ) : (
          <div className="card-body">
            {projects.map(pr => (
              <div key={pr.project_id} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Project Title</span>
                    <span className="info-value" style={{ fontWeight: 700, fontSize: 15 }}>{pr.project_title}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Guide Name</span>
                    <span className="info-value">{pr.guide_name || '—'}</span>
                  </div>
                  {pr.semester && (
                    <div className="info-item">
                      <span className="info-label">Semester</span>
                      <span className="info-value">Semester {pr.semester}</span>
                    </div>
                  )}
                  {pr.year && (
                    <div className="info-item">
                      <span className="info-label">Year</span>
                      <span className="info-value">Year {pr.year}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Placements & Internships side by side */}
      <div className="two-col">
        <div className="card">
          <div className="card-head">🏢 Placements</div>
          {placed.length === 0 ? (
            <div className="empty" style={{ padding: 24 }}>
              <div className="empty-icon" style={{ fontSize: 24 }}>🏢</div>
              <p>Not yet placed.</p>
            </div>
          ) : (
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {placed.map(p => (
                <div key={p.placement_id} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div className="info-item">
                    <span className="info-label">Company</span>
                    <span className="info-value" style={{ fontWeight: 700 }}>
                      <span className="badge badge-green">✅ {p.company_name}</span>
                    </span>
                  </div>
                  {p.package_lpa && (
                    <div className="info-item">
                      <span className="info-label">Package</span>
                      <span className="info-value" style={{ fontWeight: 700, color: 'var(--success)' }}>
                        ₹{p.package_lpa} LPA
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-head">💻 Internships</div>
          {internships.length === 0 ? (
            <div className="empty" style={{ padding: 24 }}>
              <div className="empty-icon" style={{ fontSize: 24 }}>💻</div>
              <p>No internship records.</p>
            </div>
          ) : (
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {internships.map(p => (
                <div key={p.placement_id} className="ach-item">
                  {p.company_name}
                  {p.package_lpa && <span style={{ marginLeft: 10, color: 'var(--success)', fontWeight: 700 }}>₹{p.package_lpa} LPA</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}