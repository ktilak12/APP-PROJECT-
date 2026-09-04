import React, { useState, useRef } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Plus, 
  ShieldCheck, 
  Check, 
  Sparkles, 
  ArrowLeft, 
  Trash2, 
  Fingerprint,
  Globe,
  Camera,
  Upload
} from 'lucide-react';
import { compressImageFile } from '../utils/imageUtils';

const GoogleLogoSvg = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" style={{ minWidth: '20px' }}>
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

export const GoogleAuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setAuthModalOpen, 
    accounts, 
    currentUser, 
    loginWithGoogleCredential,
    loginWithGoogle, 
    switchAccount, 
    removeAccount,
    authModalMode, 
    setAuthModalMode
  } = useApp();

  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newAvatar, setNewAvatar] = useState('');
  const [newRole, setNewRole] = useState('Full Stack Developer');
  const [newCollege, setNewCollege] = useState('');
  const [newSkills, setNewSkills] = useState('React, Python, AI/ML');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isAuthModalOpen) return null;

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, 400, 0.85);
      setNewAvatar(compressed);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error uploading image';
      alert(`Could not process photo: ${msg}`);
    } finally {
      e.target.value = '';
    }
  };

  const handleAddNewGoogleAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;

    loginWithGoogle({
      email: newEmail.trim(),
      name: newName.trim() || newEmail.split('@')[0],
      avatar: newAvatar || undefined,
      role: newRole,
      college: newCollege.trim(),
      skills: newSkills.split(',').map(s => s.trim()).filter(Boolean)
    });

    setNewEmail('');
    setNewName('');
    setNewAvatar('');
    setNewCollege('');
  };

  return (
    <div className="modal-overlay" onClick={() => setAuthModalOpen(false)}>
      <div 
        className="modal-content" 
        onClick={e => e.stopPropagation()} 
        style={{
          maxWidth: '490px',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-color)',
          background: 'var(--bg-surface)'
        }}
      >
        {/* Google Header */}
        <div style={{
          padding: '1.5rem 1.75rem 1.25rem 1.75rem',
          borderBottom: '1px solid var(--border-color)',
          background: 'var(--bg-surface-elevated)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
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
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, lineHeight: 1.2 }}>
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

        <div style={{ padding: '1.5rem 1.75rem', maxHeight: '75vh', overflowY: 'auto' }}>
          {authModalMode === 'choose' && (
            <div>
              {/* Official Google Login Button Component */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.5rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-color)',
                marginBottom: '1.5rem'
              }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Fingerprint size={17} color="var(--primary)" />
                  <span>Google Single Sign-On</span>
                </div>
                
                <div style={{ minHeight: '44px', display: 'flex', justifyContent: 'center' }}>
                  <GoogleLogin
                    onSuccess={(credentialResponse) => {
                      if (credentialResponse.credential) {
                        loginWithGoogleCredential(credentialResponse.credential);
                      }
                    }}
                    onError={() => {
                      console.log('Google Sign-In prompt initialized.');
                    }}
                    useOneTap
                    shape="pill"
                    theme="outline"
                    text="signin_with"
                    size="large"
                  />
                </div>
                
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.65rem', textAlign: 'center' }}>
                  Sign in with your personal or workspace Google Account
                </div>
              </div>

              {/* Registered Accounts Section */}
              {accounts.length > 0 ? (
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-subtle)', letterSpacing: '0.04em' }}>
                      REGISTERED GOOGLE ACCOUNTS ({accounts.length})
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 600 }}>
                      Isolated ID per account
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
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
                            background: isCurrent ? 'rgba(37, 99, 235, 0.08)' : 'var(--bg-surface)',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
                            <img 
                              src={acc.avatar} 
                              alt={acc.name} 
                              style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                            />
                            <div style={{ overflow: 'hidden' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{acc.name}</span>
                                {isCurrent && (
                                  <span style={{
                                    fontSize: '0.62rem',
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
                              <div style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)' }}>
                                ID: {acc.googleId.slice(0, 16)}...
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
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
                </div>
              ) : (
                <div style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px dashed var(--border-color)',
                  textAlign: 'center',
                  marginBottom: '1.25rem'
                }}>
                  <Globe size={24} style={{ color: 'var(--text-subtle)', marginInline: 'auto', marginBottom: '0.4rem' }} />
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    No Google accounts connected yet
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Click above to authenticate with your Google account.
                  </div>
                </div>
              )}

              {/* Add Custom Google Account Button */}
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
                <span>Add custom Google identity</span>
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
          )}

          {authModalMode === 'add_google' && (
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

              {/* Profile Photo Selector from Local Storage */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.75rem 0.9rem',
                background: 'var(--bg-surface-elevated)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <img 
                    src={newAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} 
                    alt="Preview" 
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid var(--primary)',
                      display: 'block'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      position: 'absolute',
                      bottom: '-2px',
                      right: '-2px',
                      background: 'var(--primary)',
                      color: '#FFFFFF',
                      border: '2px solid var(--bg-surface)',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    title="Upload profile photo from local storage"
                  >
                    <Camera size={11} />
                  </button>
                </div>
                <div style={{ flex: 1, minWidth: '160px' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.15rem' }}>
                    Profile Picture
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    {newAvatar ? 'Local image selected' : 'Upload photo from local storage'}
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.72rem', padding: '0.2rem 0.55rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      <Upload size={11} />
                      <span>{newAvatar ? 'Change Photo' : 'Upload Photo'}</span>
                    </button>
                    {newAvatar && (
                      <button
                        type="button"
                        onClick={() => setNewAvatar('')}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.72rem', padding: '0.2rem 0.55rem', color: 'var(--text-muted)' }}
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleAvatarUpload}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>
                  Google Email Address *
                </label>
                <input 
                  type="email"
                  className="input-field"
                  placeholder="e.g. yourname@gmail.com"
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
                  className="input-field font-mono"
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
                <span>Authorize with Google ID</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
