import React, { useEffect, useState } from 'react';
import { getProjects } from '../api';

export default function Projects({ reg }) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProjects(reg)
      .then(r => setData(r.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [reg]);

  if (loading) return <div className="loading">Loading projects & placements…</div>;
  if (!data)   return <div className="empty"><div className="empty-icon">—</div><p>No data found.</p></div>;

  const { projects, placements } = data;
  const internships = placements.filter(p => p.type === 'Internship');
  const placed      = placements.filter(p => p.type === 'Placement');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Project Details ── */}
      <div className="parent-card">
        <div className="parent-card-head">
          <div className="parent-card-head-title">Project Details</div>
        </div>
        {projects.length === 0 ? (
          <div className="empty" style={{ padding: 32 }}>
            <p>No project details available.</p>
          </div>
        ) : (
          projects.map((pr, idx) => (
            <div key={pr.project_id} style={{ borderBottom: idx < projects.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ padding: '0 24px' }}>
                <div className="info-vertical">
                  <div className="info-row">
                    <span className="info-label">Project Title</span>
                    <span className="info-value" style={{ fontWeight: 700 }}>{pr.project_title}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Guide Name</span>
                    <span className="info-value">{pr.guide_name || '—'}</span>
                  </div>
                  {pr.semester && (
                    <div className="info-row">
                      <span className="info-label">Semester</span>
                      <span className="info-value">Semester {pr.semester}</span>
                    </div>
                  )}
                  {pr.year && (
                    <div className="info-row">
                      <span className="info-label">Year</span>
                      <span className="info-value">Year {pr.year}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Internship ── */}
      <div className="parent-card">
        <div className="parent-card-head">
          <div className="parent-card-head-title">Internship</div>
        </div>
        {internships.length === 0 ? (
          <div className="empty" style={{ padding: 32 }}>
            <p>No internship records found.</p>
          </div>
        ) : (
          internships.map((p, idx) => (
            <div key={p.placement_id} style={{ borderBottom: idx < internships.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ padding: '0 24px' }}>
                <div className="info-vertical">
                  <div className="info-row">
                    <span className="info-label">Company</span>
                    <span className="info-value" style={{ fontWeight: 700 }}>{p.company_name}</span>
                  </div>
                  {p.package_lpa && (
                    <div className="info-row">
                      <span className="info-label">Stipend / Package</span>
                      <span className="info-value" style={{ color: 'var(--success)', fontWeight: 700 }}>₹{p.package_lpa} LPA</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Placement ── */}
      <div className="parent-card">
        <div className="parent-card-head">
          <div className="parent-card-head-title">Placement</div>
        </div>
        {placed.length === 0 ? (
          <div className="empty" style={{ padding: 32 }}>
            <p>Not yet placed.</p>
          </div>
        ) : (
          placed.map((p, idx) => (
            <div key={p.placement_id} style={{ borderBottom: idx < placed.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ padding: '0 24px' }}>
                <div className="info-vertical">
                  <div className="info-row">
                    <span className="info-label">Company</span>
                    <span className="info-value" style={{ fontWeight: 700 }}>{p.company_name}</span>
                  </div>
                  {p.package_lpa && (
                    <div className="info-row">
                      <span className="info-label">Package</span>
                      <span className="info-value" style={{ color: 'var(--success)', fontWeight: 700 }}>₹{p.package_lpa} LPA</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}