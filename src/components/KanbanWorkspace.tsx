import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { KanbanTask } from '../types';
import { Kanban, Plus, ArrowRight, ArrowLeft, CheckCircle, Clock, AlertCircle, Trash2, CheckCircle2 } from 'lucide-react';

export const KanbanWorkspace: React.FC = () => {
  const { ideas, updateTaskStatus, addKanbanTask, deleteKanbanTask, currentUser } = useApp();
  
  const workspaceIdeas = ideas.filter(i => i.tasks && i.tasks.length > 0) || ideas;
  const [selectedIdeaId, setSelectedIdeaId] = useState<string>(workspaceIdeas[0]?.id || ideas[0]?.id || '');

  const currentIdea = ideas.find(i => i.id === selectedIdeaId) || ideas[0];

  const [showAddTask, setShowAddTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [assignee, setAssignee] = useState(currentUser ? currentUser.name : 'Project Lead');
  const [priority, setPriority] = useState<KanbanTask['priority']>('medium');

  if (!currentIdea) return null;

  const totalTasks = currentIdea.tasks?.length || 0;
  const todoTasks = currentIdea.tasks?.filter(t => t.status === 'todo') || [];
  const inProgressTasks = currentIdea.tasks?.filter(t => t.status === 'in_progress') || [];
  const doneTasks = currentIdea.tasks?.filter(t => t.status === 'done') || [];
  const completionPercentage = totalTasks > 0 ? Math.round((doneTasks.length / totalTasks) * 100) : 0;

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    addKanbanTask(currentIdea.id, taskTitle.trim(), taskDesc.trim(), assignee, priority);
    setTaskTitle('');
    setTaskDesc('');
    setShowAddTask(false);
  };

  const getPriorityBadge = (p: KanbanTask['priority']) => {
    if (p === 'high') return <span className="tag-badge" style={{ background: 'rgba(239, 68, 68, 0.12)', color: '#EF4444', fontSize: '0.7rem' }}>High Priority</span>;
    if (p === 'medium') return <span className="tag-badge" style={{ background: 'var(--amber-bg)', color: '#D97706', fontSize: '0.7rem' }}>Medium Priority</span>;
    return <span className="tag-badge" style={{ background: 'var(--emerald-bg)', color: '#10B981', fontSize: '0.7rem' }}>Low Priority</span>;
  };

  return (
    <div className="app-container" style={{ padding: '2rem 1.5rem' }}>
      {/* Workspace Header */}
      <div 
        className="glass-card" 
        style={{
          padding: '2rem',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '2rem',
          background: 'var(--grad-hero)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem'
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-full)', background: 'var(--bg-surface)', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            <Kanban size={15} />
            <span>PROJECT EXECUTION WORKSPACE</span>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            {currentIdea.title} <span className="gradient-text">Sprint Board</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Lifecycle Stage: <strong>{currentIdea.stage}</strong> • Team Size: <strong>{currentIdea.team?.length || 1} members</strong>
          </p>

          {/* Sprint Progress Gauge */}
          <div style={{ marginTop: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '180px', height: '8px', background: 'var(--bg-surface-elevated)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${completionPercentage}%`, height: '100%', background: 'var(--emerald)', transition: 'width 0.3s ease' }} />
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--emerald)', fontFamily: 'var(--font-mono)' }}>
              {completionPercentage}% Tasks Completed ({doneTasks.length}/{totalTasks})
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem', display: 'block' }}>Select Project Workspace:</label>
            <select 
              className="input-field" 
              value={selectedIdeaId}
              onChange={e => setSelectedIdeaId(e.target.value)}
              style={{ minWidth: '240px' }}
            >
              {ideas.map(i => (
                <option key={i.id} value={i.id}>{i.title} ({i.stage})</option>
              ))}
            </select>
          </div>

          <button className="btn btn-primary" onClick={() => setShowAddTask(true)} style={{ alignSelf: 'flex-end' }}>
            <Plus size={18} />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* 3 Column Kanban Board */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
        {/* TODO Column */}
        <div className="glass-card" style={{ padding: '1.25rem', borderRadius: 'var(--radius-lg)', background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
              <Clock size={16} color="var(--text-muted)" />
              <span>TODO / SPRINT BACKLOG</span>
            </div>
            <span className="tag-badge font-mono">{todoTasks.length}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {todoTasks.map(t => (
              <div key={t.id} style={{ border: '1px solid var(--border-color)', padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  {getPriorityBadge(t.priority)}
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>{t.createdAt}</span>
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.35rem' }}>{t.title}</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>{t.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-subtle)' }}>👤 {t.assignee || 'Unassigned'}</span>
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button 
                      onClick={() => deleteKanbanTask(currentIdea.id, t.id)}
                      title="Delete Task"
                      style={{ background: 'none', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer', padding: '4px' }}
                    >
                      <Trash2 size={13} />
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={() => updateTaskStatus(currentIdea.id, t.id, 'in_progress')}>
                      <span>Start</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {todoTasks.length === 0 && <div style={{ fontSize: '0.82rem', color: 'var(--text-subtle)', textAlign: 'center', padding: '1.5rem' }}>No pending tasks in backlog</div>}
          </div>
        </div>

        {/* IN PROGRESS Column */}
        <div className="glass-card" style={{ padding: '1.25rem', borderRadius: 'var(--radius-lg)', background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid var(--primary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--primary)' }}>
              <AlertCircle size={16} />
              <span>IN PROGRESS</span>
            </div>
            <span className="tag-badge font-mono" style={{ background: 'var(--primary-glow)', color: 'var(--primary)' }}>{inProgressTasks.length}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {inProgressTasks.map(t => (
              <div key={t.id} style={{ border: '1px solid var(--primary)', padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  {getPriorityBadge(t.priority)}
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>{t.createdAt}</span>
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.35rem' }}>{t.title}</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>{t.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => updateTaskStatus(currentIdea.id, t.id, 'todo')}>
                    <ArrowLeft size={12} />
                    <span>Back</span>
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={() => updateTaskStatus(currentIdea.id, t.id, 'done')}>
                    <span>Complete</span>
                    <CheckCircle size={12} />
                  </button>
                </div>
              </div>
            ))}
            {inProgressTasks.length === 0 && <div style={{ fontSize: '0.82rem', color: 'var(--text-subtle)', textAlign: 'center', padding: '1.5rem' }}>No active tasks underway</div>}
          </div>
        </div>

        {/* DONE Column */}
        <div className="glass-card" style={{ padding: '1.25rem', borderRadius: 'var(--radius-lg)', background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid var(--emerald)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--emerald)' }}>
              <CheckCircle2 size={16} />
              <span>COMPLETED</span>
            </div>
            <span className="tag-badge font-mono" style={{ background: 'var(--emerald-bg)', color: 'var(--emerald)' }}>{doneTasks.length}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {doneTasks.map(t => (
              <div key={t.id} style={{ border: '1px solid var(--border-color)', padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)', opacity: 0.9 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  {getPriorityBadge(t.priority)}
                  <span style={{ fontSize: '0.7rem', color: 'var(--emerald)', fontWeight: 700 }}>✓ Done</span>
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, textDecoration: 'line-through', marginBottom: '0.35rem' }}>{t.title}</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{t.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>👤 {t.assignee || 'Assigned'}</span>
                  <button 
                    onClick={() => deleteKanbanTask(currentIdea.id, t.id)}
                    title="Delete Completed Task"
                    style={{ background: 'none', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer', padding: '4px' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
            {doneTasks.length === 0 && <div style={{ fontSize: '0.82rem', color: 'var(--text-subtle)', textAlign: 'center', padding: '1.5rem' }}>No completed tasks yet</div>}
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="modal-overlay" style={{ zIndex: 120 }}>
          <div className="modal-content" style={{ maxWidth: '480px', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>
              Add New Kanban Task for {currentIdea.title}
            </h3>
            <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem', display: 'block' }}>Task Title *</label>
                <input type="text" className="input-field" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} required placeholder="e.g. Train YOLOv10 Model, Setup AWS Lambda" />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem', display: 'block' }}>Description & Scope</label>
                <textarea className="input-field" rows={2} value={taskDesc} onChange={e => setTaskDesc(e.target.value)} placeholder="Milestone details..." />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem', display: 'block' }}>Assignee</label>
                  <input type="text" className="input-field" value={assignee} onChange={e => setAssignee(e.target.value)} placeholder="e.g. Abhi Kumar" />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem', display: 'block' }}>Priority Level</label>
                  <select className="input-field" value={priority} onChange={e => setPriority(e.target.value as any)}>
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddTask(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Create Sprint Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
