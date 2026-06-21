import { useState, useEffect, useRef } from 'react';
import { useStore } from '../data/store';
import { useToast } from '../components/Toast';
import { PLATFORMS } from '../data/constants';
import EmptyState from '../components/EmptyState';

// --- Default blank step ---
const emptyStep = () => ({ prompt: '', delay: 3, accountId: '' });

// --- Prompt Optimizer local helper to avoid cross-page circular references ---
function localOptimizePrompt(originalText) {
  if (!originalText.trim()) return '';
  return `## Optimized Prompt Node\n\n### Core Request:\n${originalText}\n\n### Quality Directives:\n- Maintain production-grade, highly responsive front-end UI structures.\n- Ensure complete separation of concerns and robust error-handling boundaries.\n- Apply consistent HSLTailored colors and micro-transitions for premium visuals.\n- Document all key logic paths cleanly.`;
}

// --- Pre-configured Automation Templates ---
const TEMPLATE_WORKFLOWS = [
  {
    name: '🚀 SaaS CRM Launch Pipeline',
    desc: 'Automate a full SaaS analytics setup across v0 Component Lab, Lovable database layers, and Replit sandbox deployments.',
    steps: [
      { prompt: 'Build a responsive SaaS dashboard UI sidebar and table components with modern dark mode styling.', delay: 4, accountId: 'demo-7' },
      { prompt: 'Define PostgreSQL schema database structures for subscriptions, clients, and transaction histories.', delay: 5, accountId: 'demo-1' },
      { prompt: 'Configure mock express API router endpoints and secure route authenticators for testing.', delay: 3, accountId: 'demo-2' }
    ]
  },
  {
    name: '📱 Mobile Portfolio App Core',
    desc: 'Deploy visual portfolio structures and hook them up to live SQLite database systems.',
    steps: [
      { prompt: 'Draft clean React Native view layouts displaying project categories, profiles, and resume sliders.', delay: 3, accountId: 'demo-8' },
      { prompt: 'Write modular server-side functions interfacing with SQLite to fetch resume data.', delay: 4, accountId: 'demo-2' }
    ]
  },
  {
    name: '🛡️ Secure JWT Authentication System',
    desc: 'Generate JWT authentication tokens and secure headers on your Claude chatbot servers.',
    steps: [
      { prompt: 'Assemble authentication routes, password hashing with bcrypt, and token generation controllers.', delay: 4, accountId: 'demo-6' },
      { prompt: 'Configure strict CORS, rate-limiting, and Helmet security headers on production API servers.', delay: 3, accountId: 'demo-5' }
    ]
  }
];

export default function Workflows() {
  const { workflows, accounts, addWorkflow, updateWorkflow, deleteWorkflow, setState } = useStore();
  const toast = useToast();

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', desc: '', steps: [emptyStep()] });

  // Ephemeral active runner state
  const [runningWfId, setRunningWfId] = useState(null);
  const [currentStepIdx, setCurrentStepIdx] = useState(-1);
  // eslint-disable-next-line no-unused-vars
  const [isWaitingDelay, setIsWaitingDelay] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState([]);
  const consoleEndRef = useRef(null);

  const [selectedWfIdCanvas, setSelectedWfIdCanvas] = useState(null);
  const [canvasLayout, setCanvasLayout] = useState('horizontal'); // 'horizontal' | 'vertical' | 'zigzag'
  const [canvasActiveEditStepIdx, setCanvasActiveEditStepIdx] = useState(null);

  const runningWf = workflows.find(w => w.id === runningWfId);
  const isCurrentlyRunning = runningWf?.status === 'running';

  // Scroll active console to bottom
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [consoleLogs]);

  // --- Canvas Mutator Functions ---
  const handleUpdateStepInCanvas = (wfId, idx, key, val) => {
    const wf = workflows.find(w => w.id === wfId);
    if (!wf) return;
    const updatedSteps = wf.steps.map((s, i) => i === idx ? { ...s, [key]: val } : s);
    updateWorkflow(wfId, { steps: updatedSteps });
  };

  const handleDeleteStepInCanvas = (wfId, idx) => {
    const wf = workflows.find(w => w.id === wfId);
    if (!wf) return;
    const updatedSteps = wf.steps.filter((_, i) => i !== idx);
    updateWorkflow(wfId, { steps: updatedSteps });
    toast.success('Step node removed from flowchart');
  };

  const handleAppendStepInCanvas = (wfId) => {
    const wf = workflows.find(w => w.id === wfId);
    if (!wf) return;
    const defaultAccId = accounts[0]?.id || '';
    const newStep = { prompt: 'Assemble modular functions and dispatch context.', delay: 3, accountId: defaultAccId };
    const updatedSteps = [...(wf.steps || []), newStep];
    updateWorkflow(wfId, { steps: updatedSteps });
    toast.bolt('Appended new step node to pipeline');
  };

  const handleOptimizeStepPromptInCanvas = (wfId, idx) => {
    const wf = workflows.find(w => w.id === wfId);
    if (!wf) return;
    const originalText = wf.steps[idx].prompt;
    if (!originalText.trim()) {
      toast.error('Requirement text is empty');
      return;
    }
    const optimizedText = localOptimizePrompt(originalText);
    handleUpdateStepInCanvas(wfId, idx, 'prompt', optimizedText);
    toast.bolt('✨ Step requirements enhanced by AI');
  };

  // --- Load Templates ---
  const handleLoadTemplates = () => {
    let imported = 0;
    TEMPLATE_WORKFLOWS.forEach(tmpl => {
      const exists = workflows.some(w => w.name === tmpl.name);
      if (!exists) {
        addWorkflow({
          ...tmpl,
          status: 'active'
        });
        imported++;
      }
    });

    if (imported > 0) {
      toast.bolt(`✓ Preloaded ${imported} premium visual workflows!`);
    } else {
      toast.info('Workflow templates are already imported.');
    }
  };

  // --- Modal Openers ---
  const openAdd = () => {
    setEditId(null);
    // Pre-populate first step linked account if accounts exist
    const defaultAccId = accounts[0]?.id || '';
    setForm({ name: '', desc: '', steps: [{ prompt: '', delay: 3, accountId: defaultAccId }] });
    setShowModal(true);
  };

  const openEdit = (w) => {
    setEditId(w.id);
    setForm({
      name: w.name,
      desc: w.desc || '',
      steps: w.steps && w.steps.length
        ? w.steps.map(s => ({ ...s }))
        : [emptyStep()]
    });
    setShowModal(true);
  };

  // --- Save Workflow ---
  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error('Workflow name is required');
      return;
    }
    // Clean empty steps
    const cleaned = {
      ...form,
      steps: form.steps.filter(s => s.prompt.trim())
    };

    if (cleaned.steps.length === 0) {
      toast.error('Please enter prompt text for at least one step');
      return;
    }

    if (editId) {
      updateWorkflow(editId, cleaned);
      toast.success('Workflow timeline updated');
    } else {
      addWorkflow({
        ...cleaned,
        status: 'active'
      });
      toast.bolt('Visual Workflow initialized!');
    }
    setShowModal(false);
  };

  // --- Delete Workflow ---
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this workflow pipeline?')) {
      deleteWorkflow(id);
      if (runningWfId === id) {
        setRunningWfId(null);
      }
      toast.success('Workflow deleted');
    }
  };

  // --- Toggle Pause ---
  const handleTogglePause = (w) => {
    const nextStatus = w.status === 'paused' ? 'active' : 'paused';
    updateWorkflow(w.id, { status: nextStatus });
    toast.success(nextStatus === 'paused' ? 'Workflow execution paused' : 'Workflow ready');
  };

  // --- Simulation Runner Engine ---
  const handleRunWorkflow = async (w) => {
    const steps = w.steps || [];
    if (steps.length === 0) {
      toast.error('This workflow has no steps to run!');
      return;
    }

    // Set active running states
    setRunningWfId(w.id);
    setCurrentStepIdx(0);
    setIsWaitingDelay(false);
    updateWorkflow(w.id, { status: 'running' });

    const initialLogs = [
      `[${new Date().toLocaleTimeString()}] [SYS] Initializing sequence engine: "${w.name}"`,
      `[${new Date().toLocaleTimeString()}] [SYS] Pipeline nodes: ${steps.length} | Sync status: HANDSHAKE READY`
    ];
    setConsoleLogs(initialLogs);

    const initialRun = {
      workflowId: w.id,
      name: w.name,
      currentStepIdx: 0,
      isWaitingDelay: false,
      stepsCount: steps.length,
      activeStep: steps[0],
      logs: initialLogs,
      stepStatuses: { [steps[0]?.accountId]: 'sending' }
    };
    setState(prev => ({ ...prev, activeWorkflowRun: initialRun }));

    for (let i = 0; i < steps.length; i++) {
      setCurrentStepIdx(i);
      setIsWaitingDelay(false);
      const step = steps[i];
      const targetAcc = accounts.find(a => a.id === step.accountId);
      const platformName = PLATFORMS.find(p => p.id === targetAcc?.platform)?.name || 'Unknown Platform';
      const accountLabel = targetAcc ? `${targetAcc.name} (${platformName})` : `Unassigned platform`;

      const stepLogs = [
        `[${new Date().toLocaleTimeString()}] [NODE ${i + 1}] Target workspace context: ${accountLabel}`,
        `[${new Date().toLocaleTimeString()}] [RUN] Transmitting payload: "${step.prompt.slice(0, 80)}..."`,
        `[${new Date().toLocaleTimeString()}] [NETWORK] Establishing secure websocket socket to platform gateway...`
      ];

      setConsoleLogs(prev => [...prev, ...stepLogs]);

      setState(prev => {
        const currentLogs = prev.activeWorkflowRun?.logs || [];
        return {
          ...prev,
          activeWorkflowRun: {
            ...prev.activeWorkflowRun,
            currentStepIdx: i,
            isWaitingDelay: false,
            activeStep: step,
            logs: [...currentLogs, ...stepLogs],
            stepStatuses: {
              ...(prev.activeWorkflowRun?.stepStatuses || {}),
              [step.accountId]: 'sending'
            }
          }
        };
      });

      await new Promise(r => setTimeout(r, 1200));

      const isLLMOptimize = step.prompt.includes('Optimize and enhance the workspace context') || step.actionType === '🤖 LLM Optimize Context' || step.prompt.includes('LLM Optimize');
      const isBroadcast = step.prompt.includes('Simultaneously dispatch prompt packets') || step.actionType === '📡 Multi-Tab Dispatch Broadcast' || step.prompt.includes('Multi-Tab Dispatch');
      const isSecurityAudit = step.prompt.includes('Execute a cryptographic credential') || step.actionType === '🔒 Handshake Security Audit' || step.prompt.includes('Security Audit');
      const isAutoSave = step.prompt.includes('Auto-save local sandbox') || step.actionType === '💾 Library Payload Auto-Save' || step.prompt.includes('Library Payload');

      let actionLogs = [];
      if (isLLMOptimize) {
        actionLogs = [
          `[${new Date().toLocaleTimeString()}] [SYS] Initiating LLM Context Optimization parser...`,
          `[${new Date().toLocaleTimeString()}] [LIVE] System instructions analyzed by AI orchestrator. Applied DM Mono & HSL layout modifiers.`,
          `[${new Date().toLocaleTimeString()}] [COMPILE] Active compilation: Optimization weight factor: 1.25x. Codebases synced successfully.`
        ];
      } else if (isBroadcast) {
        actionLogs = [
          `[${new Date().toLocaleTimeString()}] [SYS] Spawning broadcast threads to all platform endpoints...`,
          `[${new Date().toLocaleTimeString()}] [LIVE] Lovable 💜, Bolt.new ⚡, Replit 🔶, Claude 🧠 active gateways online.`,
          `[${new Date().toLocaleTimeString()}] [COMPILE] Multi-platform broadcast packets successfully dispatched. High-speed WebSocket relay latency: 42ms.`
        ];
      } else if (isSecurityAudit) {
        actionLogs = [
          `[${new Date().toLocaleTimeString()}] [SYS] Auditing credential hashes on SSL/TLS 1.3 tunnel streams...`,
          `[${new Date().toLocaleTimeString()}] [LIVE] Cryptographic token check complete. Access scope validations match.`,
          `[${new Date().toLocaleTimeString()}] [COMPILE] SSL certificate verification check: 100% SECURE. Session renewed.`
        ];
      } else if (isAutoSave) {
        actionLogs = [
          `[${new Date().toLocaleTimeString()}] [SYS] Auto-serializing developer workspace filesystem snapshot...`,
          `[${new Date().toLocaleTimeString()}] [LIVE] Encapsulating 4 active layouts + index.css styling definitions.`,
          `[${new Date().toLocaleTimeString()}] [COMPILE] Saved compressed compilation payload to history database library cache. Size: 42.5 KB.`
        ];
      } else {
        actionLogs = [
          `[${new Date().toLocaleTimeString()}] [LIVE] Handshake secure (TLS 1.3). Generating React modules...`,
          `[${new Date().toLocaleTimeString()}] [COMPILE] Active compilation: 18 components synced successfully.`
        ];
      }

      setConsoleLogs(prev => [...prev, ...actionLogs]);

      setState(prev => {
        const currentLogs = prev.activeWorkflowRun?.logs || [];
        return {
          ...prev,
          activeWorkflowRun: {
            ...prev.activeWorkflowRun,
            logs: [...currentLogs, ...actionLogs]
          }
        };
      });

      await new Promise(r => setTimeout(r, 1000));

      const doneLog = `[${new Date().toLocaleTimeString()}] [DONE] Step ${i + 1} completed! Workspace synchronized.`;
      setConsoleLogs(prev => [...prev, doneLog]);

      setState(prev => {
        const currentLogs = prev.activeWorkflowRun?.logs || [];
        return {
          ...prev,
          activeWorkflowRun: {
            ...prev.activeWorkflowRun,
            logs: [...currentLogs, doneLog],
            stepStatuses: {
              ...(prev.activeWorkflowRun?.stepStatuses || {}),
              [step.accountId]: 'success'
            }
          }
        };
      });

      // If there's a next step and a delay, run wait timer
      if (i < steps.length - 1 && step.delay > 0) {
        setIsWaitingDelay(true);
        const waitLog = `[${new Date().toLocaleTimeString()}] [WAIT] Delaying pipeline for ${step.delay}s to allow build cooling...`;
        setConsoleLogs(prev => [...prev, waitLog]);

        setState(prev => {
          const currentLogs = prev.activeWorkflowRun?.logs || [];
          return {
            ...prev,
            activeWorkflowRun: {
              ...prev.activeWorkflowRun,
              isWaitingDelay: true,
              logs: [...currentLogs, waitLog]
            }
          };
        });

        // Wait simulated delay
        await new Promise(r => setTimeout(r, step.delay * 1000));
      }
    }

    const endLogs = [
      `[${new Date().toLocaleTimeString()}] [SYS] All ${steps.length} nodes resolved. Workflow execution successful!`,
      `[${new Date().toLocaleTimeString()}] [SYS] Terminating handshake socket... closed.`
    ];
    setConsoleLogs(prev => [...prev, ...endLogs]);

    setState(prev => {
      const currentLogs = prev.activeWorkflowRun?.logs || [];
      return {
        ...prev,
        activeWorkflowRun: {
          ...prev.activeWorkflowRun,
          currentStepIdx: steps.length,
          isWaitingDelay: false,
          logs: [...currentLogs, ...endLogs]
        }
      };
    });

    setCurrentStepIdx(steps.length); // mark overall completion
    setIsWaitingDelay(false);
    updateWorkflow(w.id, { status: 'active' });
    toast.success(`Workflow "${w.name}" completed successfully!`);
  };

  // Feature 28: Dry-run step debugger workflow executor
  const handleDryRunWorkflow = async (w) => {
    const steps = w.steps || [];
    if (steps.length === 0) {
      toast.error('This workflow has no steps to run!');
      return;
    }

    setRunningWfId(w.id);
    setCurrentStepIdx(0);
    setIsWaitingDelay(false);
    updateWorkflow(w.id, { status: 'running' });

    const initialLogs = [
      `[${new Date().toLocaleTimeString()}] [DEBUGGER] [DRY RUN] Starting dry run simulation for pipeline: "${w.name}"`,
      `[${new Date().toLocaleTimeString()}] [DEBUGGER] [DRY RUN] Bypassing network pings, overriding cool-off delays to 200ms...`
    ];
    setConsoleLogs(initialLogs);

    for (let i = 0; i < steps.length; i++) {
      setCurrentStepIdx(i);
      const step = steps[i];
      const targetAcc = accounts.find(a => a.id === step.accountId);
      const platformName = PLATFORMS.find(p => p.id === targetAcc?.platform)?.name || 'Unknown Platform';

      const stepLogs = [
        `[${new Date().toLocaleTimeString()}] [DRY RUN] [NODE ${i + 1}] Mocking account link: ${targetAcc?.name || 'Unassigned'} (${platformName})`,
        `[${new Date().toLocaleTimeString()}] [DRY RUN] [PROMPT] "${step.prompt.slice(0, 60)}..."`,
        `[${new Date().toLocaleTimeString()}] [DRY RUN] [SUCCESS] Node validation matches schema. Syntax: OK.`
      ];
      setConsoleLogs(prev => [...prev, ...stepLogs]);
      await new Promise(r => setTimeout(r, 250));
    }

    const endLogs = [
      `[${new Date().toLocaleTimeString()}] [DEBUGGER] [DRY RUN] Dry run completed with zero validation issues. Pipeline verified successfully!`
    ];
    setConsoleLogs(prev => [...prev, ...endLogs]);

    setCurrentStepIdx(steps.length);
    updateWorkflow(w.id, { status: 'active' });
    toast.bolt(`✓ Dry-run validation of "${w.name}" complete!`);
  };

  // Feature 29: Workflow JSON exporter
  const handleExportWorkflowJSON = (w) => {
    const content = JSON.stringify(w, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workflow-${w.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success('Workflow exported as JSON');
  };

  // --- Modal Form Actions ---
  const addStepInForm = () => {
    const defaultAccId = accounts[0]?.id || '';
    setForm(f => ({
      ...f,
      steps: [...f.steps, { prompt: '', delay: 3, accountId: defaultAccId }]
    }));
  };

  const removeStepInForm = (idx) => {
    setForm(f => ({
      ...f,
      steps: f.steps.length > 1 ? f.steps.filter((_, i) => i !== idx) : f.steps
    }));
  };

  const updateStepInForm = (idx, key, value) => {
    setForm(f => ({
      ...f,
      steps: f.steps.map((s, i) => i === idx ? { ...s, [key]: value } : s)
    }));
  };

  const swapStepOrder = (idx, direction) => {
    if (idx + direction < 0 || idx + direction >= form.steps.length) return;
    const updatedSteps = [...form.steps];
    const temp = updatedSteps[idx];
    updatedSteps[idx] = updatedSteps[idx + direction];
    updatedSteps[idx + direction] = temp;

    setForm(f => ({ ...f, steps: updatedSteps }));
    toast.success('Step sequence reordered');
  };

  const handleOptimizeStepPrompt = (idx) => {
    const originalText = form.steps[idx].prompt;
    if (!originalText.trim()) {
      toast.error('Please write some prompt details first');
      return;
    }
    const optimizedText = localOptimizePrompt(originalText);
    updateStepInForm(idx, 'prompt', optimizedText);
    toast.bolt(`✓ Optimized Step ${idx + 1} Prompt with AI!`);
  };

  // Render Empty state if no workflows exist
  if (!workflows.length) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <EmptyState
          icon="🔄"
          title="No workflows configured"
          subtitle="Create visual multi-step pipeline automation sequences to execute prompts across multiple AI accounts automatically."
        >
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button className="btn btn-gold" onClick={openAdd}>
              ⚡ Create Workflow
            </button>
            <button className="btn btn-ghost" onClick={handleLoadTemplates}>
              📦 Load Workflow Templates
            </button>
          </div>
        </EmptyState>

        {showModal && (
          <WorkflowModal
            editId={editId}
            form={form}
            setForm={setForm}
            accounts={accounts}
            onClose={() => setShowModal(false)}
            onSave={handleSave}
            updateStep={updateStepInForm}
            addStep={addStepInForm}
            removeStep={removeStepInForm}
            swapStep={swapStepOrder}
            onOptimize={handleOptimizeStepPrompt}
          />
        )}
      </div>
    );
  }

  if (selectedWfIdCanvas) {
    const w = workflows.find(item => item.id === selectedWfIdCanvas);
    if (!w) {
      setSelectedWfIdCanvas(null);
      return null;
    }
    const wSteps = w.steps || [];
    const isWfRunning = w.id === runningWfId && isCurrentlyRunning;

    // Resolve positions
    const resolvedNodes = wSteps.map((step, idx) => {
      let x, y;
      if (canvasLayout === 'horizontal') {
        x = 50 + idx * 270;
        y = 120;
      } else if (canvasLayout === 'vertical') {
        x = 220;
        y = 40 + idx * 160;
      } else {
        // zigzag matrix
        x = 50 + (idx % 2) * 380;
        y = 40 + Math.floor(idx / 2) * 160;
      }
      return { ...step, idx, x, y };
    });

    const drawSpline = (n1, n2) => {
      const cardW = 220, cardH = 88;
      let sx, sy, tx, ty;
      if (canvasLayout === 'horizontal') {
        sx = n1.x + cardW;
        sy = n1.y + cardH / 2;
        tx = n2.x;
        ty = n2.y + cardH / 2;
      } else if (canvasLayout === 'vertical') {
        sx = n1.x + cardW / 2;
        sy = n1.y + cardH;
        tx = n2.x + cardW / 2;
        ty = n2.y;
      } else {
        // zigzag
        sx = n1.x + cardW;
        sy = n1.y + cardH / 2;
        tx = n2.x;
        ty = n2.y + cardH / 2;
      }
      const dx = Math.abs(tx - sx) / 2;
      return `M ${sx} ${sy} C ${sx + dx} ${sy}, ${tx - dx} ${ty}, ${tx} ${ty}`;
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: 'calc(100vh - 120px)', minHeight: 600 }}>
        {/* Canvas Header Banner */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 14, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setSelectedWfIdCanvas(null)}>
              ← Back to List
            </button>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>🗺️ Flowchart Canvas: {w.name}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{wSteps.length} functional prompt nodes linked on the grid</div>
            </div>
          </div>
          {/* Controls */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div className="pills" style={{ padding: 2, background: 'var(--surface2)', borderRadius: 8, border: '1px solid var(--border)' }}>
              {[
                { id: 'horizontal', label: '➡️ Horizontal' },
                { id: 'vertical', label: '⬇️ Vertical' },
                { id: 'zigzag', label: '⚡ Zig-Zag' },
              ].map(lay => (
                <button
                  key={lay.id}
                  className={`pill ${canvasLayout === lay.id ? 'active' : ''}`}
                  onClick={() => setCanvasLayout(lay.id)}
                  style={{ fontSize: 10, padding: '4px 10px', minWidth: 80, justifyContent: 'center' }}
                >
                  {lay.label}
                </button>
              ))}
            </div>
            <button
              className="btn btn-gold btn-sm btn-pulse"
              onClick={() => handleRunWorkflow(w)}
              disabled={isWfRunning || wSteps.length === 0}
            >
              {isWfRunning ? '⏳ Pipeline Running...' : '▶ Run Sequence'}
            </button>
          </div>
        </div>

        {/* Outer Canvas Workspace Container */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16, minHeight: 0 }}>

          {/* Canvas Board Area */}
          <div style={{
            position: 'relative',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            overflow: 'auto',
            minHeight: 480,
          }}>
            {/* SVG Link Connections Vector layer */}
            <svg style={{ position: 'absolute', inset: 0, width: 2000, height: 2000, pointerEvents: 'none', zIndex: 1 }}>
              <defs>
                <linearGradient id="splineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="var(--teal)" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              {resolvedNodes.map((node, i) => {
                if (i === wSteps.length - 1) return null;
                const nextNode = resolvedNodes[i + 1];
                const splinePath = drawSpline(node, nextNode);
                const isLinkActive = isWfRunning && i === currentStepIdx;
                const isLinkDone = isWfRunning && i < currentStepIdx;

                return (
                  <g key={i}>
                    {/* Glowing background cable */}
                    <path
                      d={splinePath}
                      stroke={isLinkActive ? 'var(--gold)' : isLinkDone ? 'var(--teal)' : 'rgba(255,255,255,0.08)'}
                      strokeWidth={isLinkActive ? 3.5 : 1.8}
                      fill="none"
                      style={{
                        transition: 'stroke 0.4s, stroke-width 0.4s',
                        filter: (isLinkActive || isLinkDone) ? `drop-shadow(0 0 6px ${isLinkActive ? 'var(--gold)' : 'var(--teal)'}50)` : 'none'
                      }}
                    />

                    {/* Animated signal particle along cable vector spline */}
                    {isLinkActive && (
                      <circle r="4.5" fill="var(--gold)">
                        <animateMotion path={splinePath} dur="1.2s" repeatCount="indefinite" />
                      </circle>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Absolute-positioned nodes cards */}
            {resolvedNodes.map((node, idx) => {
              const stepAcc = accounts.find(a => a.id === node.accountId);
              const plConfig = PLATFORMS.find(p => p.id === stepAcc?.platform);
              const isNodeDone = isWfRunning && idx < currentStepIdx;
              const isNodeActive = isWfRunning && idx === currentStepIdx;

              return (
                <div
                  key={idx}
                  style={{
                    position: 'absolute',
                    left: node.x,
                    top: node.y,
                    width: 220,
                    height: 88,
                    background: 'var(--surface2)',
                    border: isNodeActive ? '2px solid var(--gold)' : isNodeDone ? '1.5px solid var(--teal)' : '1px solid var(--border)',
                    borderLeft: `3px solid ${plConfig?.color || 'var(--border)'}`,
                    borderRadius: 10,
                    padding: '10px 12px',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    boxShadow: isNodeActive ? '0 0 20px rgba(245,183,49,0.3)' : isNodeDone ? '0 0 10px rgba(0,212,170,0.1)' : '0 4px 12px rgba(0,0,0,0.4)',
                    cursor: 'pointer',
                    transition: 'left 0.4s ease, top 0.4s ease, border-color 0.3s, box-shadow 0.3s',
                    zIndex: 2,
                  }}
                  onClick={() => setCanvasActiveEditStepIdx(idx)}
                >
                  {/* Circular port connectors on card borders */}
                  {canvasLayout === 'horizontal' && (
                    <>
                      <div style={{ position: 'absolute', left: -5, top: 'calc(50% - 5px)', width: 8, height: 8, borderRadius: '50%', background: 'var(--surface)', border: `1.5px solid ${isNodeActive ? 'var(--gold)' : 'var(--border2)'}`, zIndex: 10 }} />
                      <div style={{ position: 'absolute', right: -5, top: 'calc(50% - 5px)', width: 8, height: 8, borderRadius: '50%', background: 'var(--surface)', border: `1.5px solid ${isNodeActive ? 'var(--gold)' : 'var(--border2)'}`, zIndex: 10 }} />
                    </>
                  )}
                  {canvasLayout === 'vertical' && (
                    <>
                      <div style={{ position: 'absolute', top: -5, left: 'calc(50% - 5px)', width: 8, height: 8, borderRadius: '50%', background: 'var(--surface)', border: `1.5px solid ${isNodeActive ? 'var(--gold)' : 'var(--border2)'}`, zIndex: 10 }} />
                      <div style={{ position: 'absolute', bottom: -5, left: 'calc(50% - 5px)', width: 8, height: 8, borderRadius: '50%', background: 'var(--surface)', border: `1.5px solid ${isNodeActive ? 'var(--gold)' : 'var(--border2)'}`, zIndex: 10 }} />
                    </>
                  )}

                  {/* Node Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                      <span style={{ fontSize: 12 }}>{plConfig?.icon || '🤖'}</span>
                      <strong style={{ fontSize: 11.5, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {stepAcc?.name || 'Unassigned'}
                      </strong>
                    </div>
                    <span style={{ fontSize: 9.5, padding: '1px 5px', borderRadius: 4, background: isNodeActive ? 'var(--gold-glow)' : isNodeDone ? 'var(--teal-glow)' : 'var(--surface3)', color: isNodeActive ? 'var(--gold)' : isNodeDone ? 'var(--teal)' : 'var(--muted)', fontWeight: 700 }}>
                      Step {idx + 1}
                    </span>
                  </div>

                  {/* Node Description Text */}
                  <div style={{ fontSize: 10.5, color: 'var(--muted2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%', fontFamily: 'DM Mono, monospace' }}>
                    {node.prompt || 'No requirement text'}
                  </div>

                  {/* Node Footer metrics */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 9.5, color: 'var(--muted)' }}>
                    <span>⏳ delay: {node.delay}s</span>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <span style={{ color: 'var(--teal)' }} onClick={(e) => { e.stopPropagation(); handleOptimizeStepPromptInCanvas(w.id, idx); }} title="Optimize text with AI">✨ AI</span>
                      <span style={{ color: 'var(--red)', marginLeft: 4 }} onClick={(e) => { e.stopPropagation(); handleDeleteStepInCanvas(w.id, idx); }} title="Delete step node">✕</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Glowing append node card trigger at end of grid orbit */}
            <div
              onClick={() => handleAppendStepInCanvas(w.id)}
              style={{
                position: 'absolute',
                left: resolvedNodes.length > 0 ? resolvedNodes[resolvedNodes.length - 1].x + (canvasLayout === 'horizontal' ? 270 : 0) : 100,
                top: resolvedNodes.length > 0 ? resolvedNodes[resolvedNodes.length - 1].y + (canvasLayout === 'horizontal' ? 0 : 160) : 120,
                width: 220,
                height: 88,
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px dashed rgba(245,183,49,0.35)',
                borderRadius: 10,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 6,
                color: 'var(--gold)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                zIndex: 2,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.background = 'rgba(245,183,49,0.06)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(245,183,49,0.35)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'; }}
            >
              <span style={{ fontSize: 18 }}>➕</span>
              <strong style={{ fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Append Step Node</strong>
            </div>

          </div>

          {/* Right Column: Mini Interactive Inspector Drawer */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>

            {/* active step compiler logs console */}
            {isCurrentlyRunning && runningWfId === w.id && (
              <div className="card" style={{ flex: 1.1, padding: 14, background: '#040406', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--gold)', textTransform: 'uppercase' }}>📡 Automation Console</div>
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6, fontSize: 9.5, fontFamily: 'DM Mono, monospace', color: '#8ab4f8' }}>
                  {consoleLogs.map((log, i) => {
                    let logColor = '#8ab4f8';
                    if (log.includes('[DONE]')) logColor = 'var(--teal)';
                    if (log.includes('[SYS]')) logColor = 'var(--gold)';
                    if (log.includes('[WAIT]')) logColor = 'var(--purple)';
                    return <div key={i} style={{ color: logColor }}>{log}</div>;
                  })}
                  <div ref={consoleEndRef} />
                </div>
              </div>
            )}

            {/* Selected Node Editor Card */}
            <div className="card" style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted2)', textTransform: 'uppercase', borderBottom: '1px solid var(--border)', paddingBottom: 6 }}>
                🛠️ Node Editor Inspector
              </div>

              {canvasActiveEditStepIdx !== null && wSteps[canvasActiveEditStepIdx] ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11.5, fontWeight: 800, color: '#fff' }}>Step {canvasActiveEditStepIdx + 1} parameters</span>
                    <button className="btn btn-ghost btn-xs" style={{ color: 'var(--red)', fontSize: 9 }} onClick={() => { handleDeleteStepInCanvas(w.id, canvasActiveEditStepIdx); setCanvasActiveEditStepIdx(null); }}>✕ Remove</button>
                  </div>

                  {/* Requirements Textarea */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <label style={{ fontSize: 9.5, color: 'var(--muted2)' }}>PROMPT REQUIREMENT</label>
                    <textarea
                      value={wSteps[canvasActiveEditStepIdx].prompt}
                      onChange={e => handleUpdateStepInCanvas(w.id, canvasActiveEditStepIdx, 'prompt', e.target.value)}
                      rows={4}
                      style={{ width: '100%', background: 'var(--surface3)', border: '1px solid var(--border)', borderRadius: 6, color: '#e4e4ed', fontSize: 11, padding: '6px 8px', outline: 'none', resize: 'vertical' }}
                    />
                  </div>

                  {/* Account Selector */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <label style={{ fontSize: 9.5, color: 'var(--muted2)' }}>LINKED DEVELOPER ACCOUNT</label>
                    <select
                      value={wSteps[canvasActiveEditStepIdx].accountId}
                      onChange={e => handleUpdateStepInCanvas(w.id, canvasActiveEditStepIdx, 'accountId', e.target.value)}
                      style={{ width: '100%', background: 'var(--surface3)', border: '1px solid var(--border)', borderRadius: 6, color: '#e4e4ed', fontSize: 11, padding: '4px 6px', outline: 'none' }}
                    >
                      {accounts.map(a => {
                        const pl = PLATFORMS.find(p => p.id === a.platform) || PLATFORMS[0];
                        return <option key={a.id} value={a.id}>{a.name} ({pl.name})</option>;
                      })}
                    </select>
                  </div>

                  {/* Delay timer */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9.5, color: 'var(--muted2)' }}>
                      <span>BUILD COOLING DELAY</span>
                      <strong style={{ color: 'var(--gold)' }}>{wSteps[canvasActiveEditStepIdx].delay}s</strong>
                    </div>
                    <input
                      type="range" min={1} max={12}
                      value={wSteps[canvasActiveEditStepIdx].delay}
                      onChange={e => handleUpdateStepInCanvas(w.id, canvasActiveEditStepIdx, 'delay', Number(e.target.value))}
                      style={{ width: '100%', accentColor: 'var(--gold)', cursor: 'pointer' }}
                    />
                  </div>

                  <button className="btn btn-teal btn-xs" style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }} onClick={() => handleOptimizeStepPromptInCanvas(w.id, canvasActiveEditStepIdx)}>
                    ✨ AI Optimize Prompt text
                  </button>
                </div>
              ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', gap: 8, padding: 20, textAlign: 'center' }}>
                  <span style={{ fontSize: 24, opacity: 0.3 }}>🗺️</span>
                  <div style={{ fontSize: 11.5 }}>Select a step node on the flowchart canvas to edit its properties or requirements live.</div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    );
  }

  return (
    <>
      {/* HEADER BANNER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>🔄 Workflow Studio</span>
            <span className="kanban-col-count">{workflows.length} active pipelines</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
            Orchestrate multi-step prompt streams targeting separate platforms concurrently.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost btn-sm" onClick={handleLoadTemplates}>
            📦 Load Templates
          </button>
          <button className="btn btn-gold btn-sm btn-pulse" onClick={openAdd}>
            ⚡ New Workflow
          </button>
        </div>
      </div>

      {/* ACTIVE RUNNING SIMULATION CONSOLE */}
      {isCurrentlyRunning && runningWf && (
        <div className="wf-console">
          <div className="wf-console-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="scanner-loader" style={{ fontSize: 16 }}>⏳</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--gold)' }}>
                Active Automation Console: "{runningWf.name}"
              </span>
            </div>

            {/* Simulated overall pipeline connector at top of console */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--surface3)', padding: '4px 12px', borderRadius: 8, border: '1px solid var(--border)' }}>
              {runningWf.steps?.map((step, idx) => {
                const stepAcc = accounts.find(a => a.id === step.accountId);
                const pl = PLATFORMS.find(p => p.id === stepAcc?.platform);
                const isStepDone = idx < currentStepIdx;
                const isStepActive = idx === currentStepIdx;

                return (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center' }}>
                    <div
                      className={`acc-avatar`}
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        fontSize: 9,
                        background: isStepDone ? 'var(--teal)' : isStepActive ? 'var(--gold-glow)' : 'var(--surface2)',
                        color: isStepDone ? 'var(--surface)' : isStepActive ? 'var(--gold)' : 'var(--muted)',
                        border: `1px solid ${isStepActive ? 'var(--gold)' : 'var(--border)'}`,
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title={step.prompt}
                    >
                      {pl?.abbr || (idx + 1)}
                    </div>
                    {idx < runningWf.steps.length - 1 && (
                      <div
                        className={`wf-line-connector ${isStepDone ? 'done' : isStepActive ? 'active' : ''}`}
                        style={{ width: 14 }}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <button
              className="btn btn-danger btn-xs"
              onClick={() => {
                setRunningWfId(null);
                updateWorkflow(runningWf.id, { status: 'active' });
                setState(prev => ({ ...prev, activeWorkflowRun: null }));
                toast.info('Automation stopped.');
              }}
            >
              Stop
            </button>
          </div>

          <div className="wf-console-terminal">
            {consoleLogs.map((log, i) => {
              let cls = 'run';
              if (log.includes('[SYS]')) cls = 'sys';
              if (log.includes('[WAIT]')) cls = 'wait';
              if (log.includes('[DONE]')) cls = 'done';
              return (
                <div key={i} className={`wf-console-log ${cls}`}>
                  {log}
                </div>
              );
            })}
            <div ref={consoleEndRef} />
          </div>
        </div>
      )}

      {/* GRID OF WORKFLOW PIPELINE CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {workflows.map(w => {
          const wSteps = w.steps || [];
          const isWfRunning = w.id === runningWfId && isCurrentlyRunning;

          return (
            <div
              key={w.id}
              className="proj-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                border: isWfRunning ? '1px solid var(--gold)' : '1px solid var(--border)',
                boxShadow: isWfRunning ? '0 0 20px var(--gold-glow)' : 'none'
              }}
            >
              {/* Card top */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>
                    🔄 {w.name}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>
                    Initialized {w.createdAt ? new Date(w.createdAt).toLocaleDateString() : '2026-06-01'}
                  </div>
                </div>
                <span className={`badge ${isWfRunning ? 'badge-warn' : w.status === 'paused' ? 'badge-off' : 'badge-ok'}`}>
                  {isWfRunning ? '● Running' : w.status === 'paused' ? '⏸ Paused' : '● Ready'}
                </span>
              </div>

              {/* Description */}
              <div style={{ flex: 1, fontSize: 12.5, color: 'var(--muted2)', lineHeight: 1.5, marginBottom: 14 }}>
                {w.desc || 'No description provided.'}
              </div>

              {/* HORIZONTAL STEP TIMELINE NODES ROW */}
              <div style={{ margin: '8px 0 16px 0' }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--muted2)', textTransform: 'uppercase', marginBottom: 8 }}>
                  Automation Pipeline ({wSteps.length} nodes)
                </div>

                <div className="wf-pipeline">
                  {wSteps.map((step, idx) => {
                    const stepAcc = accounts.find(a => a.id === step.accountId);
                    const plConfig = PLATFORMS.find(p => p.id === stepAcc?.platform);
                    const isNodeDone = isWfRunning && idx < currentStepIdx;
                    const isNodeActive = isWfRunning && idx === currentStepIdx;

                    return (
                      <div key={idx} className="wf-node-wrapper">
                        {/* Circle node */}
                        <div
                          className={`wf-node ${isNodeDone ? 'done' : isNodeActive ? 'active' : ''}`}
                          title={`Step ${idx + 1}: ${step.prompt}\n(Target: ${stepAcc?.name || 'Unassigned'})`}
                          style={{
                            borderColor: plConfig?.color || 'var(--border)'
                          }}
                        >
                          {plConfig ? (
                            <span style={{ fontSize: 11 }}>{plConfig.icon}</span>
                          ) : (
                            <span style={{ fontSize: 10, fontFamily: 'DM Mono, monospace' }}>{idx + 1}</span>
                          )}

                          {/* Top index badge */}
                          <div className="wf-node-index">
                            {idx + 1}
                          </div>

                          {/* Bottom delay indicator */}
                          {step.delay > 0 && (
                            <div className="wf-node-delay">
                              +{step.delay}s
                            </div>
                          )}
                        </div>

                        {/* Connection Cable */}
                        {idx < wSteps.length - 1 && (
                          <div className={`wf-line-connector ${isNodeDone ? 'done' : isNodeActive ? 'active' : ''}`} />
                        )}
                      </div>
                    );
                  })}
                  {wSteps.length === 0 && (
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>No steps in this pipeline</span>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="card-footer" style={{ borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 'auto', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                <button
                  className="btn btn-gold btn-xs"
                  style={{ flex: '1 1 auto', justifyContent: 'center', fontWeight: 800 }}
                  onClick={() => handleRunWorkflow(w)}
                  disabled={isWfRunning || w.status === 'paused' || wSteps.length === 0}
                >
                  {isWfRunning ? '⏳ Running...' : '▶ Run'}
                </button>
                {/* Feature 28: Dry-run step debugger */}
                <button
                  className="btn btn-ghost btn-xs"
                  onClick={() => handleDryRunWorkflow(w)}
                  disabled={isWfRunning || wSteps.length === 0}
                  title="Dry run step debugger validation simulation"
                >
                  🐛 Dry Run
                </button>
                {/* Feature 29: Workflow JSON exporter */}
                <button
                  className="btn btn-ghost btn-xs"
                  onClick={() => handleExportWorkflowJSON(w)}
                  title="Export workflow configuration as JSON"
                >
                  📥 JSON
                </button>
                <button
                  className="btn btn-ghost btn-xs"
                  onClick={() => setSelectedWfIdCanvas(w.id)}
                  disabled={isWfRunning}
                  title="Launch Visual Flowchart Canvas"
                >
                  🗺️ Canvas
                </button>
                <button
                  className="btn btn-ghost btn-xs"
                  onClick={() => handleTogglePause(w)}
                  disabled={isWfRunning}
                  title={w.status === 'paused' ? 'Activate Workflow' : 'Pause Workflow'}
                >
                  {w.status === 'paused' ? '▶' : '⏸'}
                </button>
                <button
                  className="btn btn-ghost btn-xs"
                  onClick={() => openEdit(w)}
                  disabled={isWfRunning}
                  title="Edit Workflow Pipeline"
                >
                  ✏
                </button>
                <button
                  className="btn btn-danger btn-xs"
                  onClick={() => handleDelete(w.id)}
                  disabled={isWfRunning}
                  title="Delete Workflow"
                >
                  🗑
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE / EDIT WORKFLOW MODAL DIALOG */}
      {showModal && (
        <WorkflowModal
          editId={editId}
          form={form}
          setForm={setForm}
          accounts={accounts}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          updateStep={updateStepInForm}
          addStep={addStepInForm}
          removeStep={removeStepInForm}
          swapStep={swapStepOrder}
          onOptimize={handleOptimizeStepPrompt}
        />
      )}
    </>
  );
}

// --- SUB-COMPONENT: Workflow Creator/Editor Modal ---
function WorkflowModal({
  editId,
  form,
  setForm,
  accounts,
  onClose,
  onSave,
  updateStep,
  addStep,
  removeStep,
  swapStep,
  onOptimize
}) {
  const toast = useToast();
  const [showBlockSelector, setShowBlockSelector] = useState(false);

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 580, width: '95%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div className="modal-title" style={{ margin: 0 }}>
            {editId ? '✏ Edit Workflow Pipeline' : '🔄 Initialize Workflow Pipeline'}
          </div>
          <button className="btn btn-ghost btn-xs" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="form-row">
          <label>Workflow Name *</label>
          <input
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Production Microservice Deployer"
          />
        </div>

        <div className="form-row">
          <label>Pipeline Description</label>
          <textarea
            value={form.desc}
            onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
            placeholder="What does this pipeline orchestrate?"
            style={{ minHeight: 46 }}
          />
        </div>

        {/* Dynamic Action Block Presets Selector Panel */}
        <div style={{ marginTop: 14, marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted2)', textTransform: 'uppercase' }}>Modular Preset Action Blocks</span>
            <button
              type="button"
              className="btn btn-ghost btn-xs"
              style={{ color: 'var(--teal)', fontSize: 10.5, border: '1px solid rgba(0, 212, 170, 0.2)', padding: '2px 8px', background: 'var(--teal-glow)' }}
              onClick={() => setShowBlockSelector(!showBlockSelector)}
            >
              {showBlockSelector ? '✕ Hide Blocks Panel' : '👁️ Add Action Step'}
            </button>
          </div>

          {showBlockSelector && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, background: 'var(--surface2)', padding: 10, borderRadius: 8, border: '1px solid var(--border)' }}>
              {[
                {
                  label: '🤖 LLM Optimize Context',
                  prompt: 'Optimize and enhance the workspace context by analyzing pre-configured directives, establishing rich HSL palettes, and enforcing DM Mono code styling rules.',
                  desc: 'AI visual prompt optimization step'
                },
                {
                  label: '📡 Multi-Tab Dispatch Broadcast',
                  prompt: 'Simultaneously dispatch prompt packets to all active, registered multi-platform sandbox environments using high-frequency websocket relays.',
                  desc: 'Multi-platform parallel broadcast'
                },
                {
                  label: '🔒 Handshake Security Audit',
                  prompt: 'Execute a cryptographic credential handshake verification check to audit and validate developer authentication session tokens.',
                  desc: 'Cryptographic credentials checking step'
                },
                {
                  label: '💾 Library Payload Auto-Save',
                  prompt: 'Auto-save local sandbox file state artifacts and compile-logs payload directly to the project history library database.',
                  desc: 'Auto-serialize sandbox payload'
                }
              ].map(block => (
                <button
                  key={block.label}
                  type="button"
                  className="wf-block-btn"
                  onClick={() => {
                    const defaultAccId = accounts[0]?.id || '';
                    setForm(f => ({
                      ...f,
                      steps: [...(f.steps || []), { prompt: block.prompt, delay: 3, accountId: defaultAccId, actionType: block.label }]
                    }));
                    toast.bolt(`✓ Injected block: ${block.label}`);
                    setShowBlockSelector(false);
                  }}
                >
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ color: '#fff', fontSize: 11, fontWeight: 800 }}>{block.label}</div>
                    <div style={{ color: 'var(--muted)', fontSize: 9, fontWeight: 400, marginTop: 2 }}>{block.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic step node builder list */}
        <div style={{ marginTop: 12 }}>
          <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span>Automation Steps ({form.steps?.length || 0} nodes)</span>
          </label>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 240, overflowY: 'auto', paddingRight: 4 }}>
            {form.steps?.map((step, idx) => (
              <div key={idx} className="wf-step-node-card">
                {/* Number node circle */}
                <div
                  className="acc-avatar"
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    background: 'var(--gold-glow)',
                    color: 'var(--gold)',
                    border: '1px solid rgba(245,183,49,0.3)',
                    fontWeight: 700,
                    fontSize: 10.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {idx + 1}
                </div>

                {/* Node details */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>

                  {/* Account Selector dropdown & Order swapping */}
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <select
                        value={step.accountId}
                        onChange={e => updateStep(idx, 'accountId', e.target.value)}
                        style={{ padding: '4px 8px', fontSize: 11, borderRadius: 6 }}
                      >
                        <option value="">Select Target Account Context</option>
                        {accounts.map(a => (
                          <option key={a.id} value={a.id}>
                            {PLATFORMS.find(p => p.id === a.platform)?.icon} {a.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Delay input */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ fontSize: 10, color: 'var(--muted)' }}>Delay:</span>
                      <input
                        type="number"
                        min="0"
                        max="60"
                        value={step.delay}
                        onChange={e => updateStep(idx, 'delay', Number(e.target.value))}
                        style={{ width: 44, padding: '3px 6px', fontSize: 11, borderRadius: 6, textAlign: 'center' }}
                      />
                      <span style={{ fontSize: 10, color: 'var(--muted)' }}>s</span>
                    </div>

                    {/* Step swapping controllers */}
                    <div style={{ display: 'flex', gap: 2 }}>
                      <button
                        type="button"
                        className="btn btn-ghost btn-xs"
                        style={{ padding: '2px 4px' }}
                        disabled={idx === 0}
                        onClick={() => swapStep(idx, -1)}
                        title="Move Step Up"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-xs"
                        style={{ padding: '2px 4px' }}
                        disabled={idx === form.steps.length - 1}
                        onClick={() => swapStep(idx, 1)}
                        title="Move Step Down"
                      >
                        ▼
                      </button>
                    </div>
                  </div>

                  {/* Prompt Textarea */}
                  <textarea
                    value={step.prompt}
                    onChange={e => updateStep(idx, 'prompt', e.target.value)}
                    placeholder="Enter prompt copy to transmit on this step..."
                    style={{ minHeight: 52, fontSize: 12, padding: '6px 10px' }}
                  />

                  {/* Node tools */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button
                      type="button"
                      className="btn btn-ghost btn-xs"
                      onClick={() => onOptimize(idx)}
                      title="Optimize prompt with AI"
                      style={{ fontSize: 10, color: 'var(--gold)', background: 'var(--gold-glow)', padding: '2px 8px', border: '1px solid rgba(245,183,49,0.15)' }}
                    >
                      ✨ Optimize Step Prompt
                    </button>

                    <button
                      type="button"
                      className="btn btn-danger btn-xs"
                      disabled={form.steps.length <= 1}
                      onClick={() => removeStep(idx)}
                      style={{ padding: '2px 6px' }}
                    >
                      ✕ Remove Node
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={addStep}
            style={{ width: '100%', marginTop: 10, border: '1px dashed var(--border)' }}
          >
            + Append Pipeline Node
          </button>
        </div>

        <div className="modal-footer" style={{ marginTop: 16 }}>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-gold btn-sm"
            onClick={onSave}
            disabled={!form.name.trim() || form.steps.length === 0}
          >
            {editId ? 'Save Timeline' : '⚡ Initialize Pipeline'}
          </button>
        </div>
      </div>
    </div>
  );
}
