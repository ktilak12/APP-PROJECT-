import React from 'react';
import { useApp } from '../context/AppContext';
import { BarChart3, Eye, Flame, Users, Sparkles, TrendingUp, Award, Layers } from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const { ideas } = useApp();

  const totalViews = ideas.reduce((acc, curr) => acc + curr.views, 0);
  const totalUpvotes = ideas.reduce((acc, curr) => acc + curr.upvotes, 0);
  const totalComments = ideas.reduce((acc, curr) => acc + (curr.comments?.length || 0), 0);
  const avgAIScore = Math.round(
    ideas.reduce((acc, curr) => acc + (curr.aiEvaluation?.overallScore || 80), 0) / (ideas.length || 1)
  );

  return (
    <div className="app-container" style={{ padding: '2rem 1.5rem' }}>
      {/* Header Banner */}
      <div 
        className="glass-card" 
        style={{
          padding: '2rem',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '2rem',
          background: 'var(--grad-hero)'
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-full)', background: 'var(--bg-surface)', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          <BarChart3 size={15} />
          <span>PLATFORM PERFORMANCE ANALYTICS</span>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Platform <span className="gradient-text">Metrics & Growth</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Real-time telemetry tracking idea pitches, community engagement velocity, AI scoring distribution, and idea-to-execution conversion rates.
        </p>
      </div>

      {/* 4 Stat Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700 }}>Total Pitch Views</span>
            <Eye size={20} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'var(--font-mono)' }}>
            {totalViews.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--emerald)', display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.35rem' }}>
            <TrendingUp size={12} />
            <span>+18.4% this week</span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700 }}>Total Upvotes</span>
            <Flame size={20} color="#EF4444" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'var(--font-mono)' }}>
            {totalUpvotes.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--emerald)', display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.35rem' }}>
            <TrendingUp size={12} />
            <span>+12.6% community velocity</span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700 }}>Avg AI Score</span>
            <Sparkles size={20} color="var(--secondary)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--secondary)' }}>
            {avgAIScore}/100
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            Across all domain pitches
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700 }}>Total Discussions</span>
            <Users size={20} color="var(--amber)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'var(--font-mono)' }}>
            {totalComments}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--emerald)', display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.35rem' }}>
            <TrendingUp size={12} />
            <span>Active feedback threads</span>
          </div>
        </div>
      </div>

      {/* Analytics Breakdown Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Stage Conversion Funnel */}
        <div className="glass-card" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={18} color="var(--primary)" />
            <span>Idea-to-Execution Conversion Funnel</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                <span>💡 Idea Formulation</span>
                <span>100% (4 Pitches)</span>
              </div>
              <div style={{ height: '10px', background: 'var(--bg-surface-elevated)', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '100%', background: '#3B82F6' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                <span>🔍 Market Validation</span>
                <span>75% (3 Pitches)</span>
              </div>
              <div style={{ height: '10px', background: 'var(--bg-surface-elevated)', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: '75%', height: '100%', background: '#F59E0B' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                <span>⚙️ Prototype Development</span>
                <span>50% (2 Pitches)</span>
              </div>
              <div style={{ height: '10px', background: 'var(--bg-surface-elevated)', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: '50%', height: '100%', background: '#0EA5E9' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                <span>🚀 MVP / Production Launch</span>
                <span>25% (1 Pitch)</span>
              </div>
              <div style={{ height: '10px', background: 'var(--bg-surface-elevated)', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: '25%', height: '100%', background: '#10B981' }} />
              </div>
            </div>
          </div>
        </div>

        {/* AI Score Quality Distribution */}
        <div className="glass-card" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} color="var(--secondary)" />
            <span>AI Quality Breakdown by Category</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {ideas.map(item => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{item.title}</div>
                  <span className="tag-badge" style={{ fontSize: '0.68rem', marginTop: '2px' }}>{item.category}</span>
                </div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--secondary)', fontFamily: 'var(--font-mono)' }}>
                  {item.aiEvaluation?.overallScore || 80}/100
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
