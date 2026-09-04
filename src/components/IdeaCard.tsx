import React, { useState } from 'react';
import { Idea } from '../types';
import { useApp } from '../context/AppContext';
import { Flame, Lightbulb, MessageSquare, Sparkles, Trash2 } from 'lucide-react';
import { QuickCommentModal } from './QuickCommentModal';

interface IdeaCardProps {
  idea: Idea;
}

export const IdeaCard: React.FC<IdeaCardProps> = ({ idea }) => {
  const { setSelectedIdea, handleUpvote, handleToggleInterest, deleteIdea, currentUser } = useApp();
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  const getStageClass = (stage: string) => {
    return stage.replace(/\s+/g, '-');
  };

  return (
    <>
      <div 
        className="glass-card hover-lift"
        style={{
          padding: '1.4rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden'
        }}
        onClick={() => setSelectedIdea(idea)}
      >
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.85rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="tag-badge" style={{ background: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)' }}>
                {idea.category}
              </span>
              <span className={`stage-pill ${getStageClass(idea.stage)}`}>
                {idea.stage}
              </span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              padding: '0.25rem 0.6rem',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.12), rgba(37, 99, 235, 0.12))',
              border: '1px solid rgba(124, 58, 237, 0.3)',
              color: 'var(--secondary)',
              fontSize: '0.75rem',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)'
            }}>
              <Sparkles size={13} />
              <span>{idea.aiEvaluation?.overallScore || 80}/100 AI Score</span>
            </div>
          </div>

          <h3 style={{
            fontSize: '1.15rem',
            fontWeight: 700,
            color: 'var(--text-main)',
            marginBottom: '0.4rem',
            lineHeight: 1.35
          }}>
            {idea.title}
          </h3>

          <p style={{
            fontSize: '0.88rem',
            color: 'var(--text-muted)',
            marginBottom: '1rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {idea.tagline}
          </p>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.35rem',
            marginBottom: '1.1rem'
          }}>
            {idea.requiredSkills.slice(0, 4).map((skill, index) => (
              <span 
                key={index}
                className="tag-badge font-mono"
                style={{ fontSize: '0.7rem' }}
              >
                {skill}
              </span>
            ))}
            {idea.requiredSkills.length > 4 && (
              <span className="tag-badge font-mono" style={{ fontSize: '0.7rem' }}>
                +{idea.requiredSkills.length - 4} more
              </span>
            )}
          </div>
        </div>

        <div style={{ marginBottom: '1.1rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--text-muted)',
            marginBottom: '0.35rem'
          }}>
            <span>Lifecycle Progress</span>
            <span className="font-mono">{idea.stageProgress}%</span>
          </div>
          <div style={{
            width: '100%',
            height: '6px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--bg-surface-elevated)',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${idea.stageProgress}%`,
              height: '100%',
              borderRadius: 'var(--radius-full)',
              background: 'var(--grad-brand)',
              transition: 'width 0.5s ease'
            }} />
          </div>
        </div>

        <div style={{
          paddingTop: '0.85rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img 
              src={idea.author.avatar} 
              alt={idea.author.name} 
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>
                {idea.author.name}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>
                {idea.author.role.split('|')[0]}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <button 
              className={`btn btn-sm ${idea.userUpvoted ? 'btn-primary' : 'btn-secondary'}`}
              onClick={(e) => {
                e.stopPropagation();
                handleUpvote(idea.id);
              }}
              style={{ padding: '0.25rem 0.55rem', fontSize: '0.78rem' }}
              title="Upvote idea"
            >
              <Flame size={14} color={idea.userUpvoted ? '#FFFFFF' : '#EF4444'} />
              <span>{idea.upvotes}</span>
            </button>

            <button 
              className={`btn btn-sm ${idea.userInterested ? 'btn-secondary' : 'btn-secondary'}`}
              onClick={(e) => {
                e.stopPropagation();
                handleToggleInterest(idea.id);
              }}
              style={{ 
                padding: '0.25rem 0.5rem', 
                fontSize: '0.78rem',
                color: idea.userInterested ? '#F59E0B' : 'var(--text-muted)',
                borderColor: idea.userInterested ? '#F59E0B' : 'var(--border-color)'
              }}
              title="Bookmark / Interested"
            >
              <Lightbulb size={14} />
              <span>{idea.interestsCount}</span>
            </button>

            {/* Quick Comment Button */}
            <button 
              className="btn btn-sm btn-secondary"
              onClick={(e) => {
                e.stopPropagation();
                setIsCommentModalOpen(true);
              }}
              style={{
                padding: '0.25rem 0.55rem',
                fontSize: '0.78rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
              title="Open discussion & comments"
            >
              <MessageSquare size={13} color="var(--primary)" />
              <span>{idea.comments?.length || 0}</span>
            </button>

            {currentUser && currentUser.id === idea.author.id && (
              <button
                className="btn btn-secondary btn-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`Delete pitch "${idea.title}"?`)) {
                    deleteIdea(idea.id);
                  }
                }}
                title="Delete your pitch"
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  padding: 0,
                  color: 'var(--rose)',
                  borderColor: 'rgba(239, 68, 68, 0.3)',
                  background: 'rgba(239, 68, 68, 0.08)'
                }}
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        </div>
      </div>

      {isCommentModalOpen && (
        <QuickCommentModal 
          idea={idea} 
          onClose={() => setIsCommentModalOpen(false)} 
        />
      )}
    </>
  );
};
