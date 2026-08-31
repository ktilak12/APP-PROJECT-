import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  Users, 
  Trophy, 
  Kanban, 
  ArrowRight, 
  CheckCircle2, 
  Flame,
  Star,
  Layers,
  Award
} from 'lucide-react';
import { IdeaCard } from './IdeaCard';

export const EntryPage: React.FC = () => {
  const { 
    setAuthModalOpen, 
    setAuthModalMode, 
    setActiveView, 
    ideas, 
    accounts,
    currentUser,
    switchAccount
  } = useApp();

  const handleGoogleSignInClick = () => {
    setAuthModalMode('choose');
    setAuthModalOpen(true);
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
    <div style={{ paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <section style={{
        padding: '4.5rem 1.5rem 3.5rem 1.5rem',
        background: 'var(--grad-hero)',
        borderBottom: '1px solid var(--border-color)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="app-container" style={{ textAlign: 'center', maxWidth: '900px' }}>
          {/* Top Pill Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: 'var(--radius-full)',
            background: 'var(--bg-surface)',
            color: 'var(--primary)',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '1.5rem',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border-color)'
          }}>
            <Sparkles size={16} />
            <span>THE IDEA-TO-EXECUTION & COLLABORATION PLATFORM</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            marginBottom: '1.25rem'
          }}>
            Turn Bold Concepts Into <br />
            <span className="gradient-text">Real-World Venture Impact.</span>
          </h1>

          <p style={{
            fontSize: '1.15rem',
            color: 'var(--text-muted)',
            marginBottom: '2rem',
            lineHeight: 1.6,
            maxWidth: '720px',
            marginInline: 'auto'
          }}>
            Pitch early-stage startup ideas, get instant structured AI evaluations, recruit high-caliber co-founders, compete in cash prize hackathons, and track execution on Kanban boards.
          </p>

          {/* CTA Cluster */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '2.5rem'
          }}>
            <button
              onClick={handleGoogleSignInClick}
              className="btn btn-primary hover-lift"
              style={{
                padding: '0.85rem 1.75rem',
                fontSize: '1rem',
                borderRadius: 'var(--radius-full)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              <div style={{
                background: '#FFFFFF',
                borderRadius: '50%',
                padding: '3px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <GoogleLogoSvg />
              </div>
              <span>Continue with Google</span>
            </button>

            <button
              onClick={() => setActiveView('explore')}
              className="btn btn-secondary"
              style={{
                padding: '0.85rem 1.75rem',
                fontSize: '1rem',
                borderRadius: 'var(--radius-full)'
              }}
            >
              <span>Explore as Guest</span>
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Multi-Account Quick Switcher Bar */}
          <div className="glass-card" style={{
            padding: '1rem 1.5rem',
            borderRadius: 'var(--radius-full)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
            maxWidth: '100%'
          }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              AVAILABLE GOOGLE ACCOUNTS:
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              {accounts.slice(0, 4).map(acc => {
                const isCurrent = currentUser?.id === acc.id;
                return (
                  <div
                    key={acc.id}
                    onClick={() => switchAccount(acc.id)}
                    title={`Click to switch to ${acc.name} (${acc.email})`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.25rem 0.65rem 0.25rem 0.25rem',
                      borderRadius: 'var(--radius-full)',
                      background: isCurrent ? 'rgba(37, 99, 235, 0.15)' : 'var(--bg-surface-elevated)',
                      border: isCurrent ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                      cursor: 'pointer',
                      fontSize: '0.78rem',
                      fontWeight: 600
                    }}
                  >
                    <img 
                      src={acc.avatar} 
                      alt={acc.name} 
                      style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }} 
                    />
                    <span>{acc.name.split(' ')[0]}</span>
                    {isCurrent && <span style={{ color: 'var(--primary)', fontWeight: 800 }}>✓</span>}
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => {
                setAuthModalMode('add_google');
                setAuthModalOpen(true);
              }}
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: 'var(--primary)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              + Add Google ID
            </button>
          </div>
        </div>
      </section>

      {/* Live Metric Statistics Bar */}
      <section style={{ padding: '2.5rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
        <div className="app-container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem'
          }}>
            <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                1,250+
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                Startup Pitches Evaluated
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--secondary)', fontFamily: 'var(--font-mono)' }}>
                98.4%
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                ML Teammate Match Accuracy
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--emerald)', fontFamily: 'var(--font-mono)' }}>
                ₹15,00,000+
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                Hackathon Prize Grants
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--amber)', fontFamily: 'var(--font-mono)' }}>
                4,800+
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                Engineers & Designers
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Spotlight Section */}
      <section style={{ padding: '4rem 1.5rem' }}>
        <div className="app-container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              Built for <span className="gradient-text">Serious Innovation</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '600px', marginInline: 'auto' }}>
              Everything an aspiring founder or builder needs to validate ideas, build teams, and execute.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.75rem'
          }}>
            {/* Feature 1 */}
            <div className="glass-card hover-lift" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(37, 99, 235, 0.12)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <Sparkles size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                AI Pitch Assessment & Duplicate Scan
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Real-time scoring algorithm analyzing problem clarity, innovation uniqueness, feasibility, and market risks with live semantic similarity checks.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-card hover-lift" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(124, 58, 237, 0.12)',
                color: 'var(--secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <Users size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                ML Collaborator Matchmaker
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Find verified co-founders matched by required technology stack, domain interests, and execution reputation score.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-card hover-lift" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.12)',
                color: 'var(--emerald)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <Kanban size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Execution Kanban Workspace
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Manage the full transition from Idea ➜ Prototype ➜ MVP with interactive sprint task boards and team assignment.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="glass-card hover-lift" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(245, 158, 11, 0.12)',
                color: 'var(--amber)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <Trophy size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Hackathons & Shark Tank Judging
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Compete in corporate and venture-backed innovation challenges with transparent, merit-based leaderboard rankings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Pitches Preview */}
      <section style={{ padding: '3rem 1.5rem', background: 'var(--bg-surface-elevated)' }}>
        <div className="app-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Featured Innovation Pitches</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Browse early-stage projects submitted by our community of developers & students.
              </p>
            </div>
            <button 
              onClick={() => setActiveView('explore')} 
              className="btn btn-secondary btn-sm"
            >
              <span>View All Pitches</span>
              <ArrowRight size={15} />
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '1.5rem'
          }}>
            {ideas.slice(0, 3).map(idea => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div className="app-container">
          <div className="glass-card" style={{
            padding: '3.5rem 2rem',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--grad-brand)',
            color: '#FFFFFF',
            maxWidth: '800px',
            marginInline: 'auto'
          }}>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: '1rem', lineHeight: 1.2 }}>
              Ready to Pitch Your Next Breakthrough?
            </h2>
            <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '2rem', maxWidth: '600px', marginInline: 'auto' }}>
              Sign in with your Google account in 5 seconds and start building your team today.
            </p>
            <button
              onClick={handleGoogleSignInClick}
              style={{
                padding: '0.9rem 2rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '1rem',
                fontWeight: 700,
                background: '#FFFFFF',
                color: 'var(--primary)',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
              }}
            >
              <GoogleLogoSvg />
              <span>Get Started with Google</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
