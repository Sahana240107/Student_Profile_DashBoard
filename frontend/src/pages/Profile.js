import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStudent } from '../api';

const SECTIONS = [
  { key: 'personal',     icon: '📋', label: 'Personal Details',      desc: 'Blood group, community, hostel info' },
  { key: 'parents',      icon: '👨‍👩‍👦', label: 'Parent Details',         desc: 'Father, mother & guardian info' },
  { key: 'academic',     icon: '📚', label: 'Academic Details',       desc: 'Subject marks, grades & semester GPA' },
  { key: 'arrears',      icon: '⚠️', label: 'Arrear Details',         desc: 'Arrear & RE-DO tracking' },
  { key: 'achievements', icon: '🏆', label: 'Achievements',           desc: 'Year-wise accomplishments' },
  { key: 'projects',     icon: '💼', label: 'Projects & Placements',  desc: 'Project, internship & placement info' },
];

export default function Profile({ reg }) {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getStudent(reg).then(r => setStudent(r.data)).catch(() => setStudent(null)).finally(() => setLoading(false));
  }, [reg]);

  if (loading) return <div className="loading">⏳ Loading profile…</div>;
  if (!student) return <div className="empty"><div className="empty-icon">❌</div><p>Student not found.</p></div>;

  const initials = student.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';
  const dob      = student.dob ? new Date(student.dob).toLocaleDateString('en-IN') : '—';
  const admitted = student.admitted_on ? new Date(student.admitted_on).toLocaleDateString('en-IN') : '—';

  return (
    <>
      {/* Banner */}
      <div className="student-banner">
        <div className="avatar">{initials}</div>
        <div className="banner-meta">
          <h1>{student.name}</h1>
          <p>{student.degree} · {student.department}</p>
          <div className="badge-row">
            <span className="badge badge-blue">Sem {student.current_semester}</span>
            <span className="badge badge-blue">Year {student.year_of_study}</span>
            <span className="badge badge-gray">{student.day_scholar_hosteller || '—'}</span>
            <span className={`badge ${student.status === 'Active' ? 'badge-green' : student.status === 'Passed Out' ? 'badge-gray' : 'badge-orange'}`}>
              {student.status}
            </span>
          </div>
        </div>
      </div>

      {/* Basic info card */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-head">👤 Basic Information</div>
        <div className="card-body">
          <div className="info-grid">
            {[
              ['Register No',  <span className="info-value mono">{student.register_no}</span>],
              ['Name',         student.name],
              ['Date of Birth',dob],
              ['Gender',       student.gender],
              ['Phone No',     student.phone_no || '—'],
              ['Email',        student.email    || '—'],
              ['Degree',       student.degree],
              ['Department',   student.department],
              ['Year of Study',student.year_of_study ? `Year ${student.year_of_study}` : '—'],
              ['Semester',     student.current_semester ? `Semester ${student.current_semester}` : '—'],
              ['Admitted On',  admitted],
              ['Status',       student.status],
            ].map(([label, val]) => (
              <div key={label} className="info-item">
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
            <span className="section-card-icon">{s.icon}</span>
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