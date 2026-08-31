import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Category, IdeaStage, AIEvaluation } from '../types';
import { Sparkles, CheckCircle2, AlertTriangle, Lightbulb, Rocket, ArrowLeft } from 'lucide-react';

const categories: Category[] = [
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

const stages: IdeaStage[] = [
  'Idea',
  'Validation',
  'Team Formation',
  'Prototype',
  'MVP'
];

export const PitchStudio: React.FC = () => {
  const { addNewIdea, setActiveView, ideas } = useApp();

  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [category, setCategory] = useState<Category>('AI & ML');
  const [stage, setStage] = useState<IdeaStage>('Idea');
  const [tagsInput, setTagsInput] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [techInput, setTechInput] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');

  const calculateLiveAIScore = (): AIEvaluation => {
    const wordCount = (problem + ' ' + solution).split(/\s+/).filter(Boolean).length;
    
    let baseScore = 60;
    if (wordCount > 30) baseScore += 15;
    if (wordCount > 70) baseScore += 10;
    if (skillsInput.trim().length > 3) baseScore += 5;
    if (techInput.trim().length > 3) baseScore += 5;
    if (baseScore > 98) baseScore = 98;

    return {
      overallScore: Math.min(95, baseScore),
      problemClarity: Math.min(95, wordCount > 20 ? 85 : 60),
      innovationScore: Math.min(90, title.length > 5 ? 80 : 50),
      feasibilityScore: Math.min(92, techInput ? 88 : 70),
      marketPotential: 82,
      socialImpact: category === 'Environment' || category === 'Healthcare' ? 92 : 78,
      technicalDifficulty: 70,
      strengths: [
        title ? `Clear focus on ${category} domain.` : 'Well-defined domain scope.',
        problem.length > 30 ? 'High problem statement clarity.' : 'Initial problem formulation.',
        skillsInput ? 'Explicitly defined required team skills.' : 'Identified collaborator needs.'
      ],
      risks: [
        wordCount < 40 ? 'Add more detail to solution description for higher accuracy.' : 'Competitive saturation in early-stage market.',
        techInput ? 'Ensure cloud scalability for production loads.' : 'Specify exact backend framework.'
      ],
      suggestions: [
        'Include target audience metrics or market size estimate.',
        'Detail your validation milestone plan (e.g. 50 user surveys).'
      ]
    };
  };

  const findSimilarIdeas = () => {
    if (!title.trim() && !problem.trim()) return [];
    return ideas.filter(i => {
      const matchTitle = i.title.toLowerCase().includes(title.toLowerCase()) || title.toLowerCase().includes(i.title.toLowerCase());
      const matchCat = i.category === category;
      return matchTitle || (matchCat && title.length > 4 && i.title.toLowerCase().split(' ')[0] === title.toLowerCase().split(' ')[0]);
    }).slice(0, 2);
  };

  const aiEval = calculateLiveAIScore();
  const similarIdeas = findSimilarIdeas();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !problem.trim() || !solution.trim()) {
      alert('Please fill out Title, Problem Statement, and Solution.');
      return;
    }

    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const requiredSkills = skillsInput.split(',').map(s => s.trim()).filter(Boolean);
    const techStack = techInput.split(',').map(t => t.trim()).filter(Boolean);

    addNewIdea({
      title,
      tagline: tagline || problem.slice(0, 100) + '...',
      problem,
      solution,
      category,
      tags: tags.length ? tags : [category, 'Innovation'],
      stage,
      stageProgress: stage === 'Idea' ? 25 : stage === 'Validation' ? 50 : 75,
      requiredSkills: requiredSkills.length ? requiredSkills : ['Developer', 'UI/UX'],
      techStack: techStack.length ? techStack : ['React', 'Node.js'],
      aiEvaluation: aiEval,
      githubUrl: githubUrl || undefined,
      demoUrl: demoUrl || undefined
    });
  };

  return (
    <div className="app-container" style={{ padding: '2rem 1.5rem' }}>
      <button 
        className="btn btn-secondary btn-sm"
        onClick={() => setActiveView('explore')}
        style={{ marginBottom: '1.5rem' }}
      >
        <ArrowLeft size={16} />
        <span>Back to Feed</span>
      </button>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 380px',
        gap: '2rem',
        alignItems: 'start'
      }}>
        {/* Main Pitch Form */}
        <div className="glass-card" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.35rem' }}>
              Pitch Your <span className="gradient-text">Innovation</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Fill in your idea blueprint. Our AI Assistant will instantly analyze your proposal and check for existing market duplicates.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                Idea Title *
              </label>
              <input 
                type="text"
                className="input-field"
                placeholder="e.g. AquaSense: AI Water Quality Monitoring"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                Elevator Pitch / Tagline
              </label>
              <input 
                type="text"
                className="input-field"
                placeholder="e.g. IoT sensors + ML model for real-time drinking water safety"
                value={tagline}
                onChange={e => setTagline(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                  Domain Category *
                </label>
                <select 
                  className="input-field"
                  value={category}
                  onChange={e => setCategory(e.target.value as Category)}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                  Current Lifecycle Stage
                </label>
                <select 
                  className="input-field"
                  value={stage}
                  onChange={e => setStage(e.target.value as IdeaStage)}
                >
                  {stages.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                Problem Statement *
              </label>
              <textarea 
                className="input-field"
                rows={3}
                placeholder="What specific issue or friction point are you solving? Who is affected?"
                value={problem}
                onChange={e => setProblem(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                Proposed Solution & Architecture *
              </label>
              <textarea 
                className="input-field"
                rows={4}
                placeholder="How does your tech or product solve this problem? What makes it unique?"
                value={solution}
                onChange={e => setSolution(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                  Required Skills (comma separated)
                </label>
                <input 
                  type="text"
                  className="input-field font-mono"
                  placeholder="Python, React, UI/UX, Hardware"
                  value={skillsInput}
                  onChange={e => setSkillsInput(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                  Tech Stack (comma separated)
                </label>
                <input 
                  type="text"
                  className="input-field font-mono"
                  placeholder="FastAPI, PostgreSQL, PyTorch"
                  value={techInput}
                  onChange={e => setTechInput(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                  Tags (comma separated)
                </label>
                <input 
                  type="text"
                  className="input-field"
                  placeholder="AI, Cleantech, IoT"
                  value={tagsInput}
                  onChange={e => setTagsInput(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                  GitHub Repo URL (optional)
                </label>
                <input 
                  type="url"
                  className="input-field"
                  placeholder="https://github.com/..."
                  value={githubUrl}
                  onChange={e => setGithubUrl(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                  Demo / Prototype URL (optional)
                </label>
                <input 
                  type="url"
                  className="input-field"
                  placeholder="https://..."
                  value={demoUrl}
                  onChange={e => setDemoUrl(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              style={{
                marginTop: '1rem',
                padding: '0.85rem 1.5rem',
                fontSize: '1rem',
                width: '100%'
              }}
            >
              <Rocket size={18} />
              <span>Publish Pitch & Trigger AI Evaluation</span>
            </button>
          </form>
        </div>

        {/* Live AI Analysis Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div 
            className="glass-card" 
            style={{
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(124, 58, 237, 0.3)',
              background: 'linear-gradient(145deg, var(--bg-surface) 0%, rgba(124, 58, 237, 0.05) 100%)'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} color="var(--secondary)" />
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--secondary)' }}>
                  Live AI Evaluation
                </span>
              </div>
              <div style={{
                fontSize: '1.4rem',
                fontWeight: 800,
                color: 'var(--secondary)',
                fontFamily: 'var(--font-mono)'
              }}>
                {aiEval.overallScore}<span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/100</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', marginBottom: '1.2rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}>
                  <span>Problem Clarity</span>
                  <span>{aiEval.problemClarity}%</span>
                </div>
                <div style={{ height: '4px', background: 'var(--bg-surface-elevated)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${aiEval.problemClarity}%`, height: '100%', background: '#3B82F6' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}>
                  <span>Innovation Score</span>
                  <span>{aiEval.innovationScore}%</span>
                </div>
                <div style={{ height: '4px', background: 'var(--bg-surface-elevated)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${aiEval.innovationScore}%`, height: '100%', background: '#7C3AED' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}>
                  <span>Feasibility</span>
                  <span>{aiEval.feasibilityScore}%</span>
                </div>
                <div style={{ height: '4px', background: 'var(--bg-surface-elevated)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${aiEval.feasibilityScore}%`, height: '100%', background: '#10B981' }} />
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>AI Strengths Identified:</div>
              {aiEval.strengths.map((str, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.4rem', color: 'var(--emerald)' }}>
                  <CheckCircle2 size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{str}</span>
                </div>
              ))}
            </div>
          </div>

          <div 
            className="glass-card" 
            style={{
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 700,
              fontSize: '0.9rem',
              marginBottom: '0.75rem'
            }}>
              <Lightbulb size={16} color="var(--amber)" />
              <span>Semantic Similarity Check</span>
            </div>

            {similarIdeas.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--amber)', display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                  <AlertTriangle size={13} />
                  <span>Similar existing ideas detected in market database:</span>
                </div>
                {similarIdeas.map(item => (
                  <div 
                    key={item.id} 
                    style={{
                      padding: '0.6rem 0.8rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.8rem'
                    }}
                  >
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{item.title}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Category: {item.category} • Stage: {item.stage}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                No direct duplicate ideas detected. Your pitch appears unique in the current database!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
