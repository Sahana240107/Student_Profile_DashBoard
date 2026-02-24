import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStudent } from '../api';

const SECTIONS = [
  { key: 'personal',     label: 'Personal Details',     desc: 'Blood group, community, hostel info' },
  { key: 'parents',      label: 'Parent Details',        desc: 'Father, mother & guardian info' },
  { key: 'academic',     label: 'Academic Details',      desc: 'Subject marks, grades & semester GPA' },
  { key: 'arrears',      label: 'Arrear Details',        desc: 'Arrear & RE-DO tracking' },
  { key: 'achievements', label: 'Achievements',          desc: 'Year-wise accomplishments' },
  { key: 'projects',     label: 'Projects & Placements', desc: 'Project, internship & placement info' },
];

export default function Profile({ reg }) {
  const [student,  setStudent]  = useState(null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    setLoading(true);
    getStudent(reg)
      .then(r => setStudent(r.data))
      .catch(() => setStudent(null))
      .finally(() => setLoading(false));
  }, [reg]);

  if (loading) return <div className="loading">Loading profile…</div>;
  if (!student) return <div className="empty"><div className="empty-icon">✗</div><p>Student not found.</p></div>;

  const initials = student.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';
  const dob      = student.dob ? new Date(student.dob).toLocaleDateString('en-IN') : '—';
  const admitted = student.admitted_on ? new Date(student.admitted_on).toLocaleDateString('en-IN') : '—';

  const quickTiles = [
    { label: 'Degree',     value: student.degree     || '—' },
    { label: 'Department', value: student.department || '—' },
    { label: 'Admitted',   value: admitted },
    { label: 'Status',     value: student.status     || '—' },
  ];

  return (
    <>
      {/* Banner */}
      <div className="student-banner">
        <div className="avatar">{initials}</div>
        <div className="banner-meta">
          <h1>{student.name}</h1>
          <p>{student.degree} &middot; {student.department}</p>
          <div className="badge-row">
            <span className="badge badge-blue">Year {student.year_of_study}</span>
            <span className="badge badge-blue">Semester {student.current_semester}</span>
            <span className="badge badge-gray">{student.day_scholar_hosteller || '—'}</span>
            <span className={`badge ${student.status === 'Active' ? 'badge-green' : student.status === 'Passed Out' ? 'badge-gray' : 'badge-orange'}`}>
              {student.status}
            </span>
          </div>
        </div>
        {/* Register number box — top right of banner */}
        <div className="banner-reg-box">
          <div className="banner-reg-label">Register No</div>
          <div className="banner-reg-value">{student.register_no}</div>
        </div>
      </div>

      {/* Quick-info tiles */}
      <div className="quick-tiles">
        {quickTiles.map(t => (
          <div key={t.label} className="quick-tile">
            <div className="quick-tile-label">{t.label}</div>
            <div className="quick-tile-value">{t.value}</div>
          </div>
        ))}
      </div>

      {/* Basic info card — vertical rows */}
      <div className="card" style={{ marginBottom: 22 }}>
        <div className="card-head">Basic Information</div>
        <div style={{ padding: '0 22px' }}>
          <div className="info-vertical">
            {[
              ['Register No',   <span className="reg-box">{student.register_no}</span>],
              ['Full Name',     student.name],
              ['Date of Birth', dob],
              ['Gender',        student.gender],
              ['Phone No',      student.phone_no || '—'],
              ['Email',         student.email    || '—'],
              ['Year of Study', student.year_of_study ? `Year ${student.year_of_study}` : '—'],
              ['Semester',      student.current_semester ? `Semester ${student.current_semester}` : '—'],
              ['Status',        student.status],
            ].map(([label, val]) => (
              <div key={label} className="info-row">
                <span className="info-label">{label}</span>
                {typeof val === 'string' || typeof val === 'number'
                  ? <span className="info-value">{val}</span>
                  : val}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section navigation cards */}
      <div className="section-card-grid">
        {SECTIONS.map(s => (
          <Link key={s.key} to={`/student/${reg}/${s.key}`} className="section-card">
            <div>
              <div className="section-card-label">{s.label}</div>
              <div className="section-card-desc">{s.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}