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

// ── SVG Icons ─────────────────────────────────────────────────
const Icon = ({ name }) => {
  const icons = {
    home: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
        <path d="M9 21V12h6v9"/>
      </svg>
    ),
    profile: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4"/>
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
      </svg>
    ),
    personal: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="3" width="16" height="18" rx="2"/>
        <path d="M8 7h8M8 11h8M8 15h5"/>
      </svg>
    ),
    parents: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="7" r="3"/>
        <circle cx="16" cy="8" r="2.5"/>
        <path d="M2 20c0-3.3 3.1-6 7-6s7 2.7 7 6"/>
        <path d="M18 14c2.2.5 4 2.2 4 4.5"/>
      </svg>
    ),
    academic: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3L2 8l10 5 10-5-10-5z"/>
        <path d="M2 8v6c0 2.5 4.5 5 10 5s10-2.5 10-5V8"/>
        <path d="M22 8v5"/>
      </svg>
    ),
    arrears: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    achievements: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="9" r="5"/>
        <path d="M7.21 14.77L5 21l7-3 7 3-2.21-6.23"/>
      </svg>
    ),
    projects: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/>
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
        <line x1="12" y1="12" x2="12" y2="16"/>
        <line x1="10" y1="14" x2="14" y2="14"/>
      </svg>
    ),
  };
  return icons[name] || null;
};

// ── Sidebar ───────────────────────────────────────────────────
const STUDENT_PAGES = [
  { key: 'profile',      label: 'Profile',               icon: 'profile'      },
  { key: 'personal',     label: 'Personal Details',      icon: 'personal'     },
  { key: 'parents',      label: 'Parent Details',        icon: 'parents'      },
  { key: 'academic',     label: 'Academic Details',      icon: 'academic'     },
  { key: 'arrears',      label: 'Arrear Details',        icon: 'arrears'      },
  { key: 'achievements', label: 'Achievements',          icon: 'achievements' },
  { key: 'projects',     label: 'Projects & Placements', icon: 'projects'     },
];

function Sidebar() {
  const { reg } = useParams();
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>Student Portal</h2>
        <span>Profile Management System</span>
      </div>
      <nav>
        <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          <span className="nav-icon"><Icon name="home" /></span>
          Home
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
                <span className="nav-icon"><Icon name={p.icon} /></span>
                {p.label}
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
          {reg && <span className="topbar-reg">Reg #{reg}</span>}
        </header>
        <main className="page-body">{children}</main>
      </div>
    </div>
  );
}

// ── Student page wrapper ──────────────────────────────────────
const PAGE_MAP = {
  profile:      Profile,
  personal:     Personal,
  parents:      Parents,
  academic:     Academic,
  arrears:      Arrears,
  achievements: Achievements,
  projects:     Projects,
};
const TITLES = {
  profile:      'Student Profile',
  personal:     'Personal Details',
  parents:      'Parent Details',
  academic:     'Academic Details',
  arrears:      'Arrear Details',
  achievements: 'Achievements',
  projects:     'Projects & Placements',
};

function StudentPage({ pageKey }) {
  const { reg } = useParams();
  const Page = PAGE_MAP[pageKey];
  return (
    <Layout title={TITLES[pageKey]}>
      <Page reg={reg} />
    </Layout>
  );
}

// Home has its own full-page layout — no sidebar, no topbar
function HomeLayout() {
  return <Home />;
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