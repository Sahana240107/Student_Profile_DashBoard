import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchStudents } from '../api';

const MARQUEE_ITEMS = [
  'Computer Science & Engineering',
  'Academic Records', 'GPA Tracking', 'Arrear Management',
  'Parent Details', 'Placement History', 'Internship Records',
  'Project Archives', 'Achievement Log', 'Hostel Allocation',
  'Blood Group Registry', 'Scholarship Details', 'Semester Marks',
];

const STATS = [
  { number: '2,400+', label: 'Students Enrolled' },
  { number: '8',      label: 'Semesters Tracked'  },
  { number: '100%',   label: 'Digital Records'    },
  { number: '4',      label: 'Years of Study'     },
];

const FEATURES = [
  { title: 'Academic Records',    desc: 'Semester-wise marks, grades, GPA and CGPA — all in one place. Track progress across every subject and every term.' },
  { title: 'Parent & Personal',   desc: 'Complete personal background, family contacts, hostel allocation, community details, and scholarship information.' },
  { title: 'Arrear Tracking',     desc: 'Monitor pending arrears, re-do subjects, and advisor assignments. Clear status at every stage of clearance.' },
  { title: 'Achievements',        desc: 'Year-wise accomplishments, co-curricular highlights, and extra-academic recognitions recorded and preserved.' },
  { title: 'Projects & Placements', desc: 'Final year projects, internship records, and placement packages — a complete career snapshot per student.' },
  { title: 'Instant Search',      desc: 'Find any student instantly by name or register number. No menus, no waiting — direct access to their full profile.' },
];

export default function Home() {
  const [query,   setQuery]   = useState('');
  const [results, setResults] = useState([]);
  const [open,    setOpen]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [time,    setTime]    = useState(new Date());
  const navigate = useNavigate();
  const wrapRef  = useRef();

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const fn = e => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  useEffect(() => {
    if (!query.trim()) { setResults([]); setOpen(false); return; }
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const { data } = await searchStudents(query.trim());
        setResults(data);
        setOpen(true);
      } catch { setResults([]); }
      finally { setLoading(false); }
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const pick = reg => { setOpen(false); setQuery(''); navigate(`/student/${reg}/profile`); };

  const fmtTime = d => d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const fmtDate = d => d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="home-page">

      {/* ── Header ── */}
      <header className="home-header">
        <div className="home-logo">
          <span className="home-logo-mark">SP</span>
          <div>
            <div className="home-logo-name">Student Portal</div>
            <div className="home-logo-sub">Dept. of Computer Science &amp; Engineering</div>
          </div>
        </div>
        <div className="home-clock">
          <div className="home-clock-time">{fmtTime(time)}</div>
          <div className="home-clock-date">{fmtDate(time)}</div>
        </div>
      </header>

      {/* ── Ticker ── */}
      <div className="home-ticker">
        <div className="ticker-label">CSE</div>
        <div className="ticker-track">
          <div className="ticker-inner">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span key={i} className="ticker-item">
                {item}<span className="ticker-dot"> ·</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Hero — centred layout ── */}
      <section className="home-hero-new home-hero-centered">
        <div className="hero-bg-circle c1" />
        <div className="hero-bg-circle c2" />
        <div className="hero-bg-circle c3" />
        <div className="hero-grid-pattern" />

        <div className="hero-content">
          <div className="hero-eyebrow">Academic Information System</div>
          <h1 className="hero-title">
            Every student's story,<br />
            <span className="hero-title-accent">one profile away.</span>
          </h1>
          <p className="hero-subtitle">
            Search by name or register number to instantly access a student's complete academic profile —
            marks, grades, achievements, placements and more.
          </p>

          <div className="home-search-wrap" ref={wrapRef}>
            <div className="home-search-inner">
              <svg className="home-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                className="home-search-input"
                placeholder="Search by name or register number…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onFocus={() => results.length && setOpen(true)}
                autoComplete="off"
              />
              {loading && <span className="home-search-spinner" />}
            </div>
            {open && (
              <div className="home-search-drop">
                {results.length === 0 && !loading && (
                  <div className="home-search-row empty-row">No students found</div>
                )}
                {results.map(s => (
                  <div key={s.register_no} className="home-search-row" onClick={() => pick(s.register_no)}>
                    <div className="search-result-avatar">
                      {s.name?.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()}
                    </div>
                    <div className="search-result-info">
                      <div className="search-result-name">{s.name}</div>
                      <div className="search-result-meta">{s.degree} &middot; {s.department}</div>
                    </div>
                    <span className="search-result-reg">#{s.register_no}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="hero-search-note">
            <span className="hero-key">↵</span> to open &nbsp;·&nbsp; <span className="hero-key">Esc</span> to close
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="home-stats">
        {STATS.map(s => (
          <div key={s.label} className="home-stat">
            <div className="home-stat-num">{s.number}</div>
            <div className="home-stat-lbl">{s.label}</div>
          </div>
        ))}
      </section>

      {/* ── Features ── */}
      <section className="home-features">
        <div className="home-features-header">
          <h2 className="home-features-title">Everything in one place</h2>
          <p className="home-features-sub">
            A single portal covering the full arc of a student's academic journey.
          </p>
        </div>
        <div className="home-features-grid">
          {FEATURES.map((f, i) => (
            <div key={f.title} className="home-feature-card">
              <div className="home-feature-num">0{i + 1}</div>
              <h3 className="home-feature-title">{f.title}</h3>
              <p className="home-feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="home-footer">
        Dept. of Computer Science &amp; Engineering &mdash; Student Profile Portal &mdash; Academic Year 2024–25
      </footer>

    </div>
  );
}