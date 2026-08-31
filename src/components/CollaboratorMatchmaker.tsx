import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { mockUsers } from '../data/mockData';
import { User, Idea } from '../types';
import { Sparkles, Award, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';

export const CollaboratorMatchmaker: React.FC = () => {
  const { ideas, currentUser, applyToTeam } = useApp();
  const [selectedIdeaId, setSelectedIdeaId] = useState<string>(ideas[0]?.id || '');
  const [skillQuery, setSkillQuery] = useState<string>('');

  const currentIdea = ideas.find(i => i.id === selectedIdeaId) || ideas[0];

  const calculateUserMatch = (user: User, idea: Idea) => {
    if (!idea || !idea.requiredSkills.length) return 75;
    
    const required = idea.requiredSkills.map(s => s.toLowerCase());
    const userSkills = user.skills.map(s => s.toLowerCase());
    
    let matchedCount = 0;
    required.forEach(req => {
      if (userSkills.some(us => us.includes(req) || req.includes(us))) {
        matchedCount++;
      }
    });

    const skillScore = (matchedCount / required.length) * 60;
    const interestScore = user.interests.includes(idea.category) ? 30 : 15;
    const repScore = Math.min(10, (user.reputation / 3000) * 10);

    return Math.min(98, Math.round(skillScore + interestScore + repScore));
  };

  const candidates = mockUsers.map(u => ({
    user: u,
    matchScore: currentIdea ? calculateUserMatch(u, currentIdea) : 80,
    matchedSkills: u.skills.filter(s => 
      currentIdea?.requiredSkills.some(req => 
        req.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(req.toLowerCase())
      )
    )
  })).sort((a, b) => b.matchScore - a.matchScore);

  return (
    <div className="app-container" style={{ padding: '2rem 1.5rem' }}>
      <div className="glass-card" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', marginBottom: '2rem', background: 'var(--grad-hero)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-full)', background: 'var(--bg-surface)', color: 'var(--secondary)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          <Sparkles size={15} />
          <span>ML COLLABORATOR MATCHMAKER</span>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Find Matching <span className="gradient-text">Co-Founders & Teammates</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '750px' }}>
          Our AI algorithm computes candidate compatibility by matching required project skills, domain interests, and past execution reputation.
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '280px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', display: 'block' }}>
            Select Target Project:
          </label>
          <select 
            className="input-field"
            value={selectedIdeaId}
            onChange={e => setSelectedIdeaId(e.target.value)}
          >
            {ideas.map(idea => (
              <option key={idea.id} value={idea.id}>
                {idea.title} ({idea.category} • Required: {idea.requiredSkills.join(', ')})
              </option>
            ))}
          </select>
        </div>

        <div style={{ flex: 1, minWidth: '220px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', display: 'block' }}>
            Filter Candidates by Skill:
          </label>
          <input 
            type="text"
            className="input-field"
            placeholder="e.g. PyTorch, React, UI/UX"
            value={skillQuery}
            onChange={e => setSkillQuery(e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {candidates
          .filter(c => !skillQuery || c.user.skills.some(s => s.toLowerCase().includes(skillQuery.toLowerCase())))
          .map(({ user, matchScore, matchedSkills }) => (
            <div 
              key={user.id} 
              className="glass-card hover-lift"
              style={{
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} 
                    />
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.2 }}>{user.name}</h3>
                      <div style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600 }}>{user.role}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '2px' }}>
                        <MapPin size={11} />
                        <span>{user.location}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    background: matchScore >= 85 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(37, 99, 235, 0.12)',
                    border: matchScore >= 85 ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(37, 99, 235, 0.3)',
                    color: matchScore >= 85 ? '#10B981' : 'var(--primary)',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {matchScore}% Match
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.4 }}>
                  {user.bio}
                </p>

                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                    Matched Skills ({matchedSkills.length}/{currentIdea?.requiredSkills.length})
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {user.skills.map((sk, i) => {
                      const isMatched = matchedSkills.includes(sk);
                      return (
                        <span 
                          key={i} 
                          className="tag-badge font-mono"
                          style={{
                            background: isMatched ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-surface-elevated)',
                            color: isMatched ? '#10B981' : 'var(--text-muted)',
                            borderColor: isMatched ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-color)',
                            fontWeight: isMatched ? 700 : 500
                          }}
                        >
                          {isMatched && <CheckCircle2 size={12} />}
                          {sk}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div style={{
                paddingTop: '0.85rem',
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Award size={14} color="var(--amber)" />
                  <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{user.reputation}</span> Rep Points
                </div>

                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    if (currentIdea) {
                      applyToTeam(currentIdea.id, user.role);
                      alert(`Invite invitation sent to ${user.name} for ${currentIdea.title}!`);
                    }
                  }}
                >
                  <span>Invite to Team</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
