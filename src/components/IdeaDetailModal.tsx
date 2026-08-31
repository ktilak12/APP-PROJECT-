import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Flame, 
  Lightbulb, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Star, 
  Code2, 
  ExternalLink,
  Send,
  UserPlus,
  ThumbsUp,
  UserCheck
} from 'lucide-react';

export const IdeaDetailModal: React.FC = () => {
  const { 
    selectedIdea, 
    setSelectedIdea, 
    handleUpvote, 
    handleToggleInterest, 
    addFeedbackToIdea,
    addCommentToIdea,
    applyToTeam,
    approveTeamMember,
    currentUser,
    setAuthModalOpen
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'ai' | 'feedback' | 'team' | 'comments'>('overview');
  
  const [problemClarity, setProblemClarity] = useState(5);
  const [innovation, setInnovation] = useState(4);
  const [feasibility, setFeasibility] = useState(4);
  const [marketPotential, setMarketPotential] = useState(4);
  const [socialImpact, setSocialImpact] = useState(5);
  const [technicalDifficulty, setTechnicalDifficulty] = useState(3);
  const [feedbackComment, setFeedbackComment] = useState('');

  const [newComment, setNewComment] = useState('');

  const [applyRole, setApplyRole] = useState('');
  const [showApplyModal, setShowApplyModal] = useState(false);

  if (!selectedIdea) return null;

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    addFeedbackToIdea(selectedIdea.id, {
      problemClarity,
      innovation,
      feasibility,
      marketPotential,
      socialImpact,
      technicalDifficulty,
      comment: feedbackComment
    });
    setFeedbackComment('');
    alert('Thank you for providing structured evaluation on this pitch!');
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    if (!newComment.trim()) return;
    addCommentToIdea(selectedIdea.id, newComment.trim());
    setNewComment('');
  };

  const handleTeamApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    if (!applyRole.trim()) return;
    applyToTeam(selectedIdea.id, applyRole.trim());
    setShowApplyModal(false);
    setApplyRole('');
    alert('Your collaborator application has been submitted to the project lead!');
  };

  const isTeamMember = currentUser ? selectedIdea.team?.some(m => m.userId === currentUser.id) : false;
  const isFounder = currentUser && selectedIdea.author.id === currentUser.id;

  return (
    <div className="modal-overlay" onClick={() => setSelectedIdea(null)}>
      <div 
        className="modal-content" 
        onClick={e => e.stopPropagation()} 
        style={{ position: 'relative' }}
      >
        <button 
          onClick={() => setSelectedIdea(null)}
          className="btn btn-secondary btn-icon"
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            zIndex: 10,
            borderRadius: '50%'
          }}
        >
          <X size={20} />
        </button>

        <div style={{
          padding: '2rem 2rem 1.25rem 2rem',
          borderBottom: '1px solid var(--border-color)',
          background: 'var(--grad-hero)'
        }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span className="tag-badge" style={{ background: 'var(--bg-surface)', color: 'var(--primary)' }}>
              {selectedIdea.category}
            </span>
            <span className={`stage-pill ${selectedIdea.stage.replace(/\s+/g, '-')}`}>
              {selectedIdea.stage}
            </span>
          </div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.4rem', lineHeight: 1.3 }}>
            {selectedIdea.title}
          </h2>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.2rem' }}>
            {selectedIdea.tagline}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <button 
                className={`btn ${selectedIdea.userUpvoted ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => handleUpvote(selectedIdea.id)}
              >
                <Flame size={18} color={selectedIdea.userUpvoted ? '#FFFFFF' : '#EF4444'} />
                <span>Upvote ({selectedIdea.upvotes})</span>
              </button>

              <button 
                className="btn btn-secondary"
                onClick={() => handleToggleInterest(selectedIdea.id)}
                style={{ color: selectedIdea.userInterested ? '#F59E0B' : 'inherit' }}
              >
                <Lightbulb size={18} />
                <span>{selectedIdea.userInterested ? 'Interested' : 'Bookmark'}</span>
              </button>

              {!isTeamMember && (
                <button 
                  className="btn btn-outline"
                  onClick={() => {
                    if (!currentUser) {
                      setAuthModalOpen(true);
                    } else {
                      setShowApplyModal(true);
                    }
                  }}
                >
                  <UserPlus size={18} />
                  <span>Join Team</span>
                </button>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <img 
                src={selectedIdea.author.avatar} 
                alt={selectedIdea.author.name}
                style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} 
              />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{selectedIdea.author.name}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>Pitched on {new Date(selectedIdea.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-color)',
          background: 'var(--bg-surface-elevated)',
          padding: '0 1.5rem',
          gap: '0.5rem',
          overflowX: 'auto'
        }}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              padding: '0.85rem 1rem',
              fontWeight: 700,
              fontSize: '0.88rem',
              borderBottom: activeTab === 'overview' ? '3px solid var(--primary)' : '3px solid transparent',
              color: activeTab === 'overview' ? 'var(--primary)' : 'var(--text-muted)',
              background: 'transparent',
              borderTop: 'none', borderLeft: 'none', borderRight: 'none',
              cursor: 'pointer'
            }}
          >
            Overview & Pitch
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            style={{
              padding: '0.85rem 1rem',
              fontWeight: 700,
              fontSize: '0.88rem',
              borderBottom: activeTab === 'ai' ? '3px solid var(--secondary)' : '3px solid transparent',
              color: activeTab === 'ai' ? 'var(--secondary)' : 'var(--text-muted)',
              background: 'transparent',
              borderTop: 'none', borderLeft: 'none', borderRight: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <Sparkles size={15} />
            <span>AI Evaluation ({selectedIdea.aiEvaluation?.overallScore || 80}/100)</span>
          </button>

          <button
            onClick={() => setActiveTab('feedback')}
            style={{
              padding: '0.85rem 1rem',
              fontWeight: 700,
              fontSize: '0.88rem',
              borderBottom: activeTab === 'feedback' ? '3px solid var(--primary)' : '3px solid transparent',
              color: activeTab === 'feedback' ? 'var(--primary)' : 'var(--text-muted)',
              background: 'transparent',
              borderTop: 'none', borderLeft: 'none', borderRight: 'none',
              cursor: 'pointer'
            }}
          >
            Crowd Feedback ({selectedIdea.feedbackList?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab('team')}
            style={{
              padding: '0.85rem 1rem',
              fontWeight: 700,
              fontSize: '0.88rem',
              borderBottom: activeTab === 'team' ? '3px solid var(--primary)' : '3px solid transparent',
              color: activeTab === 'team' ? 'var(--primary)' : 'var(--text-muted)',
              background: 'transparent',
              borderTop: 'none', borderLeft: 'none', borderRight: 'none',
              cursor: 'pointer'
            }}
          >
            Team ({selectedIdea.team?.length || 1})
          </button>

          <button
            onClick={() => setActiveTab('comments')}
            style={{
              padding: '0.85rem 1rem',
              fontWeight: 700,
              fontSize: '0.88rem',
              borderBottom: activeTab === 'comments' ? '3px solid var(--primary)' : '3px solid transparent',
              color: activeTab === 'comments' ? 'var(--primary)' : 'var(--text-muted)',
              background: 'transparent',
              borderTop: 'none', borderLeft: 'none', borderRight: 'none',
              cursor: 'pointer'
            }}
          >
            Discussions ({selectedIdea.comments?.length || 0})
          </button>
        </div>

        <div style={{ padding: '1.75rem' }}>
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--primary)' }}>
                  Problem Statement
                </h4>
                <p style={{ color: 'var(--text-main)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                  {selectedIdea.problem}
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--secondary)' }}>
                  Proposed Solution
                </h4>
                <p style={{ color: 'var(--text-main)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                  {selectedIdea.solution}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem' }}>Required Team Skills</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {selectedIdea.requiredSkills.map((sk, idx) => (
                      <span key={idx} className="tag-badge font-mono">{sk}</span>
                    ))}
                  </div>
                </div>

                <div style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem' }}>Technology Architecture</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {selectedIdea.techStack.map((tech, idx) => (
                      <span key={idx} className="tag-badge font-mono" style={{ background: 'var(--primary-glow)', color: 'var(--primary)' }}>{tech}</span>
                    ))}
                  </div>
                </div>
              </div>

              {(selectedIdea.githubUrl || selectedIdea.demoUrl) && (
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {selectedIdea.githubUrl && (
                    <a href={selectedIdea.githubUrl.startsWith('http') ? selectedIdea.githubUrl : `https://${selectedIdea.githubUrl}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                      <Code2 size={16} />
                      <span>View GitHub Repository</span>
                    </a>
                  )}
                  {selectedIdea.demoUrl && (
                    <a href={selectedIdea.demoUrl.startsWith('http') ? selectedIdea.demoUrl : `https://${selectedIdea.demoUrl}`} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
                      <ExternalLink size={16} />
                      <span>Live Prototype Demo</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'ai' && selectedIdea.aiEvaluation && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.5rem',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(37, 99, 235, 0.15))',
                border: '1px solid rgba(124, 58, 237, 0.3)'
              }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--secondary)' }}>AI Innovation Assessment Score</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--secondary)', fontFamily: 'var(--font-mono)' }}>
                    {selectedIdea.aiEvaluation.overallScore}<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}> / 100</span>
                  </div>
                </div>
                <Sparkles size={48} color="var(--secondary)" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600 }}>
                    <span>Problem Clarity</span>
                    <span>{selectedIdea.aiEvaluation.problemClarity}%</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--bg-surface-elevated)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${selectedIdea.aiEvaluation.problemClarity}%`, height: '100%', background: '#3B82F6' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600 }}>
                    <span>Innovation Level</span>
                    <span>{selectedIdea.aiEvaluation.innovationScore}%</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--bg-surface-elevated)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${selectedIdea.aiEvaluation.innovationScore}%`, height: '100%', background: '#7C3AED' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600 }}>
                    <span>Feasibility</span>
                    <span>{selectedIdea.aiEvaluation.feasibilityScore}%</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--bg-surface-elevated)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${selectedIdea.aiEvaluation.feasibilityScore}%`, height: '100%', background: '#10B981' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600 }}>
                    <span>Market Potential</span>
                    <span>{selectedIdea.aiEvaluation.marketPotential}%</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--bg-surface-elevated)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${selectedIdea.aiEvaluation.marketPotential}%`, height: '100%', background: '#F59E0B' }} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', background: 'var(--emerald-bg)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  <div style={{ fontWeight: 700, color: 'var(--emerald)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle2 size={18} />
                    <span>AI Key Strengths</span>
                  </div>
                  <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                    {selectedIdea.aiEvaluation.strengths.map((str, idx) => (
                      <li key={idx} style={{ marginBottom: '0.35rem' }}>{str}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', background: 'var(--amber-bg)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                  <div style={{ fontWeight: 700, color: '#D97706', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <AlertTriangle size={18} />
                    <span>Potential Market Risks</span>
                  </div>
                  <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                    {selectedIdea.aiEvaluation.risks.map((r, idx) => (
                      <li key={idx} style={{ marginBottom: '0.35rem' }}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'feedback' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <form onSubmit={handleFeedbackSubmit} style={{ background: 'var(--bg-surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                  Submit Your Structured Evaluation
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>Problem Clarity (1-5)</label>
                    <input type="number" min="1" max="5" value={problemClarity} onChange={e => setProblemClarity(Number(e.target.value))} className="input-field" />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>Innovation (1-5)</label>
                    <input type="number" min="1" max="5" value={innovation} onChange={e => setInnovation(Number(e.target.value))} className="input-field" />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>Feasibility (1-5)</label>
                    <input type="number" min="1" max="5" value={feasibility} onChange={e => setFeasibility(Number(e.target.value))} className="input-field" />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>Market Potential (1-5)</label>
                    <input type="number" min="1" max="5" value={marketPotential} onChange={e => setMarketPotential(Number(e.target.value))} className="input-field" />
                  </div>
                </div>

                <div style={{ marginBottom: '0.75rem' }}>
                  <textarea 
                    className="input-field"
                    placeholder="Provide constructive feedback or questions for the creator..."
                    rows={2}
                    value={feedbackComment}
                    onChange={e => setFeedbackComment(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-sm">
                  Submit Feedback (+25 Rep Points)
                </button>
              </form>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {selectedIdea.feedbackList?.map(fb => (
                  <div key={fb.id} style={{ border: '1px solid var(--border-color)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <img src={fb.userAvatar} alt={fb.userName} style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
                        <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{fb.userName}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--amber)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <Star size={14} fill="#F59E0B" />
                        <span>Score: {((fb.problemClarity + fb.innovation + fb.feasibility + fb.marketPotential + fb.socialImpact) / 5).toFixed(1)} / 5</span>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-main)' }}>{fb.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <h4 style={{ fontWeight: 700 }}>Project Roster ({selectedIdea.team?.length} members)</h4>
                {!isTeamMember && (
                  <button className="btn btn-primary btn-sm" onClick={() => {
                    if (!currentUser) {
                      setAuthModalOpen(true);
                    } else {
                      setShowApplyModal(true);
                    }
                  }}>
                    Apply to Join Team
                  </button>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
                {selectedIdea.team?.map((m, i) => (
                  <div key={i} style={{ border: '1px solid var(--border-color)', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img src={m.avatar} alt={m.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{m.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--primary)' }}>{m.role}</div>
                        <span className="tag-badge" style={{ marginTop: '0.25rem', fontSize: '0.65rem' }}>
                          {m.status}
                        </span>
                      </div>
                    </div>

                    {isFounder && m.status === 'Pending' && (
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => approveTeamMember(selectedIdea.id, m.userId)}
                        title="Accept into project team"
                        style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                      >
                        <UserCheck size={13} />
                        <span>Accept</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'comments' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <form onSubmit={handleCommentSubmit} style={{ display: 'flex', gap: '0.75rem' }}>
                <input 
                  type="text"
                  className="input-field"
                  placeholder="Ask a question or discuss this pitch..."
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                />
                <button type="submit" className="btn btn-primary">
                  <Send size={16} />
                  <span>Post</span>
                </button>
              </form>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {selectedIdea.comments?.map(c => (
                  <div key={c.id} style={{ display: 'flex', gap: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
                    <img src={c.userAvatar} alt={c.userName} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{c.userName}</span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p style={{ fontSize: '0.88rem' }}>{c.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showApplyModal && (
        <div className="modal-overlay" style={{ zIndex: 120 }}>
          <div className="modal-content" style={{ maxWidth: '480px', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Apply to Join {selectedIdea.title}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.2rem' }}>
              Specify the role or contribution skills you bring to this project team.
            </p>

            <form onSubmit={handleTeamApplySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem', display: 'block' }}>
                  Target Role / Skill Contribution *
                </label>
                <input 
                  type="text"
                  className="input-field"
                  placeholder="e.g. ML Engineer, Frontend Developer, Agronomist"
                  value={applyRole}
                  onChange={e => setApplyRole(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowApplyModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
