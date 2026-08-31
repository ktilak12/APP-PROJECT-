import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Challenge } from '../types';
import { Trophy, Send, Sparkles, CheckCircle2, Flame, ExternalLink } from 'lucide-react';

export const ChallengeLeaderboard: React.FC = () => {
  const { challenges, ideas, setSelectedIdea, submitPitchToChallenge, currentUser, setAuthModalOpen } = useApp();
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge>(challenges[0]);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedPitchId, setSelectedPitchId] = useState<string>(ideas[0]?.id || '');

  // Pitches submitted to this challenge or belonging to challenge categories
  const challengeSubmissions = ideas.filter(i => 
    i.challengeId === selectedChallenge.id || 
    (selectedChallenge.categories.includes(i.category) && (!i.challengeId || i.challengeId === selectedChallenge.id))
  );

  const finalSubmissions = challengeSubmissions.length > 0 ? challengeSubmissions : ideas.slice(0, 3);
  
  const leaderboard = [...finalSubmissions].sort((a, b) => {
    const scoreA = (a.aiEvaluation?.overallScore || 80) * 0.6 + (a.upvotes * 0.4);
    const scoreB = (b.aiEvaluation?.overallScore || 80) * 0.6 + (b.upvotes * 0.4);
    return scoreB - scoreA;
  });

  const handleApplyToChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    submitPitchToChallenge(selectedPitchId, selectedChallenge.id);
    setShowSubmitModal(false);
    alert(`Your idea has been officially submitted to ${selectedChallenge.title}! It now appears in the live leaderboard rankings.`);
  };

  return (
    <div className="app-container" style={{ padding: '2rem 1.5rem' }}>
      {/* Header Banner */}
      <div 
        className="glass-card" 
        style={{
          padding: '2.5rem 2rem',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '2rem',
          background: 'var(--grad-hero)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-full)', background: 'var(--bg-surface)', color: 'var(--amber)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem' }}>
          <Trophy size={16} />
          <span>INNOVATION CHALLENGES & HACKATHONS</span>
        </div>

        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Compete in <span className="gradient-text">Sponsored Challenges</span> & Win Cash Prizes
        </h1>

        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '780px' }}>
          Submit your early-stage ideas to active industry challenges. Get evaluated by expert judges, gain investor visibility, and win grant funding.
        </p>
      </div>

      {/* Challenge Cards Carousel / Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {challenges.map(ch => {
          const isSelected = selectedChallenge.id === ch.id;
          return (
            <div 
              key={ch.id} 
              className="glass-card hover-lift"
              style={{
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                background: isSelected ? 'linear-gradient(145deg, var(--bg-surface) 0%, rgba(37, 99, 235, 0.08) 100%)' : 'var(--bg-surface)',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedChallenge(ch)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                <span style={{ fontSize: '1.8rem' }}>{ch.organizerLogo}</span>
                <span className="tag-badge" style={{ background: 'var(--amber-bg)', color: '#D97706', fontWeight: 700, fontSize: '0.85rem' }}>
                  Prize: {ch.prizePool}
                </span>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.3 }}>
                {ch.title}
              </h3>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {ch.description}
              </p>

              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                {ch.categories.map((c, i) => (
                  <span key={i} className="tag-badge font-mono" style={{ fontSize: '0.7rem' }}>{c}</span>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-subtle)', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                <span>⏱️ Deadline: {ch.deadline}</span>
                <span>👥 {ch.participantsCount} Applicants</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Challenge Details & Live Leaderboard */}
      <div 
        className="glass-card" 
        style={{
          padding: '2rem',
          borderRadius: 'var(--radius-lg)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
              Organizer: {selectedChallenge.organizer}
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
              {selectedChallenge.title} <span className="gradient-text">Leaderboard</span>
            </h2>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              <span>🏆 Total Prize Pool: <strong>{selectedChallenge.prizePool}</strong></span>
              <span>•</span>
              <span>📅 Evaluation Deadline: <strong>{selectedChallenge.deadline}</strong></span>
            </div>
          </div>

          <button className="btn btn-primary" onClick={() => setShowSubmitModal(true)}>
            <Send size={16} />
            <span>Submit Idea to Challenge</span>
          </button>
        </div>

        {/* Challenge Rules & Criteria */}
        <div style={{
          background: 'var(--bg-surface-elevated)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Sparkles size={15} color="var(--primary)" />
            <span>Judging Criteria & Submission Rules</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem', fontSize: '0.82rem', color: 'var(--text-main)' }}>
            {selectedChallenge.rules.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={14} color="var(--emerald)" />
                <span>{r}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                <th style={{ padding: '0.75rem' }}>RANK</th>
                <th style={{ padding: '0.75rem' }}>SUBMITTED IDEA</th>
                <th style={{ padding: '0.75rem' }}>CATEGORY</th>
                <th style={{ padding: '0.75rem' }}>CREATOR</th>
                <th style={{ padding: '0.75rem' }}>AI INNOVATION</th>
                <th style={{ padding: '0.75rem' }}>COMMUNITY VOTES</th>
                <th style={{ padding: '0.75rem' }}>TOTAL SCORE</th>
                <th style={{ padding: '0.75rem' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((item, index) => {
                const finalScore = ((item.aiEvaluation?.overallScore || 80) * 0.6 + (item.upvotes * 0.2)).toFixed(1);
                return (
                  <tr 
                    key={item.id} 
                    style={{
                      borderBottom: '1px solid var(--border-color)',
                      background: index === 0 ? 'rgba(245, 158, 11, 0.08)' : index === 1 ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
                      transition: 'background 0.2s ease'
                    }}
                  >
                    <td style={{ padding: '1rem 0.75rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                      {index === 0 ? '🥇 #1' : index === 1 ? '🥈 #2' : index === 2 ? '🥉 #3' : `#${index + 1}`}
                    </td>
                    <td style={{ padding: '1rem 0.75rem', fontWeight: 700, color: 'var(--primary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span>{item.title}</span>
                        {item.challengeId === selectedChallenge.id && (
                          <span className="tag-badge" style={{ fontSize: '0.65rem', background: 'var(--primary-glow)', color: 'var(--primary)' }}>SUBMITTED</span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 0.75rem' }}>
                      <span className="tag-badge">{item.category}</span>
                    </td>
                    <td style={{ padding: '1rem 0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <img src={item.author.avatar} alt={item.author.name} style={{ width: '26px', height: '26px', borderRadius: '50%' }} />
                        <span style={{ fontWeight: 600 }}>{item.author.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 0.75rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--secondary)' }}>
                      {item.aiEvaluation?.overallScore || 80}/100
                    </td>
                    <td style={{ padding: '1rem 0.75rem', fontWeight: 700, color: '#EF4444' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Flame size={14} />
                        <span>{item.upvotes}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 0.75rem', fontWeight: 800, color: 'var(--emerald)', fontFamily: 'var(--font-mono)' }}>
                      {finalScore} pts
                    </td>
                    <td style={{ padding: '1rem 0.75rem' }}>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => setSelectedIdea(item)}
                      >
                        <span>Inspect</span>
                        <ExternalLink size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submit Idea Modal */}
      {showSubmitModal && (
        <div className="modal-overlay" style={{ zIndex: 120 }}>
          <div className="modal-content" style={{ maxWidth: '520px', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Submit Pitch to {selectedChallenge.title}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.2rem' }}>
              Select one of your existing pitches to submit for prize judging ({selectedChallenge.prizePool}).
            </p>

            <form onSubmit={handleApplyToChallenge} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem', display: 'block' }}>Select Pitch *</label>
                <select className="input-field" value={selectedPitchId} onChange={e => setSelectedPitchId(e.target.value)}>
                  {ideas.map(i => (
                    <option key={i.id} value={i.id}>{i.title} ({i.category} • Stage: {i.stage})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowSubmitModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Submit to Hackathon</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
