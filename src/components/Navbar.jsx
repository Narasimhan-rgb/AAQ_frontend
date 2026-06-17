import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/datasets",  label: "Datasets"  },
  { to: "/benchmarks",label: "Benchmarks"},
  { to: "/reports",   label: "Reports"   },
  { to: "/system",    label: "System"    },
];

function Navbar() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const displayEmail = user?.email || '';
  const initials = displayEmail
    ? displayEmail.slice(0, 2).toUpperCase()
    : '??';

  return (
    <header className="navbar">
      {/* Brand */}
      <div className="navbar-brand">
        <div className="navbar-logo">⚛</div>
        <div>
          <h1>AAQ Algorithm</h1>
          <p>Adaptive Amplitude QuickSort</p>
        </div>
      </div>

      {/* Nav links */}
      <nav>
        {NAV_LINKS.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User area */}
      <div className="navbar-user">
        <div className="user-badge" title={displayEmail}>
          <div className="user-avatar">{initials}</div>
          {displayEmail && (
            <span className="user-email">{displayEmail}</span>
          )}
        </div>

        <button className="navbar-logout" onClick={handleLogout}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;