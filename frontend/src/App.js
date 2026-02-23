import React from 'react';
import { BrowserRouter, Routes, Route, NavLink, useParams } from 'react-router-dom';
import Home         from './pages/Home';
import Profile      from './pages/Profile';
import Personal     from './pages/Personal';
import Parents      from './pages/Parents';
import Academic     from './pages/Academic';
import Arrears      from './pages/Arrears';
import Achievements from './pages/Achievements';
import Projects     from './pages/Projects';

// ── Sidebar ───────────────────────────────────────────────────
const STUDENT_PAGES = [
  { key: 'profile',      label: 'Profile',              icon: '👤' },
  { key: 'personal',     label: 'Personal Details',     icon: '📋' },
  { key: 'parents',      label: 'Parent Details',        icon: '👨‍👩‍👦' },
  { key: 'academic',     label: 'Academic Details',     icon: '📚' },
  { key: 'arrears',      label: 'Arrear Details',       icon: '⚠️' },
  { key: 'achievements', label: 'Achievements',         icon: '🏆' },
  { key: 'projects',     label: 'Projects & Placements',icon: '💼' },
];

function Sidebar() {
  const { reg } = useParams();
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>🎓 Student Portal</h2>
        <span>Profile Management System</span>
      </div>
      <nav>
        <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          <span className="ni">🏠</span> Home
        </NavLink>

        {reg && (
          <>
            <div className="sidebar-section-label">Student #{reg}</div>
            {STUDENT_PAGES.map(p => (
              <NavLink
                key={p.key}
                to={`/student/${reg}/${p.key}`}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                <span className="ni">{p.icon}</span> {p.label}
              </NavLink>
            ))}
          </>
        )}
      </nav>
    </aside>
  );
}

// ── Layout wrapper ────────────────────────────────────────────
function Layout({ title, children }) {
  const { reg } = useParams();
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-area">
        <header className="topbar">
          <span className="topbar-title">{title}</span>
          {reg && <span className="topbar-reg">Reg # {reg}</span>}
        </header>
        <main className="page-body">{children}</main>
      </div>
    </div>
  );
}

// ── Student page wrapper ──────────────────────────────────────
const PAGE_MAP = { profile: Profile, personal: Personal, parents: Parents, academic: Academic, arrears: Arrears, achievements: Achievements, projects: Projects };
const TITLES   = { profile: 'Student Profile', personal: 'Personal Details', parents: 'Parent Details', academic: 'Academic Details', arrears: 'Arrear Details', achievements: 'Achievements', projects: 'Projects & Placements' };

function StudentPage({ pageKey }) {
  const { reg } = useParams();
  const Page = PAGE_MAP[pageKey];
  return (
    <Layout title={TITLES[pageKey]}>
      <Page reg={reg} />
    </Layout>
  );
}

function HomeLayout() {
  return (
    <Layout title="Student Profile System">
      <Home />
    </Layout>
  );
}

// ── App ───────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeLayout />} />
        {Object.keys(PAGE_MAP).map(key => (
          <Route key={key} path={`/student/:reg/${key}`} element={<StudentPage pageKey={key} />} />
        ))}
      </Routes>
    </BrowserRouter>
  );
}