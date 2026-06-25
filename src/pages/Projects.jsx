import { useState } from 'react';
import { useStore } from '../data/store';
import { PLATFORMS } from '../data/constants';
import { PlatformIcon } from '../components/PlatformBadge';
import { useToast } from '../components/Toast';
import EmptyState from '../components/EmptyState';
import { sound } from '../lib/soundEngine';

function generateTaskId() {
  return 't-' + Math.random().toString(36).slice(2, 10);
}

function generateSubtaskId() {
  return 's-' + Math.random().toString(36).slice(2, 6);
}

const LANES = [
  { id: 'backlog', name: 'Backlog / Ideas', emoji: '⚪', color: 'var(--muted)' },
  { id: 'todo', name: 'To Do / Prompting', emoji: '🟡', color: 'var(--gold)' },
  { id: 'progress', name: 'In Development', emoji: '🔵', color: 'var(--blue)' },
  { id: 'done', name: 'Done & Deployed', emoji: '🟢', color: 'var(--teal)' },
];

const MILESTONES = [
  { id: 'alpha', label: 'Alpha Launch', desc: 'Core Engine & APIs', phase: 'Phase 1', icon: '🤖' },
  { id: 'beta', label: 'Beta Sandbox', desc: 'Multi-platform Sync', phase: 'Phase 2', icon: '🧪' },
  { id: 'audit', label: 'Auth Audit', desc: 'Credentials Checkup', phase: 'Phase 3', icon: '🔒' },
  { id: 'prod', label: 'Production Dispatch', desc: 'Live Scale-out', phase: 'Phase 4', icon: '🚀' },
];

const getMilestoneStatus = (index, progress) => {
  const threshold = (index + 1) * 25;
  if (progress >= threshold) return 'done';
  if (progress >= threshold - 25) return 'active';
  return 'pending';
};

const getTaskSubtasks = (task) => {
  if (task.subtasks && task.subtasks.length > 0) return task.subtasks;
  return [
    { id: 's1', title: 'System Handshake & Auth Validation', done: task.status === 'done' },
    { id: 's2', title: 'API Handlers & Webhook Receivers', done: task.status === 'done' || task.status === 'progress' },
    { id: 's3', title: 'Sandbox Execution Tests', done: task.status === 'done' }
  ];
};

export default function Projects({ onNav }) {
  const { projects, accounts, addProject, updateProject, deleteProject } = useStore();
  const toast = useToast();

  // Active Project ID (null means all projects dashboard view)
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [projectLayoutMode, setProjectLayoutMode] = useState('kanban'); // 'kanban' | 'gantt'

  // Project Modals state
  const [showProjModal, setShowProjModal] = useState(false);
  const [editProjId, setEditProjId] = useState(null);
  const [projForm, setProjForm] = useState({ name: '', desc: '', accountIds: [] });

  // Task Modals state
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [taskForm, setTaskForm] = useState({
    title: '',
    desc: '',
    accountId: '',
    priority: 'medium',
    status: 'todo',
    dueDate: '',
    subtasks: []
  });

  // --- Project actions ---
  const openAddProject = () => {
    setEditProjId(null);
    setProjForm({ name: '', desc: '', accountIds: [] });
    setShowProjModal(true);
  };

  const openEditProject = (p) => {
    setEditProjId(p.id);
    setProjForm({ name: p.name, desc: p.desc || '', accountIds: p.accountIds || [] });
    setShowProjModal(true);
  };

  const handleSaveProject = () => {
    if (!projForm.name.trim()) {
      toast.error('Project name is required');
      return;
    }
    if (editProjId) {
      updateProject(editProjId, projForm);
      toast.success('Project updated successfully');
      sound.play('success');
    } else {
      addProject({
        ...projForm,
        tasks: []
      });
      toast.bolt('New Project initialized!');
      sound.play('success');
    }
    setShowProjModal(false);
  };

  const handleDeleteProject = (id) => {
    if (window.confirm('Are you sure you want to delete this project and all its tasks?')) {
      deleteProject(id);
      if (activeProjectId === id) {
        setActiveProjectId(null);
      }
      toast.success('Project deleted');
    }
  };

  const toggleProjectStatus = (p) => {
    updateProject(p.id, { status: p.status === 'active' ? 'paused' : 'active' });
    toast.info(`Project ${p.status === 'active' ? 'paused' : 'resumed'}`);
  };

  const toggleAccountInProjForm = (accId) => {
    setProjForm(f => ({
      ...f,
      accountIds: f.accountIds.includes(accId)
        ? f.accountIds.filter(x => x !== accId)
        : [...f.accountIds, accId]
    }));
  };

  // --- Task actions (Kanban) ---
  const activeProject = projects.find(p => p.id === activeProjectId);
  const activeProjTasks = activeProject?.tasks || [];

  const openAddTask = (laneId = 'todo') => {
    setEditTaskId(null);
    // Pre-populate with first account linked to project, if any
    const firstAccId = activeProject?.accountIds?.[0] || '';
    setTaskForm({
      title: '',
      desc: '',
      accountId: firstAccId,
      priority: 'medium',
      status: laneId,
      dueDate: new Date().toISOString().split('T')[0],
      subtasks: [
        { id: 's1', title: 'System Handshake & Auth Validation', done: false },
        { id: 's2', title: 'API Handlers & Webhook Receivers', done: false },
        { id: 's3', title: 'Sandbox Execution Tests', done: false }
      ]
    });
    setShowTaskModal(true);
  };

  const openEditTask = (t) => {
    setEditTaskId(t.id);
    setTaskForm({
      title: t.title,
      desc: t.desc || '',
      accountId: t.accountId || '',
      priority: t.priority || 'medium',
      status: t.status || 'todo',
      dueDate: t.dueDate || '',
      subtasks: getTaskSubtasks(t)
    });
    setShowTaskModal(true);
  };

  const handleSaveTask = () => {
    if (!taskForm.title.trim()) {
      toast.error('Task title is required');
      return;
    }

    let updatedTasks = [...activeProjTasks];
    if (editTaskId) {
      // Edit
      updatedTasks = updatedTasks.map(t => t.id === editTaskId ? { ...t, ...taskForm } : t);
      toast.success('Task updated');
      sound.play('success');
    } else {
      // Create new
      const newTask = {
        ...taskForm,
        status: taskForm.status || 'todo',
        id: generateTaskId(),
        createdAt: new Date().toISOString()
      };
      updatedTasks.push(newTask);
      toast.bolt('Task added to Kanban Board!');
      sound.play('success');
    }

    updateProject(activeProjectId, { tasks: updatedTasks });
    setShowTaskModal(false);
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Delete this task?')) {
      const updatedTasks = activeProjTasks.filter(t => t.id !== taskId);
      updateProject(activeProjectId, { tasks: updatedTasks });
      toast.success('Task removed');
    }
  };

  const shiftTaskLane = (taskId, direction) => {
    const task = activeProjTasks.find(t => t.id === taskId);
    if (!task) return;

    const currentLaneIdx = LANES.findIndex(l => l.id === task.status);
    let nextLaneIdx = currentLaneIdx + direction;
    nextLaneIdx = Math.max(0, Math.min(LANES.length - 1, nextLaneIdx));

    if (currentLaneIdx === nextLaneIdx) return;

    const updatedTasks = activeProjTasks.map(t =>
      t.id === taskId ? { ...t, status: LANES[nextLaneIdx].id } : t
    );

    updateProject(activeProjectId, { tasks: updatedTasks });
    toast.success(`Task shifted to ${LANES[nextLaneIdx].name}`);
    sound.play('click');
  };

  const handleToggleSubtask = (task, subtaskId) => {
    const currentSubtasks = getTaskSubtasks(task);
    const updatedSubtasks = currentSubtasks.map(sub =>
      sub.id === subtaskId ? { ...sub, done: !sub.done } : sub
    );

    const updatedTasks = activeProjTasks.map(tk => {
      if (tk.id === task.id) {
        return { ...tk, subtasks: updatedSubtasks };
      }
      return tk;
    });

    updateProject(activeProjectId, { tasks: updatedTasks });
    toast.success('Task subtask state synchronized!');
    sound.play('success');
  };

  const shiftTaskDueDate = (taskId, offsetDays) => {
    const task = activeProjTasks.find(t => t.id === taskId);
    if (!task) return;
    const current = task.dueDate ? new Date(task.dueDate) : new Date();
    current.setDate(current.getDate() + offsetDays);
    const updatedTasks = activeProjTasks.map(t =>
      t.id === taskId ? { ...t, dueDate: current.toISOString().split('T')[0] } : t
    );
    updateProject(activeProjectId, { tasks: updatedTasks });
    toast.success(`Task rescheduled to ${current.toLocaleDateString()}`);
  };


  // Render Empty State if no projects exist
  if (!projects.length) {
    return (
      <EmptyState
        icon="📁"
        title="No projects configured"
        subtitle="Organise your developer workspaces, coordinate multiple AI platform accounts, and manage task flows."
      >
        <button className="btn btn-gold" onClick={openAddProject}>
          + Create New Project
        </button>
      </EmptyState>
    );
  }

  // --- RENDERING DEDICATED KANBAN BOARD WORKSPACE ---
  if (activeProjectId && activeProject) {
    const linkedAccounts = accounts.filter(a => activeProject.accountIds?.includes(a.id));
    const totalTasks = activeProjTasks.length;
    const completedTasks = activeProjTasks.filter(t => t.status === 'done').length;
    const projectProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return (
      <>
        {/* Workspace Topbar Header */}
        <div className="view-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="back-btn" onClick={() => { sound.play('click'); setActiveProjectId(null); }} title="Back to all projects">
              ←
            </button>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="sec-lbl" style={{ fontSize: 18, color: '#fff', fontWeight: 800 }}>
                  📁 {activeProject.name}
                </span>
                <span className={`badge ${activeProject.status === 'active' ? 'badge-ok' : 'badge-off'}`}>
                  {activeProject.status === 'active' ? '● Active' : '○ Paused'}
                </span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                {activeProject.desc || 'No workspace description provided'}
              </div>
            </div>

            {/* View switcher & Quick action buttons */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div className="pills" style={{ padding: 2, background: 'var(--surface2)', borderRadius: 8, border: '1px solid var(--border)', display: 'flex' }}>
                <button
                  className={`pill ${projectLayoutMode === 'kanban' ? 'active' : ''}`}
                  onClick={() => {
                    sound.play('click');
                    setProjectLayoutMode('kanban');
                  }}
                  style={{ fontSize: 10, padding: '4px 10px', minWidth: 70, justifyContent: 'center' }}
                >
                  📋 Kanban
                </button>
                <button
                  className={`pill ${projectLayoutMode === 'gantt' ? 'active' : ''}`}
                  onClick={() => {
                    sound.play('click');
                    setProjectLayoutMode('gantt');
                  }}
                  style={{ fontSize: 10, padding: '4px 10px', minWidth: 80, justifyContent: 'center' }}
                >
                  📅 Gantt Grid
                </button>
              </div>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  if (activeProjTasks.length === 0) {
                    toast.error('No tasks available on this board to export.');
                    return;
                  }

                  // Construct CSV
                  let csvContent = "Project Name,Task Title,Task Description,Lane,Priority,Assigned Account,Subtask List\n";
                  activeProjTasks.forEach(t => {
                    const assignedAcc = accounts?.find(a => a.id === t.accountId);
                    const assignedEmail = assignedAcc ? assignedAcc.email : '';
                    const subtasksStr = (t.subtasks || []).map(s => s.title.replace(/;/g, '\\;')).join(';');

                    csvContent += `"${activeProject.name.replace(/"/g, '""')}",` +
                                  `"${t.title.replace(/"/g, '""')}",` +
                                  `"${(t.desc || '').replace(/"/g, '""')}",` +
                                  `"${t.status}",` +
                                  `"${t.priority}",` +
                                  `"${assignedEmail}",` +
                                  `"${subtasksStr.replace(/"/g, '""')}"\n`;
                  });

                  // Download CSV trigger
                  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `bolt-studio-project-${activeProject.name.toLowerCase().replace(/\s+/g, '-')}.csv`;
                  a.click();
                  URL.revokeObjectURL(url);
                  toast.bolt("✓ Board exported successfully to CSV!");
                }}
                title="Export this board to CSV file"
              >
                📥 Export CSV
              </button>
              <button
                className="btn btn-teal btn-sm"
                onClick={() => {
                  // Redirection to Broadcast page helper
                  onNav('broadcast');
                  toast.bolt(`Loaded ${linkedAccounts.length} project accounts into Broadcast Studio!`);
                }}
                disabled={linkedAccounts.length === 0}
              >
                📡 Project Broadcast
              </button>
              <button className="btn btn-gold btn-sm" onClick={() => openAddTask('todo')}>
                + Create Task
              </button>
            </div>
          </div>

          {/* Project progress banner row */}
          <div style={{ background: 'var(--surface2)', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border)', display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap', marginTop: 6 }}>
            {/* Linked platforms */}
            <div>
              <div style={{ fontSize: 10, color: 'var(--muted2)', textTransform: 'uppercase', fontWeight: 700 }}>Linked Platform Accounts</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                {linkedAccounts.map(a => (
                  <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--surface3)', padding: '3px 8px', borderRadius: 6, border: '1px solid var(--border)' }}>
                    <PlatformIcon platformId={a.platform} size={16} />
                    <span style={{ fontSize: 11, color: '#e2e2ec' }}>{a.name}</span>
                  </div>
                ))}
                {linkedAccounts.length === 0 && (
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>No accounts linked</span>
                )}
              </div>
            </div>

            {/* Stats Counter */}
            <div style={{ minWidth: 100 }}>
              <div style={{ fontSize: 10, color: 'var(--muted2)', textTransform: 'uppercase', fontWeight: 700 }}>Task Completion</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', marginTop: 4 }}>
                {completedTasks}/{totalTasks} completed <span style={{ color: 'var(--teal)' }}>({projectProgress}%)</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div style={{ flex: 1, minWidth: 140 }}>
              <div className="proj-stat-bar" style={{ marginTop: 14 }}>
                <div className="proj-progress-fill" style={{ width: `${projectProgress}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Flowing Roadmap Timeline */}
        <div className="road-timeline">
          {MILESTONES.map((ms, msIdx) => {
            const status = getMilestoneStatus(msIdx, projectProgress);
            const statusColor = status === 'done' ? 'var(--teal)' : status === 'active' ? 'var(--gold)' : 'var(--muted)';
            const borderStyle = status === 'done' ? '1px solid var(--teal)' : status === 'active' ? '1px solid var(--gold)' : '1px solid var(--border)';
            return (
              <div
                key={ms.label}
                className="road-milestone"
                style={{
                  border: borderStyle,
                  boxShadow: status === 'active' ? '0 0 8px var(--gold-glow)' : 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 10, color: statusColor, fontWeight: 700, textTransform: 'uppercase' }}>
                    {ms.phase}
                  </span>
                  <span style={{ fontSize: 11 }}>{ms.icon}</span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>{ms.label}</div>
                <div style={{ fontSize: 9.5, color: 'var(--muted2)' }}>{ms.desc}</div>
                <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor, display: 'inline-block' }} />
                  <span style={{ fontSize: 8.5, color: statusColor, textTransform: 'capitalize', fontWeight: 700 }}>
                    {status === 'done' ? 'Completed' : status === 'active' ? 'In Progress' : 'Pending'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* TOGGLEABLE WORKSPACE BOARDS */}
        {projectLayoutMode === 'kanban' ? (
          <div className="kanban-board">
            {LANES.map(lane => {
              const laneTasks = activeProjTasks.filter(t => t.status === lane.id);
              return (
                <div key={lane.id} className="kanban-col">
                  <div className="kanban-header">
                    <div className="kanban-title">
                      <span>{lane.emoji}</span>
                      <span>{lane.name}</span>
                    </div>
                    <span className="kanban-col-count">{laneTasks.length}</span>
                  </div>

                  <div className="kanban-tasks">
                    {laneTasks.map(t => {
                      const taskAccount = accounts.find(a => a.id === t.accountId);
                      const platConfig = PLATFORMS.find(p => p.id === taskAccount?.platform);
                      const currentSub = getTaskSubtasks(t);
                      const completedSub = currentSub.filter(s => s.done).length;
                      const totalSub = currentSub.length;
                      const subPercent = totalSub > 0 ? Math.round((completedSub / totalSub) * 100) : 0;

                      return (
                        <div
                          key={t.id}
                          className="task-card"
                          style={{
                            borderTop: platConfig ? `3px solid ${platConfig.color}` : '1px solid var(--border)'
                          }}
                        >
                          {/* Task Title / Details */}
                          <div className="task-header">
                            <span className="task-title">{t.title}</span>

                            {/* Shift actions on Hover */}
                            <div className="task-actions">
                              <button
                                className="task-btn"
                                onClick={() => shiftTaskLane(t.id, -1)}
                                disabled={lane.id === 'backlog'}
                                title="Shift Left"
                              >
                                ◀
                              </button>
                              <button
                                className="task-btn"
                                onClick={() => openEditTask(t)}
                                title="Edit Task"
                              >
                                ✏
                              </button>
                              <button
                                className="task-btn"
                                onClick={() => shiftTaskLane(t.id, 1)}
                                disabled={lane.id === 'done'}
                                title="Shift Right"
                              >
                                ▶
                              </button>
                              <button
                                className="task-btn"
                                style={{ color: 'var(--red)' }}
                                onClick={() => handleDeleteTask(t.id)}
                                title="Delete Task"
                              >
                                🗑
                              </button>
                            </div>
                          </div>

                          {t.desc && <div className="task-desc">{t.desc}</div>}

                          {/* Subtasks checklist with direct checkbox updates */}
                          <div style={{ marginTop: 10, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 8 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9.5, color: 'var(--muted2)', marginBottom: 4 }}>
                              <span style={{ fontWeight: 700 }}>Subtasks Checklist</span>
                              <span>{completedSub}/{totalSub} ({subPercent}%)</span>
                            </div>
                            <div className="proj-stat-bar" style={{ height: 3, marginBottom: 6 }}>
                              <div className="proj-progress-fill" style={{ width: `${subPercent}%` }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                              {currentSub.map(sub => (
                                <div
                                  key={sub.id}
                                  className="subtask-item"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleSubtask(t, sub.id);
                                  }}
                                >
                                  <span style={{ color: sub.done ? 'var(--teal)' : 'var(--muted)', fontSize: 11, marginRight: 2, display: 'inline-block', transform: 'translateY(-1px)' }}>
                                    {sub.done ? '☑' : '☐'}
                                  </span>
                                  <span style={{ textDecoration: sub.done ? 'line-through' : 'none', opacity: sub.done ? 0.6 : 1 }}>
                                    {sub.title}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Task Meta details */}
                          <div className="task-meta" style={{ marginTop: 10, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 6 }}>
                            {/* Priority tag */}
                            <span className={`task-priority ${t.priority || 'medium'}`}>
                              {t.priority}
                            </span>

                            {/* Linked Account Indicator */}
                            {taskAccount ? (
                              <div
                                style={{ display: 'flex', alignItems: 'center', gap: 4, opacity: 0.8 }}
                                title={`Linked to account: ${taskAccount.name}`}
                              >
                                <PlatformIcon platformId={taskAccount.platform} size={14} />
                                <span style={{ fontSize: 9.5, color: 'var(--muted2)', maxWidth: 70, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {taskAccount.name}
                                </span>
                              </div>
                            ) : (
                              <span style={{ fontSize: 9.5, color: 'var(--muted)' }}>Unassigned</span>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {laneTasks.length === 0 && (
                      <div style={{ textAlign: 'center', padding: '30px 10px', border: '1px dashed var(--border)', borderRadius: 8, color: 'var(--muted)', fontSize: 11 }}>
                        No tasks. Click + to add!
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="gantt-container">
            {/* Frozen Left Tasks Panel */}
            <div className="gantt-tasklist">
              <div className="gantt-tasklist-header">
                📝 Work Items & Due Dates
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {activeProjTasks.map(t => {
                  const taskAccount = accounts.find(a => a.id === t.accountId);
                  const currentSub = getTaskSubtasks(t);
                  const completedSub = currentSub.filter(s => s.done).length;
                  const totalSub = currentSub.length;

                  return (
                    <div key={t.id} className="gantt-task-row">
                      <div className="gantt-task-info">
                        <div className={`gantt-task-accent ${t.priority || 'medium'}`} />
                        <div className="gantt-task-details">
                          <span className="gantt-task-name" title={t.title}>
                            {t.title}
                          </span>
                          <div className="gantt-task-sub">
                            {taskAccount ? (
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                                <PlatformIcon platformId={taskAccount.platform} size={12} />
                                <span style={{ maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {taskAccount.name}
                                </span>
                              </div>
                            ) : (
                              <span>Unassigned</span>
                            )}
                            <span>•</span>
                            <span>{completedSub}/{totalSub} subtasks</span>
                          </div>
                        </div>
                      </div>

                      {/* Due date shift indicators / buttons */}
                      <div className="gantt-task-actions">
                        <button
                          className="gantt-action-btn shift"
                          onClick={() => shiftTaskDueDate(t.id, -1)}
                          title="Shift Due Date Left (-1 day)"
                        >
                          ◀
                        </button>
                        <span className="mono" style={{ fontSize: '9px', color: 'var(--muted2)', padding: '0 2px' }} title="Due Date">
                          {t.dueDate ? t.dueDate.split('-').slice(1).join('/') : 'N/A'}
                        </span>
                        <button
                          className="gantt-action-btn shift"
                          onClick={() => shiftTaskDueDate(t.id, 1)}
                          title="Shift Due Date Right (+1 day)"
                        >
                          ▶
                        </button>
                        <button
                          className="gantt-action-btn"
                          onClick={() => openEditTask(t)}
                          title="Edit Task Details"
                        >
                          ✏
                        </button>
                        <button
                          className="gantt-action-btn delete"
                          onClick={() => handleDeleteTask(t.id)}
                          title="Delete Task"
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  );
                })}
                {activeProjTasks.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--muted)', fontSize: 12 }}>
                    No work items found on this board.
                  </div>
                )}
              </div>
            </div>

            {/* Scrollable Right Calendar Panel */}
            <div className="gantt-timeline">
              {/* Header: 14 Days starting today */}
              <div className="gantt-timeline-header">
                {(() => {
                  const todayDate = new Date();
                  todayDate.setHours(0,0,0,0);
                  return Array.from({ length: 14 }).map((_, idx) => {
                    const d = new Date(todayDate);
                    d.setDate(todayDate.getDate() + idx);
                    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                    return (
                      <div
                        key={idx}
                        className={`gantt-time-cell ${isWeekend ? 'weekend' : ''}`}
                      >
                        <span className="gantt-time-dayname">
                          {d.toLocaleDateString('en-US', { weekday: 'short' })}
                        </span>
                        <span className="gantt-time-daynum">
                          {d.getDate()}
                        </span>
                        <span className="gantt-time-month">
                          {d.toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                      </div>
                    );
                  });
                })()}
              </div>

              {/* Body grid row by row */}
              <div className="gantt-timeline-body">
                {/* Vertical milestone lines */}
                <div
                  className="gantt-milestone-line"
                  style={{
                    left: 'calc((2.5 / 14) * 100%)',
                    borderLeft: '1px dashed var(--purple)',
                    borderColor: 'var(--purple)'
                  }}
                >
                  <span
                    className="gantt-milestone-tag"
                    style={{
                      background: 'rgba(167, 139, 250, 0.95)',
                      color: '#0e0e16',
                      borderColor: 'var(--purple)',
                      boxShadow: '0 0 10px rgba(167, 139, 250, 0.4)'
                    }}
                  >
                    🤖 Alpha (Day 3)
                  </span>
                </div>
                <div
                  className="gantt-milestone-line"
                  style={{
                    left: 'calc((6.5 / 14) * 100%)',
                    borderLeft: '1px dashed var(--gold)',
                    borderColor: 'var(--gold)'
                  }}
                >
                  <span
                    className="gantt-milestone-tag"
                    style={{
                      background: 'rgba(245, 183, 49, 0.95)',
                      color: '#0e0e16',
                      borderColor: 'var(--gold)',
                      boxShadow: '0 0 10px rgba(245, 183, 49, 0.4)'
                    }}
                  >
                    🧪 Beta (Day 7)
                  </span>
                </div>
                <div
                  className="gantt-milestone-line"
                  style={{
                    left: 'calc((9.5 / 14) * 100%)',
                    borderLeft: '1px dashed var(--cyan)',
                    borderColor: 'var(--cyan)'
                  }}
                >
                  <span
                    className="gantt-milestone-tag"
                    style={{
                      background: 'rgba(6, 182, 212, 0.95)',
                      color: '#0e0e16',
                      borderColor: 'var(--cyan)',
                      boxShadow: '0 0 10px rgba(6, 182, 212, 0.4)'
                    }}
                  >
                    🔒 Audit (Day 10)
                  </span>
                </div>
                <div
                  className="gantt-milestone-line"
                  style={{
                    left: 'calc((13.5 / 14) * 100%)',
                    borderLeft: '1px dashed var(--teal)',
                    borderColor: 'var(--teal)'
                  }}
                >
                  <span
                    className="gantt-milestone-tag"
                    style={{
                      background: 'rgba(0, 212, 170, 0.95)',
                      color: '#0e0e16',
                      borderColor: 'var(--teal)',
                      boxShadow: '0 0 10px rgba(0, 212, 170, 0.4)'
                    }}
                  >
                    🚀 Production (Day 14)
                  </span>
                </div>

                {/* Timeline rows */}
                {activeProjTasks.map(t => {
                  const todayDate = new Date();
                  todayDate.setHours(0,0,0,0);
                  const taskDue = t.dueDate ? new Date(t.dueDate) : new Date();
                  taskDue.setHours(0,0,0,0);

                  const diffDays = Math.round((taskDue - todayDate) / (1000 * 60 * 60 * 24));

                  // Compute span
                  let leftPercent;
                  let widthPercent;
                  let overdue = false;
                  let distant = false;

                  if (diffDays < 0) {
                    overdue = true;
                    leftPercent = 0;
                    widthPercent = 5; // small sliver on left
                  } else if (diffDays >= 14) {
                    distant = true;
                    leftPercent = 95;
                    widthPercent = 5; // small sliver on right
                  } else {
                    // Task starts 2 days before the due date, clamped to today
                    const startIndex = Math.max(0, diffDays - 2);
                    const endIndex = diffDays;
                    const duration = endIndex - startIndex + 1;

                    leftPercent = (startIndex / 14) * 100;
                    widthPercent = (duration / 14) * 100;
                  }

                  const currentSub = getTaskSubtasks(t);
                  const completedSub = currentSub.filter(s => s.done).length;
                  const totalSub = currentSub.length;
                  const subPercent = totalSub > 0 ? Math.round((completedSub / totalSub) * 100) : 0;

                  return (
                    <div key={t.id} className="gantt-timeline-row">
                      {/* Grid background columns */}
                      <div className="gantt-grid-overlay">
                        {Array.from({ length: 14 }).map((_, idx) => {
                          const d = new Date(todayDate);
                          d.setDate(todayDate.getDate() + idx);
                          const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                          return (
                            <div
                              key={idx}
                              className={`gantt-grid-cell ${isWeekend ? 'weekend' : ''}`}
                            />
                          );
                        })}
                      </div>

                      {/* Visual Task Bar */}
                      <div
                        className="gantt-task-bar-wrapper"
                        style={{
                          left: `${leftPercent}%`,
                          width: `${widthPercent}%`
                        }}
                      >
                        <div
                          className={`gantt-task-bar ${t.priority || 'medium'}`}
                          onClick={() => openEditTask(t)}
                          style={{
                            boxShadow: overdue ? '0 0 12px rgba(255, 95, 95, 0.4)' : ''
                          }}
                        >
                          {/* Inner subtask completion progress fill */}
                          <div
                            className="gantt-task-bar-fill"
                            style={{ width: `${subPercent}%` }}
                          />
                          <div className="gantt-task-bar-content">
                            {overdue ? (
                              <span style={{ fontSize: '8px', color: 'var(--red)', fontWeight: 'bold' }}>⚠️ OVERDUE</span>
                            ) : distant ? (
                              <span style={{ fontSize: '8px', color: 'var(--muted)', fontWeight: 'bold' }}>📡 DISTANT ({diffDays}d)</span>
                            ) : (
                              <>
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {t.title}
                                </span>
                                <span className="mono" style={{ fontSize: '8px', opacity: 0.8 }}>
                                  {subPercent}%
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}


        {/* TASK CREATOR / EDITOR DIALOG */}
        {showTaskModal && (
          <div className="overlay" onClick={() => setShowTaskModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 440 }}>
              <div className="modal-title">
                {editTaskId ? '✏ Edit Kanban Task' : '📋 Create Kanban Task'}
              </div>

              <div className="form-row">
                <label>Task Title *</label>
                <input
                  value={taskForm.title}
                  onChange={e => setTaskForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Core App Layout Styling"
                />
              </div>

              <div className="form-row">
                <label>Description / Details</label>
                <textarea
                  value={taskForm.desc}
                  onChange={e => setTaskForm(f => ({ ...f, desc: e.target.value }))}
                  placeholder="What prompts should be run or what needs coding?"
                  style={{ minHeight: 70 }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div className="form-row">
                  <label>Linked Platform Account</label>
                  <select
                    value={taskForm.accountId}
                    onChange={e => setTaskForm(f => ({ ...f, accountId: e.target.value }))}
                  >
                    <option value="">Unassigned</option>
                    {linkedAccounts.map(a => (
                      <option key={a.id} value={a.id}>
                        {PLATFORMS.find(p => p.id === a.platform)?.icon} {a.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-row">
                  <label>Priority Tier</label>
                  <select
                    value={taskForm.priority}
                    onChange={e => setTaskForm(f => ({ ...f, priority: e.target.value }))}
                  >
                    <option value="low">🔵 Low Priority</option>
                    <option value="medium">🟡 Medium Priority</option>
                    <option value="high">🔴 High Priority</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 8 }}>
                <div className="form-row">
                  <label>Kanban Column Status</label>
                  <select
                    value={taskForm.status}
                    onChange={e => setTaskForm(f => ({ ...f, status: e.target.value }))}
                  >
                    {LANES.map(l => (
                      <option key={l.id} value={l.id}>
                        {l.emoji} {l.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-row">
                  <label>Due Date</label>
                  <input
                    type="date"
                    value={taskForm.dueDate}
                    onChange={e => setTaskForm(f => ({ ...f, dueDate: e.target.value }))}
                  />
                </div>
              </div>

              {/* Injected checklist editor for task subtasks */}
              <div className="form-row" style={{ marginTop: 8 }}>
                <label>Subtask Checklist</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 120, overflowY: 'auto', paddingRight: 4, marginBottom: 6 }}>
                  {(taskForm.subtasks || []).map((sub, sIdx) => (
                    <div key={sub.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <input
                        type="checkbox"
                        checked={sub.done}
                        onChange={(e) => {
                          const updated = [...taskForm.subtasks];
                          updated[sIdx].done = e.target.checked;
                          setTaskForm(f => ({ ...f, subtasks: updated }));
                        }}
                        style={{ width: 14, height: 14, cursor: 'pointer' }}
                      />
                      <input
                        value={sub.title}
                        onChange={(e) => {
                          const updated = [...taskForm.subtasks];
                          updated[sIdx].title = e.target.value;
                          setTaskForm(f => ({ ...f, subtasks: updated }));
                        }}
                        placeholder="Subtask description"
                        style={{ flex: 1, padding: '4px 8px', fontSize: 11 }}
                      />
                      <button
                        type="button"
                        className="btn btn-ghost btn-xs"
                        style={{ color: 'var(--red)', padding: '2px 4px' }}
                        onClick={() => {
                          const updated = taskForm.subtasks.filter((_, idx) => idx !== sIdx);
                          setTaskForm(f => ({ ...f, subtasks: updated }));
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-xs"
                  style={{ color: 'var(--teal)', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                  onClick={() => {
                    setTaskForm(f => ({
                      ...f,
                      subtasks: [...(f.subtasks || []), { id: generateSubtaskId(), title: '', done: false }]
                    }));
                  }}
                >
                  + Add Subtask Item
                </button>
              </div>

              <div className="modal-footer" style={{ marginTop: 18 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setShowTaskModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-gold btn-sm" onClick={handleSaveTask}>
                  {editTaskId ? 'Update Task' : 'Add Task'}
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // --- RENDERING ALL PROJECTS OVERVIEW DASHBOARD ---
  return (
    <>
      {/* Overview header */}
      <div className="sec-hdr">
        <span className="sec-lbl">{projects.length} developer workspaces</span>
        <button className="btn btn-gold btn-sm btn-pulse" onClick={openAddProject}>
          + Initialize Project
        </button>
      </div>

      {/* Grid of beautiful project workspaces */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {projects.map(p => {
          const linkedAccs = accounts.filter(a => (p.accountIds || []).includes(a.id));
          const totalTasks = p.tasks?.length || 0;
          const completedTasks = p.tasks?.filter(t => t.status === 'done').length || 0;
          const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

          return (
            <div key={p.id} className="proj-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

              {/* Card top details */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <div className="card-name" style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>
                    📁 {p.name}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>
                    Initialized {new Date(p.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <span className={`badge ${p.status === 'active' ? 'badge-ok' : 'badge-off'}`}>
                  {p.status === 'active' ? '● Active' : '○ Paused'}
                </span>
              </div>

              {/* Description */}
              <div className="card-desc" style={{ flex: 1, fontSize: 12.5, color: 'var(--muted2)', lineHeight: 1.5 }}>
                {p.desc || 'No description provided.'}
              </div>

              {/* Progress metrics */}
              <div style={{ marginTop: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, color: '#e4e4ed', marginBottom: 4 }}>
                  <span>Kanban Progress</span>
                  <span style={{ color: 'var(--teal)' }}>
                    {completedTasks}/{totalTasks} tasks ({progress}%)
                  </span>
                </div>
                <div className="proj-stat-bar">
                  <div className="proj-progress-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>

              {/* Associated platform icons */}
              <div className="card-meta" style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 14, alignItems: 'center' }}>
                <span style={{ fontSize: 10.5, color: 'var(--muted)', marginRight: 4 }}>Linked Accounts:</span>
                {linkedAccs.slice(0, 5).map(a => (
                  <div key={a.id} title={a.name} style={{ display: 'flex', alignItems: 'center' }}>
                    <PlatformIcon platformId={a.platform} size={20} />
                  </div>
                ))}
                {linkedAccs.length > 5 && (
                  <div style={{ width: 20, height: 20, background: 'var(--surface3)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: 'var(--muted)', border: '1px solid var(--border)' }}>
                    +{linkedAccs.length - 5}
                  </div>
                )}
                {linkedAccs.length === 0 && (
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>No accounts linked</span>
                )}
              </div>

              {/* Card actions */}
              <div className="card-footer" style={{ borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 14, display: 'flex', gap: 6 }}>
                <button
                  className="btn btn-gold btn-xs"
                  style={{ flex: 1, justifyContent: 'center', fontWeight: 800 }}
                  onClick={() => {
                    sound.play('pin');
                    setActiveProjectId(p.id);
                  }}
                >
                  📁 Open Board
                </button>
                <button className="btn btn-ghost btn-xs" onClick={() => openEditProject(p)} title="Edit Project">
                  ✏ Edit
                </button>
                <button className="btn btn-ghost btn-xs" onClick={() => toggleProjectStatus(p)} title="Toggle Active/Paused">
                  {p.status === 'active' ? '⏸' : '▶'}
                </button>
                <button
                  className="btn btn-danger btn-xs"
                  onClick={() => handleDeleteProject(p.id)}
                  title="Delete Project"
                >
                  🗑
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE / EDIT PROJECT MODAL */}
      {showProjModal && (
        <div className="overlay" onClick={() => setShowProjModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 440 }}>
            <div className="modal-title">
              {editProjId ? '📁 Edit Project Settings' : '📁 Initialize New Project'}
            </div>

            <div className="form-row">
              <label>Project Name *</label>
              <input
                value={projForm.name}
                onChange={e => setProjForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. SaaS Analytics Suite"
              />
            </div>

            <div className="form-row">
              <label>Description</label>
              <textarea
                value={projForm.desc}
                onChange={e => setProjForm(f => ({ ...f, desc: e.target.value }))}
                placeholder="Brief summary of the codebase/project goal..."
                style={{ minHeight: 70 }}
              />
            </div>

            <div className="form-row">
              <label>Link Developer Accounts</label>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8 }}>
                Select the platform workspaces linked to this project context
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {accounts.map(a => {
                  const isSelected = projForm.accountIds.includes(a.id);
                  const platConfig = PLATFORMS.find(p => p.id === a.platform);
                  return (
                    <button
                      key={a.id}
                      type="button"
                      className={`pill ${isSelected ? 'on' : ''}`}
                      onClick={() => toggleAccountInProjForm(a.id)}
                    >
                      {platConfig?.icon} {a.name}
                    </button>
                  );
                })}
                {accounts.length === 0 && (
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                    No connected accounts available. Please add an account first.
                  </span>
                )}
              </div>
            </div>

            <div className="modal-footer" style={{ marginTop: 18 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowProjModal(false)}>
                Cancel
              </button>
              <button
                className="btn btn-gold btn-sm"
                onClick={handleSaveProject}
                disabled={!projForm.name.trim()}
              >
                {editProjId ? 'Save Workspace' : 'Initialize Board'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
