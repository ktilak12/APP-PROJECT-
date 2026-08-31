import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Compass, 
  PlusCircle, 
  Users, 
  Trophy, 
  Kanban, 
  BarChart3, 
  Sun, 
  Moon, 
  Search, 
  Sparkles,
  Menu,
  X,
  Award,
  LogOut,
  UserCheck,
  UserPlus,
  Home,
  Check,
  ChevronDown,
  Bell,
  CheckCheck
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    searchQuery, 
    setSearchQuery, 
    theme, 
    toggleTheme, 
    currentUser,
    accounts,
    switchAccount,
    logout,
    notifications,
    markNotificationsRead,
    setAuthModalOpen,
    setAuthModalMode
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'matchmaker', label: 'AI Matchmaker', icon: Users },
    { id: 'challenges', label: 'Challenges', icon: Trophy },
    { id: 'workspace', label: 'Workspace', icon: Kanban },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  const handleNavClick = (viewId: any) => {
    setActiveView(viewId);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
    setNotifDropdownOpen(false);
  };

  const GoogleLogoSvg = () => (
    <svg width="18" height="18" viewBox="0 0 48 48" style={{ minWidth: '18px' }}>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );

  return (
    <header className="navbar-header">
      <div className="app-container navbar-inner">
        {/* Left: Brand Logo */}
        <div 
          onClick={() => handleNavClick(currentUser ? 'explore' : 'entry')}
          className="brand-container"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div className="brand-logo-box">
            <Sparkles size={20} />
          </div>
          <div>
            <div style={{
              fontSize: '1.2rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem',
              lineHeight: 1.1
            }}>
              <span>Idea</span>
              <span className="gradient-text">Pitch</span>
            </div>
            <div style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              color: 'var(--primary)',
              letterSpacing: '0.05em'
            }}>
              SPARK INNOVATION
            </div>
          </div>
        </div>

        {/* Center: Desktop Navigation Bar (Segmented Group) */}
        <nav className="desktop-nav-group">
          <button
            onClick={() => handleNavClick('entry')}
            className={`nav-pill-btn ${activeView === 'entry' ? 'active' : ''}`}
            title="Landing & Entry Page"
          >
            <Home size={15} />
            <span>Home</span>
          </button>

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`nav-pill-btn ${isActive ? 'active' : ''}`}
              >
                <Icon size={15} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Search, CTA, Notifications, Theme & Profile Dropdown */}
        <div className="navbar-actions-group">
          {/* Responsive Search Box */}
          <div className="navbar-search-wrapper">
            <Search 
              size={15} 
              style={{
                position: 'absolute',
                left: '12px',
                color: 'var(--text-muted)',
                pointerEvents: 'none'
              }} 
            />
            <input 
              type="text"
              className="input-field nav-search-input"
              placeholder="Search pitches, skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '8px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)'
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Pitch Action Button */}
          <button 
            className="btn btn-primary nav-pitch-btn"
            onClick={() => {
              if (!currentUser) {
                setAuthModalMode('choose');
                setAuthModalOpen(true);
              } else {
                handleNavClick('pitch');
              }
            }}
          >
            <PlusCircle size={16} />
            <span className="pitch-btn-text">Pitch Idea</span>
          </button>

          {/* Notification Bell Dropdown */}
          <div style={{ position: 'relative' }} ref={notifRef}>
            <button 
              className="btn btn-secondary btn-icon"
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              title="Notifications & Activity Alerts"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-full)',
                position: 'relative'
              }}
            >
              <Bell size={17} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: 'var(--rose)',
                  color: '#FFFFFF',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 5px rgba(239, 68, 68, 0.4)'
                }}>
                  {unreadCount}
                </span>
              )}
            </button>

            {notifDropdownOpen && (
              <div 
                className="glass-card"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: '320px',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 110,
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  animation: 'slideUp 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Notifications</div>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markNotificationsRead}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--primary)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      <CheckCheck size={14} />
                      <span>Mark all read</span>
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {notifications.map(n => (
                    <div 
                      key={n.id}
                      style={{
                        padding: '0.65rem',
                        borderRadius: 'var(--radius-md)',
                        background: n.read ? 'var(--bg-surface-elevated)' : 'rgba(37, 99, 235, 0.08)',
                        border: n.read ? '1px solid var(--border-color)' : '1px solid var(--primary)',
                        fontSize: '0.8rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                        <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{n.title}</span>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-subtle)' }}>{n.time}</span>
                      </div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.76rem', lineHeight: 1.3 }}>{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button 
            className="btn btn-secondary btn-icon nav-theme-btn"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-full)'
            }}
          >
            {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
          </button>

          {/* User Profile Pill or Sign-in Button */}
          {currentUser ? (
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <div 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className={`nav-profile-pill ${profileDropdownOpen || activeView === 'profile' ? 'active' : ''}`}
                title="Google Account & Profile"
              >
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
                <div className="profile-info-compact">
                  <span className="profile-name-text">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <span className="profile-rep-badge">
                    <Award size={11} color="var(--amber)" />
                    {currentUser.reputation}
                  </span>
                </div>
                <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
              </div>

              {/* Multi-Account Google Profile Dropdown */}
              {profileDropdownOpen && (
                <div 
                  className="glass-card"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '300px',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.25rem',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 110,
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    animation: 'slideUp 0.15s ease'
                  }}
                >
                  {/* Current Active Account Header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    paddingBottom: '1rem',
                    borderBottom: '1px solid var(--border-color)'
                  }}>
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser.name} 
                      style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} 
                    />
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {currentUser.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {currentUser.email}
                      </div>
                      <div style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        color: 'var(--primary)',
                        marginTop: '2px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.2rem'
                      }}>
                        <UserCheck size={12} />
                        <span>{currentUser.role}</span>
                      </div>
                    </div>
                  </div>

                  {/* Switch to Other Google Accounts */}
                  <div style={{ margin: '0.85rem 0' }}>
                    <div style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: 'var(--text-subtle)',
                      letterSpacing: '0.04em',
                      marginBottom: '0.5rem'
                    }}>
                      GOOGLE ACCOUNTS ON THIS DEVICE
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxHeight: '160px', overflowY: 'auto' }}>
                      {accounts.map(acc => {
                        const isCurrent = acc.id === currentUser.id;
                        return (
                          <div
                            key={acc.id}
                            onClick={() => {
                              switchAccount(acc.id);
                              setProfileDropdownOpen(false);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '0.45rem 0.65rem',
                              borderRadius: 'var(--radius-md)',
                              background: isCurrent ? 'rgba(37, 99, 235, 0.08)' : 'var(--bg-surface-elevated)',
                              border: isCurrent ? '1px solid var(--primary)' : '1px solid transparent',
                              cursor: 'pointer',
                              fontSize: '0.8rem'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                              <img 
                                src={acc.avatar} 
                                alt={acc.name} 
                                style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} 
                              />
                              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                <div style={{ fontWeight: 600 }}>{acc.name}</div>
                                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{acc.email}</div>
                              </div>
                            </div>

                            {isCurrent && <Check size={14} color="var(--primary)" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dropdown Action Links */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                    <button
                      onClick={() => {
                        setAuthModalMode('add_google');
                        setAuthModalOpen(true);
                        setProfileDropdownOpen(false);
                      }}
                      className="dropdown-menu-item"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 0.65rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--primary)',
                        fontWeight: 600,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <UserPlus size={15} />
                      <span>Add another Google account</span>
                    </button>

                    <button
                      onClick={() => handleNavClick('profile')}
                      className="dropdown-menu-item"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 0.65rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-main)',
                        fontWeight: 600,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <Award size={15} />
                      <span>View Developer Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                      }}
                      className="dropdown-menu-item"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 0.65rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--rose)',
                        fontWeight: 600,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <LogOut size={15} />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                setAuthModalMode('choose');
                setAuthModalOpen(true);
              }}
              className="btn btn-secondary btn-sm"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                borderRadius: 'var(--radius-full)',
                padding: '0.45rem 0.95rem'
              }}
            >
              <GoogleLogoSvg />
              <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>Sign In</span>
            </button>
          )}

          {/* Mobile Hamburger Menu Toggle */}
          <button
            className="btn btn-secondary btn-icon mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={15} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
              <input 
                type="text"
                className="input-field"
                placeholder="Search ideas, skills, AI tech..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '34px', width: '100%', borderRadius: 'var(--radius-md)' }}
              />
            </div>
          </div>

          <div className="mobile-nav-links">
            <button
              onClick={() => handleNavClick('entry')}
              className={`mobile-nav-btn ${activeView === 'entry' ? 'active' : ''}`}
            >
              <Home size={18} />
              <span>Home & Entry</span>
            </button>

            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`mobile-nav-btn ${isActive ? 'active' : ''}`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {currentUser ? (
              <button
                onClick={() => handleNavClick('profile')}
                className={`mobile-nav-btn ${activeView === 'profile' ? 'active' : ''}`}
              >
                <Award size={18} />
                <span>Profile ({currentUser.name})</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setAuthModalMode('choose');
                  setAuthModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
              >
                <GoogleLogoSvg />
                <span>Sign in with Google</span>
              </button>
            )}

            <button
              onClick={() => {
                if (!currentUser) {
                  setAuthModalMode('choose');
                  setAuthModalOpen(true);
                } else {
                  handleNavClick('pitch');
                }
              }}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
            >
              <PlusCircle size={18} />
              <span>Pitch New Idea</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
