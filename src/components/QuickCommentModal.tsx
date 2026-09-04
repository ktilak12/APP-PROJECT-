import React, { useState } from 'react';
import { Idea } from '../types';
import { useApp } from '../context/AppContext';
import { 
  X, 
  MessageSquare, 
  Send, 
  Heart, 
  Flame, 
  ShieldCheck, 
  Trash2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuickCommentModalProps {
  idea: Idea;
  onClose: () => void;
}

const GoogleLogoSvg = () => (
  <svg width="16" height="16" viewBox="0 0 48 48" style={{ minWidth: '16px' }}>
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

export const QuickCommentModal: React.FC<QuickCommentModalProps> = ({ idea, onClose }) => {
  const { 
    currentUser, 
    addCommentToIdea, 
    setAuthModalOpen, 
    setAuthModalMode,
    handleUpvote,
    deleteCommentFromIdea
  } = useApp();

  const [commentText, setCommentText] = useState('');
  const [likedCommentIds, setLikedCommentIds] = useState<string[]>([]);

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setAuthModalMode('choose');
      setAuthModalOpen(true);
      return;
    }

    if (!commentText.trim()) return;

    addCommentToIdea(idea.id, commentText.trim());
    setCommentText('');
    confetti({ particleCount: 30, spread: 45, origin: { y: 0.7 } });
  };

  const toggleCommentLike = (commentId: string) => {
    setLikedCommentIds(prev => 
      prev.includes(commentId) ? prev.filter(id => id !== commentId) : [...prev, commentId]
    );
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      style={{
        zIndex: 150,
        backdropFilter: 'blur(8px)',
        backgroundColor: 'rgba(0, 0, 0, 0.65)'
      }}
    >
      <div 
        className="modal-content" 
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '560px',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '85vh',
          padding: 0,
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          background: 'var(--grad-hero)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
              <span className="tag-badge" style={{ background: 'var(--bg-surface)', color: 'var(--primary)', fontSize: '0.72rem' }}>
                {idea.category}
              </span>
              <span className={`stage-pill ${idea.stage.replace(/\s+/g, '-')}`} style={{ fontSize: '0.72rem' }}>
                {idea.stage}
              </span>
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, lineHeight: 1.3, color: 'var(--text-main)' }}>
              {idea.title}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              <span>Pitched by <strong>{idea.author.name}</strong></span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <Flame size={12} color="#EF4444" />
                {idea.upvotes} Upvotes
              </span>
            </div>
          </div>

          <button 
            className="btn btn-secondary btn-icon"
            onClick={onClose}
            style={{ width: '32px', height: '32px', borderRadius: '50%' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Discussion Stream */}
        <div style={{
          padding: '1.25rem 1.5rem',
          overflowY: 'auto',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          minHeight: '220px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <MessageSquare size={14} color="var(--primary)" />
              <span>EXPLORE DISCUSSIONS ({idea.comments?.length || 0})</span>
            </span>

            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => handleUpvote(idea.id)}
              style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}
            >
              <Flame size={13} color={idea.userUpvoted ? '#EF4444' : 'currentColor'} />
              <span>{idea.userUpvoted ? 'Upvoted' : 'Upvote'}</span>
            </button>
          </div>

          {idea.comments && idea.comments.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {idea.comments.map(comment => {
                const isLiked = likedCommentIds.includes(comment.id);
                const isIdeaAuthor = comment.userId === idea.author.id;
                const isCommentAuthor = currentUser?.id === comment.userId;

                return (
                  <div 
                    key={comment.id}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-surface-elevated)',
                      border: isIdeaAuthor ? '1px solid rgba(37, 99, 235, 0.3)' : '1px solid var(--border-color)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                        <img 
                          src={comment.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80'} 
                          alt={comment.userName} 
                          style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.84rem' }}>{comment.userName}</span>
                            {isIdeaAuthor && (
                              <span style={{
                                fontSize: '0.62rem',
                                fontWeight: 800,
                                padding: '0.1rem 0.4rem',
                                borderRadius: 'var(--radius-full)',
                                background: 'rgba(37, 99, 235, 0.15)',
                                color: 'var(--primary)'
                              }}>
                                CREATOR
                              </span>
                            )}
                          </div>
                          <span style={{ fontSize: '0.68rem', color: 'var(--text-subtle)' }}>
                            {new Date(comment.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                          onClick={() => toggleCommentLike(comment.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            fontSize: '0.75rem',
                            color: isLiked ? '#EF4444' : 'var(--text-muted)',
                            padding: '0.2rem 0.4rem',
                            borderRadius: 'var(--radius-sm)'
                          }}
                          title="Like comment"
                        >
                          <Heart size={13} fill={isLiked ? '#EF4444' : 'none'} />
                          <span>{(comment.likes || 0) + (isLiked ? 1 : 0)}</span>
                        </button>
                        {isCommentAuthor && (
                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this comment?')) {
                                deleteCommentFromIdea(idea.id, comment.id);
                              }
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              color: 'var(--rose)',
                              padding: '0.2rem',
                              opacity: 0.7
                            }}
                            title="Delete comment"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>

                    <p style={{
                      fontSize: '0.88rem',
                      color: 'var(--text-main)',
                      lineHeight: 1.45,
                      margin: 0,
                      wordBreak: 'break-word'
                    }}>
                      {comment.content}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '2.5rem 1rem',
              color: 'var(--text-muted)',
              background: 'var(--bg-surface-elevated)',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--border-color)'
            }}>
              <MessageSquare size={32} style={{ color: 'var(--text-subtle)', marginBottom: '0.5rem', opacity: 0.6 }} />
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                No comments yet
              </div>
              <p style={{ fontSize: '0.8rem', maxWidth: '300px', marginInline: 'auto' }}>
                Be the first innovator to share constructive feedback or ask questions about this pitch!
              </p>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div style={{
          padding: '1rem 1.5rem 1.25rem 1.5rem',
          borderTop: '1px solid var(--border-color)',
          background: 'var(--bg-surface-elevated)'
        }}>
          {currentUser ? (
            <form onSubmit={handlePostComment} style={{ display: 'flex', gap: '0.6rem' }}>
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
              />
              <div style={{ flex: 1, display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="text"
                  className="input-field"
                  placeholder={`Comment as ${currentUser.name.split(' ')[0]}...`}
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  style={{ borderRadius: 'var(--radius-full)', paddingLeft: '1rem' }}
                  autoFocus
                />
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={!commentText.trim()}
                  style={{
                    borderRadius: 'var(--radius-full)',
                    padding: '0.55rem 1.15rem',
                    flexShrink: 0
                  }}
                >
                  <Send size={15} />
                  <span>Send</span>
                </button>
              </div>
            </form>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(37, 99, 235, 0.08)',
              border: '1px solid rgba(37, 99, 235, 0.25)',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldCheck size={16} color="var(--primary)" />
                <span>Sign in with Google to post comments and join discussions</span>
              </div>
              <button 
                onClick={() => {
                  setAuthModalMode('choose');
                  setAuthModalOpen(true);
                }}
                className="btn btn-primary btn-sm"
                style={{ borderRadius: 'var(--radius-full)', gap: '0.4rem', padding: '0.4rem 0.85rem' }}
              >
                <GoogleLogoSvg />
                <span>Sign In</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
