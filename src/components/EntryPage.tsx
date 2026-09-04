import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  Users, 
  ArrowRight,
  ShieldCheck,
  Lightbulb,
  Kanban,
  LogIn
} from 'lucide-react';
import { IdeaCard } from './IdeaCard';

export const EntryPage: React.FC = () => {
  const { 
    setAuthModalOpen, 
    setAuthModalMode, 
    setActiveView, 
    ideas, 
    currentUser
  } = useApp();

  const handleOpenLogin = () => {
    setAuthModalMode('choose');
    setAuthModalOpen(true);
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 70px)', display: 'flex', flexDirection: 'column' }}>
      {/* Hero Section */}
      <section style={{
        padding: '5.5rem 1.5rem 4.5rem 1.5rem',
        textAlign: 'center',
        position: 'relative',
        background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(37, 99, 235, 0.12) 0%, transparent 80%)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div className="app-container" style={{ maxWidth: '820px' }}>
          {/* Subtle Clean Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.35rem 0.95rem',
            borderRadius: 'var(--radius-full)',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-color)',
            fontSize: '0.82rem',
            fontWeight: 600,
            color: 'var(--primary)',
            marginBottom: '1.75rem'
          }}>
            <Sparkles size={14} />
            <span>Idea Pitching & Co-Founder Platform</span>
          </div>

          {/* Clean Main Title */}
          <h1 style={{
            fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            marginBottom: '1.25rem'
          }}>
            Where Bold Ideas Turn Into <br />
            <span className="gradient-text">Great Products.</span>
          </h1>

          {/* Clear, Minimal Subtitle */}
          <p style={{
            fontSize: '1.15rem',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            maxWidth: '620px',
            marginInline: 'auto',
            marginBottom: '2.5rem'
          }}>
            Pitch your startup concept, receive instant AI viability feedback, find complementary co-founders, and build real prototypes together.
          </p>

          {/* Clean Action Buttons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            {currentUser ? (
              <button
                onClick={() => setActiveView('explore')}
                className="btn btn-primary hover-lift"
                style={{
                  padding: '0.85rem 2rem',
                  fontSize: '1rem',
                  borderRadius: 'var(--radius-full)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <span>Go to Home Dashboard</span>
                <ArrowRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleOpenLogin}
                className="btn btn-primary hover-lift"
                style={{
                  padding: '0.9rem 2.25rem',
                  fontSize: '1.05rem',
                  borderRadius: 'var(--radius-full)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.65rem'
                }}
              >
                <LogIn size={18} />
                <span>Sign in with Google to Enter</span>
              </button>
            )}
          </div>

          {/* Minimal Trust Indicator */}
          <div style={{
            marginTop: '2.5rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.8rem',
            color: 'var(--text-subtle)'
          }}>
            <ShieldCheck size={15} color="var(--emerald)" />
            <span>Secure 1-click Google OAuth • Zero spam • Open innovation</span>
          </div>
        </div>
      </section>

      {/* 3 Clean Value Pillars */}
      <section style={{ padding: '4.5rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
        <div className="app-container" style={{ maxWidth: '1080px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {/* Pillar 1 */}
            <div className="glass-card" style={{
              padding: '2.25rem 2rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'rgba(37, 99, 235, 0.1)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <Lightbulb size={22} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.6rem' }}>
                AI Viability Scoring
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.55 }}>
                Get instant objective analysis on problem clarity, feasibility, and market potential before investing months of effort.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="glass-card" style={{
              padding: '2.25rem 2rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'rgba(124, 58, 237, 0.1)',
                color: 'var(--secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <Users size={22} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.6rem' }}>
                Co-Founder Matching
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.55 }}>
                Connect with engineers, designers, and domain specialists matched specifically to your idea's required tech stack.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="glass-card" style={{
              padding: '2.25rem 2rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.1)',
                color: 'var(--emerald)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <Kanban size={22} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.6rem' }}>
                Sprint Kanban Board
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.55 }}>
                Turn high-level concepts into actionable sprints. Assign tasks, track progress, and move from Idea to Prototype to MVP.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Ideas Clean Preview */}
      <section style={{ padding: '4rem 1.5rem', background: 'var(--bg-surface)' }}>
        <div className="app-container" style={{ maxWidth: '1080px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.04em', marginBottom: '0.25rem' }}>
                LIVE SHOWCASE
              </div>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800 }}>
                Featured Community Pitches
              </h2>
            </div>

            <button
              onClick={currentUser ? () => setActiveView('explore') : handleOpenLogin}
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <span>{currentUser ? 'View All Pitches' : 'Sign in to View All Pitches'}</span>
              <ArrowRight size={15} />
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}>
            {ideas.slice(0, 3).map(idea => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        </div>
      </section>

      {/* Clean Call To Action Section */}
      <section style={{
        padding: '5rem 1.5rem',
        textAlign: 'center',
        background: 'radial-gradient(ellipse 70% 50% at 50% 100%, rgba(37, 99, 235, 0.08) 0%, transparent 70%)'
      }}>
        <div className="app-container" style={{ maxWidth: '640px' }}>
          <h2 style={{ fontSize: '2.1rem', fontWeight: 800, marginBottom: '0.85rem' }}>
            Ready to Build Your Next Idea?
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            Sign in with your Google account to pitch, collaborate with builders, and submit to prize challenges.
          </p>
          <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {currentUser ? (
              <button
                onClick={() => setActiveView('explore')}
                className="btn btn-primary hover-lift"
                style={{
                  padding: '0.85rem 2rem',
                  fontSize: '1rem',
                  borderRadius: 'var(--radius-full)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <span>Enter Home Dashboard</span>
                <ArrowRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleOpenLogin}
                className="btn btn-primary hover-lift"
                style={{
                  padding: '0.85rem 2.25rem',
                  fontSize: '1rem',
                  borderRadius: 'var(--radius-full)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem'
                }}
              >
                <LogIn size={18} />
                <span>Sign in with Google to Enter</span>
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
