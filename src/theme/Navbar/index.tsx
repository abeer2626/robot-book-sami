import React from 'react';
import Navbar from '@theme-original/Navbar';
import { useAuth } from '../../context/AuthContext';
import Link from '@docusaurus/Link';
import GlobalSearch from '../../components/search/GlobalSearch';

export default function NavbarWrapper(): JSX.Element {
  const { user, isAuthenticated, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  return (
    <Navbar
      extraItems={
        <>
          <GlobalSearch />
          {isAuthenticated ? (
            <div className="navbar__item navbar__dropdown">
              <button
                className="navbar__link"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.5rem',
                }}
              >
                <img
                  src={user?.avatar || '/img/default-avatar.png'}
                  alt={user?.name}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                  }}
                />
                <span>{user?.name}</span>
                <span style={{ fontSize: '0.8rem' }}>▼</span>
              </button>

              {isDropdownOpen && (
                <ul className="navbar__dropdown-menu">
                  <li>
                    <Link to="/dashboard" className="navbar__item">
                      📊 Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/profile" className="navbar__item">
                      👤 Profile
                    </Link>
                  </li>
                  <li>
                    <Link to="/settings" className="navbar__item">
                      ⚙️ Settings
                    </Link>
                  </li>
                  {user?.role === 'instructor' && (
                    <li>
                      <Link to="/instructor" className="navbar__item">
                        🎓 Instructor Portal
                      </Link>
                    </li>
                  )}
                  <li>
                    <hr className="navbar__divider" />
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="navbar__item"
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        background: 'none',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        cursor: 'pointer',
                      }}
                    >
                      🚪 Sign Out
                    </button>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <div className="navbar__item">
              <Link to="/login" className="button button--primary">
                Sign In
              </Link>
            </div>
          )}
        </>
      }
    />
  );
}