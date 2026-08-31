import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Plus, ShieldCheck, Check, Sparkles, ArrowLeft, Trash2 } from 'lucide-react';

export const GoogleAuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setAuthModalOpen, 
    accounts, 
    currentUser, 
    loginWithGoogle, 
    switchAccount, 
    removeAccount,
    authModalMode, 
    setAuthModalMode 
  } = useApp();

  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('Full Stack Developer');
  const [newCollege, setNewCollege] = useState('');
  const [newSkills, setNewSkills] = useState('React, Python, AI/ML');

  if (!isAuthModalOpen) return null;

  const handleAddNewGoogleAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;

    loginWithGoogle({
      email: newEmail.trim(),
      name: newName.trim() || newEmail.split('@')[0],
      role: newRole,
      college: newCollege.trim(),
      skills: newSkills.split(',').map(s => s.trim()).filter(Boolean)
    });

    setNewEmail('');
    setNewName('');
    setNewCollege('');
  };

  const GoogleLogoSvg = () => (
    <svg width="20" height="20" viewBox="0 0 48 48" style={{ minWidth: '20px' }}>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );

  return (
    <div className="modal-overlay" onClick={() => setAuthModalOpen(false)}>
      <div 
        className="modal-content" 
        onClick={e => e.stopPropagation()} 
        style={{
          maxWidth: '460px',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-color)',
          background: 'var(--bg-surface)'
        }}
      >
        {/* Google Header */}
        <div style={{
          padding: '1.75rem 1.75rem 1.25rem 1.75rem',
          borderBottom: '1px solid var(--border-color)',
          background: 'var(--bg-surface-elevated)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--border-color)'
            }}>
              <GoogleLogoSvg />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, lineHeight: 1.2 }}>
                {authModalMode === 'choose' ? 'Sign in with Google' : 'Add Google Account'}
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                to continue to <strong style={{ color: 'var(--primary)' }}>IdeaPitch Platform</strong>
              </p>
            </div>
          </div>

          <button 
            className="btn btn-secondary btn-icon"
            onClick={() => setAuthModalOpen(false)}
            style={{ width: '32px', height: '32px', borderRadius: '50%' }}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '1.5rem 1.75rem' }}>
          {authModalMode === 'choose' ? (
            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Select an account on this device or add a new Google profile:
              </p>

              {/* Account List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem' }}>
                {accounts.map(acc => {
                  const isCurrent = currentUser?.id === acc.id;
                  return (
                    <div
                      key={acc.id}
                      onClick={() => switchAccount(acc.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: isCurrent ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                        background: isCurrent ? 'rgba(37, 99, 235, 0.06)' : 'var(--bg-surface)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img 
                          src={acc.avatar} 
                          alt={acc.name} 
                          style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{acc.name}</span>
                            {isCurrent && (
                              <span style={{
                                fontSize: '0.65rem',
                                fontWeight: 800,
                                padding: '0.15rem 0.45rem',
                                borderRadius: 'var(--radius-full)',
                                background: 'var(--primary)',
                                color: '#FFFFFF'
                              }}>
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{acc.email}</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {isCurrent ? (
                          <div style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: 'var(--primary)',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <Check size={14} />
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeAccount(acc.id);
                            }}
                            title="Remove account from device"
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--text-subtle)',
                              cursor: 'pointer',
                              padding: '4px'
                            }}
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Another Account Button */}
              <button
                onClick={() => setAuthModalMode('add_google')}
                className="btn btn-secondary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '0.75rem',
                  fontSize: '0.88rem',
                  marginBottom: '1rem'
                }}
              >
                <Plus size={16} />
                <span>Use another Google account</span>
              </button>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                fontSize: '0.75rem',
                color: 'var(--text-subtle)'
              }}>
                <ShieldCheck size={14} color="#10B981" />
                <span>Protected by Google Single Sign-On & OAuth 2.0</span>
              </div>
            </div>
          ) : (
            /* Add Google Account Form */
            <form onSubmit={handleAddNewGoogleAccount} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button
                type="button"
                onClick={() => setAuthModalMode('choose')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0,
                  alignSelf: 'flex-start'
                }}
              >
                <ArrowLeft size={15} />
                <span>Back to account selection</span>
              </button>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>
                  Google Email Address *
                </label>
                <input 
                  type="email"
                  className="input-field"
                  placeholder="e.g. dev.innovator@gmail.com"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>
                  Full Name / Display Name
                </label>
                <input 
                  type="text"
                  className="input-field"
                  placeholder="e.g. Maya Sunder"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>
                    Primary Role
                  </label>
                  <select 
                    className="input-field"
                    value={newRole}
                    onChange={e => setNewRole(e.target.value)}
                  >
                    <option value="Founder / Entrepreneur">Founder / Entrepreneur</option>
                    <option value="Full Stack Developer">Full Stack Developer</option>
                    <option value="AI / ML Engineer">AI / ML Engineer</option>
                    <option value="UI/UX Product Designer">UI/UX Product Designer</option>
                    <option value="Hardware / IoT Lead">Hardware / IoT Lead</option>
                    <option value="Student Innovator">Student Innovator</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>
                    College / Organization
                  </label>
                  <input 
                    type="text"
                    className="input-field"
                    placeholder="e.g. IIT Bombay, Stanford"
                    value={newCollege}
                    onChange={e => setNewCollege(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>
                  Skills (comma separated)
                </label>
                <input 
                  type="text"
                  className="input-field"
                  placeholder="e.g. PyTorch, React, Cloud, Blockchain"
                  value={newSkills}
                  onChange={e => setNewSkills(e.target.value)}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '0.75rem',
                  fontSize: '0.95rem',
                  marginTop: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Sparkles size={16} />
                <span>Authorize with Google</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
