import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { IdeaCard } from './IdeaCard';
import { Category, IdeaStage } from '../types';
import { Sparkles, PlusCircle, ArrowUpDown, Layers, Users } from 'lucide-react';

const categories: (Category | 'All')[] = [
  'All',
  'AI & ML',
  'Environment',
  'Healthcare',
  'Education',
  'FinTech',
  'SaaS',
  'Agriculture',
  'Cybersecurity',
  'Energy',
  'Smart Cities'
];

const stages: (IdeaStage | 'All')[] = [
  'All',
  'Idea',
  'Validation',
  'Team Formation',
  'Prototype',
  'MVP',
  'Beta',
  'Launched'
];

export const IdeaFeed: React.FC = () => {
  const { 
    ideas, 
    searchQuery, 
    selectedCategory, 
    setSelectedCategory, 
    selectedStage, 
    setSelectedStage,
    setActiveView
  } = useApp();

  const [sortBy, setSortBy] = useState<'trending' | 'voted' | 'ai' | 'recent'>('trending');

  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = 
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.problem.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      idea.requiredSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || idea.category === selectedCategory;
    const matchesStage = selectedStage === 'All' || idea.stage === selectedStage;

    return matchesSearch && matchesCategory && matchesStage;
  });

  const sortedIdeas = [...filteredIdeas].sort((a, b) => {
    if (sortBy === 'voted') return b.upvotes - a.upvotes;
    if (sortBy === 'ai') return (b.aiEvaluation?.overallScore || 0) - (a.aiEvaluation?.overallScore || 0);
    if (sortBy === 'recent') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    const scoreA = a.upvotes * 2 + a.interestsCount * 1.5 + (a.comments?.length || 0) * 3;
    const scoreB = b.upvotes * 2 + b.interestsCount * 1.5 + (b.comments?.length || 0) * 3;
    return scoreB - scoreA;
  });

  return (
    <div className="app-container" style={{ padding: '2rem 1.5rem' }}>
      {/* Hero Section Banner */}
      <div 
        className="glass-card" 
        style={{
          padding: '2.5rem 2rem',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '2rem',
          background: 'var(--grad-hero)',
          border: '1px solid rgba(37, 99, 235, 0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ maxWidth: '720px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.3rem 0.8rem',
            borderRadius: 'var(--radius-full)',
            background: 'var(--bg-surface)',
            color: 'var(--primary)',
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: '1rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Sparkles size={14} />
            <span>AI-POWERED INNOVATION HUB</span>
          </div>

          <h1 style={{
            fontSize: '2.4rem',
            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: '-0.03em',
            marginBottom: '0.8rem'
          }}>
            Turn Ideas Into Impact. <br />
            <span className="gradient-text">Pitch, Validate, Find Team & Build.</span>
          </h1>

          <p style={{
            fontSize: '1.05rem',
            color: 'var(--text-muted)',
            marginBottom: '1.5rem',
            lineHeight: 1.5
          }}>
            A platform for entrepreneurs, developers, and students to present early-stage projects, receive structured feedback, match with collaborators, and execute.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-primary"
              onClick={() => setActiveView('pitch')}
              style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}
            >
              <PlusCircle size={18} />
              <span>Pitch Your Idea</span>
            </button>

            <button 
              className="btn btn-secondary"
              onClick={() => setActiveView('matchmaker')}
              style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}
            >
              <Users size={18} />
              <span>AI Collaborator Matchmaker</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem'
        }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: 600,
                border: selectedCategory === cat ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                background: selectedCategory === cat ? 'var(--grad-brand)' : 'var(--bg-surface)',
                color: selectedCategory === cat ? '#FFFFFF' : 'var(--text-main)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                boxShadow: selectedCategory === cat ? '0 4px 12px var(--primary-glow)' : 'none'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Stage Filter & Sorting Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginRight: '0.25rem' }}>
            Lifecycle Stage:
          </span>
          {stages.map(st => (
            <button
              key={st}
              onClick={() => setSelectedStage(st)}
              style={{
                padding: '0.25rem 0.65rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.78rem',
                fontWeight: 600,
                border: '1px solid',
                borderColor: selectedStage === st ? 'var(--primary)' : 'var(--border-color)',
                background: selectedStage === st ? 'rgba(37, 99, 235, 0.12)' : 'var(--bg-surface)',
                color: selectedStage === st ? 'var(--primary)' : 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              {st}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowUpDown size={15} style={{ color: 'var(--text-muted)' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="input-field"
            style={{ width: '170px', height: '36px', padding: '0.2rem 0.6rem', fontSize: '0.85rem' }}
          >
            <option value="trending">🔥 Trending</option>
            <option value="voted">⭐ Most Voted</option>
            <option value="ai">🤖 AI Score</option>
            <option value="recent">⏱️ Recently Created</option>
          </select>
        </div>
      </div>

      {/* Idea Grid */}
      {sortedIdeas.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '1.5rem'
        }}>
          {sortedIdeas.map(idea => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      ) : (
        <div 
          className="glass-card" 
          style={{
            padding: '3rem',
            textAlign: 'center',
            borderRadius: 'var(--radius-lg)'
          }}
        >
          <Layers size={48} style={{ color: 'var(--text-subtle)', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No ideas found matching your criteria</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Try resetting your category or stage filters, or be the first to pitch an idea in this domain!
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => {
              setSelectedCategory('All');
              setSelectedStage('All');
            }}
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
