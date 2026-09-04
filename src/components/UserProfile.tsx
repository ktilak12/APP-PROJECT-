import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Award, MapPin, GraduationCap, Code2, Globe, Sparkles, UserPlus, Edit3, X, Save, Camera, Upload, CheckCircle2 } from 'lucide-react';
import { IdeaCard } from './IdeaCard';
import { compressImageFile } from '../utils/imageUtils';

const GoogleLogoSvg = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" style={{ minWidth: '18px' }}>
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

export const UserProfile: React.FC = () => {
  const { currentUser, ideas, setAuthModalOpen, setAuthModalMode, updateUserProfile, setActiveView } = useApp();
  const [showEditModal, setShowEditModal] = useState(false);
  const [uploadSuccessToast, setUploadSuccessToast] = useState(false);

  // Edit form states
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editAvatar, setEditAvatar] = useState(currentUser?.avatar || '');
  const [editRole, setEditRole] = useState(currentUser?.role || '');
  const [editBio, setEditBio] = useState(currentUser?.bio || '');
  const [editLocation, setEditLocation] = useState(currentUser?.location || '');
  const [editCollege, setEditCollege] = useState(currentUser?.college || '');
  const [editSkills, setEditSkills] = useState(currentUser?.skills.join(', ') || '');
  const [editGithub, setEditGithub] = useState(currentUser?.github || '');
  const [editLinkedin, setEditLinkedin] = useState(currentUser?.linkedin || '');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalFileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, updateImmediately: boolean = true) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressedBase64 = await compressImageFile(file, 480, 0.88);
      setEditAvatar(compressedBase64);

      if (updateImmediately) {
        updateUserProfile({ avatar: compressedBase64 });
        setUploadSuccessToast(true);
        setTimeout(() => setUploadSuccessToast(false), 3000);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error processing image';
      alert(`Could not upload photo: ${msg}`);
    } finally {
      // Clear input so selecting the same file again triggers change
      e.target.value = '';
    }
  };

  if (!currentUser) {
    return (
      <div className="app-container" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
        <div className="glass-card" style={{ maxWidth: '600px', marginInline: 'auto', padding: '3rem 2rem', borderRadius: 'var(--radius-lg)' }}>
          <Sparkles size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            Sign In to Access Your Developer Profile
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem', lineHeight: 1.5 }}>
            Each account is securely tied to your Google ID. Sign in or add multiple Google accounts to pitch ideas, track sprint tasks, and manage collaborator invites.
          </p>
          <button
            onClick={() => {
              setAuthModalMode('choose');
              setAuthModalOpen(true);
            }}
            className="btn btn-primary"
            style={{ padding: '0.85rem 1.75rem', fontSize: '1rem', borderRadius: 'var(--radius-full)' }}
          >
            <GoogleLogoSvg />
            <span>Sign in with Google</span>
          </button>
        </div>
      </div>
    );
  }

  const userIdeas = ideas.filter(i => i.author.id === currentUser.id);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: editName.trim() || currentUser.name,
      avatar: editAvatar || currentUser.avatar,
      role: editRole.trim() || currentUser.role,
      bio: editBio.trim() || currentUser.bio,
      location: editLocation.trim() || currentUser.location,
      college: editCollege.trim(),
      skills: editSkills.split(',').map(s => s.trim()).filter(Boolean),
      github: editGithub.trim(),
      linkedin: editLinkedin.trim()
    });
    setShowEditModal(false);
  };

  const openEditModal = () => {
    setEditName(currentUser.name);
    setEditAvatar(currentUser.avatar);
    setEditRole(currentUser.role);
    setEditBio(currentUser.bio);
    setEditLocation(currentUser.location);
    setEditCollege(currentUser.college || '');
    setEditSkills(currentUser.skills.join(', '));
    setEditGithub(currentUser.github || '');
    setEditLinkedin(currentUser.linkedin || '');
    setShowEditModal(true);
  };

  return (
    <div className="app-container" style={{ padding: '2rem 1.5rem' }}>
      {/* Profile Header Card */}
      <div 
        className="glass-card" 
        style={{
          padding: '2.5rem 2rem',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '2rem',
          background: 'var(--grad-hero)',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', gap: '1.75rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Avatar with Camera Upload Trigger */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                style={{
                  width: '105px',
                  height: '105px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid var(--primary)',
                  boxShadow: 'var(--shadow-glow)',
                  display: 'block'
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="hover-lift"
                title="Upload profile picture from local computer/storage"
                style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  background: 'var(--primary)',
                  color: '#FFFFFF',
                  border: '2px solid var(--bg-surface)',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <Camera size={16} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => handleImageUpload(e, true)}
              />
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Upload size={12} />
              <span>Change Photo</span>
            </button>
            {uploadSuccessToast && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#10B981',
                animation: 'fadeIn 0.2s ease',
                textAlign: 'center'
              }}>
                <CheckCircle2 size={13} />
                <span>Saved to storage!</span>
              </div>
            )}
          </div>

          <div style={{ flex: 1, minWidth: '280px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <h1 style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1.2 }}>{currentUser.name}</h1>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    padding: '0.2rem 0.6rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: 'var(--text-muted)'
                  }}>
                    <GoogleLogoSvg />
                    <span>{currentUser.email}</span>
                  </span>
                </div>

                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--primary)', margin: '0.3rem 0' }}>
                  {currentUser.role}
                </div>

                <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-subtle)', fontSize: '0.85rem', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <MapPin size={14} />
                    {currentUser.location}
                  </span>
                  {currentUser.college && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <GraduationCap size={14} />
                      {currentUser.college}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                <div style={{
                  padding: '0.45rem 0.9rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(245, 158, 11, 0.12)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  color: '#D97706',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontFamily: 'var(--font-mono)'
                }}>
                  <Award size={16} />
                  <span>{currentUser.reputation} Reputation</span>
                </div>

                <button
                  onClick={openEditModal}
                  className="btn btn-secondary btn-sm"
                  style={{ borderRadius: 'var(--radius-full)' }}
                >
                  <Edit3 size={14} />
                  <span>Edit Profile</span>
                </button>

                <button
                  onClick={() => {
                    setAuthModalMode('add_google');
                    setAuthModalOpen(true);
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ borderRadius: 'var(--radius-full)' }}
                >
                  <UserPlus size={14} />
                  <span>Add Google ID</span>
                </button>
              </div>
            </div>

            <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', marginTop: '0.85rem', lineHeight: 1.5 }}>
              {currentUser.bio}
            </p>

            {/* Skills & Domain Interests */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginTop: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  SKILLS & EXPERTISE
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {currentUser.skills.map((sk, i) => (
                    <span key={i} className="tag-badge font-mono" style={{ background: 'var(--bg-surface)' }}>{sk}</span>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  DOMAIN INTERESTS
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {currentUser.interests.map((int, i) => (
                    <span key={i} className="tag-badge" style={{ background: 'var(--primary-glow)', color: 'var(--primary)' }}>{int}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
              {currentUser.github && (
                <a href={currentUser.github.startsWith('http') ? currentUser.github : `https://${currentUser.github}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                  <Code2 size={15} />
                  <span>{currentUser.github}</span>
                </a>
              )}
              {currentUser.linkedin && (
                <a href={currentUser.linkedin.startsWith('http') ? currentUser.linkedin : `https://${currentUser.linkedin}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                  <Globe size={15} />
                  <span>{currentUser.linkedin}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* User Published Pitches Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
            Published Pitches ({userIdeas.length})
          </h2>
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => setActiveView('pitch')}
          >
            <span>+ Pitch New Idea</span>
          </button>
        </div>

        {userIdeas.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
            {userIdeas.map(idea => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        ) : (
          <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
              You have not published any pitches under this Google account ({currentUser.email}) yet.
            </p>
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => setActiveView('pitch')}
            >
              Pitch an Idea Now
            </button>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="modal-overlay" style={{ zIndex: 120 }}>
          <div className="modal-content" style={{ maxWidth: '520px', padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Edit Google Profile</h3>
              <button className="btn btn-secondary btn-icon" onClick={() => setShowEditModal(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Profile Photo Picker from Local Storage */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                padding: '0.9rem 1rem',
                background: 'var(--bg-surface-elevated)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <img 
                    src={editAvatar || currentUser.avatar} 
                    alt="Preview" 
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid var(--primary)',
                      display: 'block'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => modalFileInputRef.current?.click()}
                    style={{
                      position: 'absolute',
                      bottom: '-2px',
                      right: '-2px',
                      background: 'var(--primary)',
                      color: '#FFFFFF',
                      border: '2px solid var(--bg-surface)',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    title="Choose from local storage"
                  >
                    <Camera size={13} />
                  </button>
                </div>

                <div style={{ flex: 1, minWidth: '180px' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                    Profile Picture
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    Choose an image from your local device/storage
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => modalFileInputRef.current?.click()}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <Upload size={12} />
                      <span>Upload from Device</span>
                    </button>
                    {editAvatar && editAvatar !== currentUser.avatar && (
                      <button
                        type="button"
                        onClick={() => setEditAvatar(currentUser.avatar)}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem', color: 'var(--text-muted)' }}
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={modalFileInputRef}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleImageUpload(e, false)}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Display Name</label>
                <input type="text" className="input-field" value={editName} onChange={e => setEditName(e.target.value)} required />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Role / Professional Title</label>
                <input type="text" className="input-field" value={editRole} onChange={e => setEditRole(e.target.value)} required />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Bio</label>
                <textarea className="input-field" rows={3} value={editBio} onChange={e => setEditBio(e.target.value)} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Location</label>
                  <input type="text" className="input-field" value={editLocation} onChange={e => setEditLocation(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>College / University</label>
                  <input type="text" className="input-field" value={editCollege} onChange={e => setEditCollege(e.target.value)} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Skills (comma separated)</label>
                <input type="text" className="input-field font-mono" value={editSkills} onChange={e => setEditSkills(e.target.value)} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>GitHub</label>
                  <input type="text" className="input-field" placeholder="github.com/..." value={editGithub} onChange={e => setEditGithub(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>LinkedIn</label>
                  <input type="text" className="input-field" placeholder="linkedin.com/in/..." value={editLinkedin} onChange={e => setEditLinkedin(e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Save size={14} />
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
