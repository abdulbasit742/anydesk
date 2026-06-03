import { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import { useStore } from './data/store';
import { supabase } from './lib/supabase';

/* ── Always-on components (small, needed immediately) ──────────── */
import Sidebar from './components/Sidebar';
import AddAccountModal from './modals/AddAccountModal';
import CommandPalette from './components/CommandPalette';
import ShortcutsModal from './components/ShortcutsModal';
import Scratchpad from './components/Scratchpad';
import CopilotWidget from './components/CopilotWidget';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './components/ToastSystem';
import { sound } from './lib/soundEngine';
import { brain } from './lib/brain';
import SystemStatusBar from './components/SystemStatusBar';
import { AuthGuard } from './components/AuthGuard';



/* ── Lazy page imports — each becomes its own async chunk ─────── */
const Dashboard           = lazy(() => import('./pages/Dashboard'));
const Analytics           = lazy(() => import('./pages/Analytics'));
const Accounts            = lazy(() => import('./pages/Accounts'));
const Broadcast           = lazy(() => import('./pages/Broadcast'));
const Projects            = lazy(() => import('./pages/Projects'));
const Workflows           = lazy(() => import('./pages/Workflows'));
const Library             = lazy(() => import('./pages/Library'));
const Optimizer           = lazy(() => import('./pages/Optimizer'));
const History             = lazy(() => import('./pages/History'));
const ScreenWall          = lazy(() => import('./pages/ScreenWall'));
const Settings            = lazy(() => import('./pages/Settings'));
const AutomationControl   = lazy(() => import('./pages/AutomationControl'));
const PromptQueue         = lazy(() => import('./pages/PromptQueue'));
const Vault               = lazy(() => import('./pages/Vault'));
const Terminal            = lazy(() => import('./pages/Terminal'));
const MissionControl      = lazy(() => import('./pages/MissionControl'));
const PromptBuilder       = lazy(() => import('./pages/PromptBuilder'));
const CreditMonitor       = lazy(() => import('./pages/CreditMonitor'));
const Scheduler           = lazy(() => import('./pages/Scheduler'));
const Notifications       = lazy(() => import('./pages/Notifications'));
const Comparison          = lazy(() => import('./pages/Comparison'));
const Templates           = lazy(() => import('./pages/Templates'));
const Integrations        = lazy(() => import('./pages/Integrations'));
const Reports             = lazy(() => import('./pages/Reports'));
const ResponseInbox       = lazy(() => import('./pages/ResponseInbox'));
const Sandbox             = lazy(() => import('./pages/Sandbox'));
const KnowledgeBase       = lazy(() => import('./pages/KnowledgeBase'));
const ChangeLog           = lazy(() => import('./pages/ChangeLog'));
const TeamHub             = lazy(() => import('./pages/TeamHub'));
const CostTracker         = lazy(() => import('./pages/CostTracker'));
const LiveConsole         = lazy(() => import('./pages/LiveConsole'));
const TokenAnalyzer       = lazy(() => import('./pages/TokenAnalyzer'));
const FeatureMarketplace  = lazy(() => import('./pages/FeatureMarketplace'));
const AgentWorkflows      = lazy(() => import('./pages/AgentWorkflows'));
const ApiIntegrations     = lazy(() => import('./pages/ApiIntegrations'));
const DevUtilities        = lazy(() => import('./pages/DevUtilities'));
const DataAnalytics       = lazy(() => import('./pages/DataAnalytics'));
const UiExtensions        = lazy(() => import('./pages/UiExtensions'));
const SecurityGuards      = lazy(() => import('./pages/SecurityGuards'));
const AiChat              = lazy(() => import('./pages/AiChat'));
const DeploymentCenter    = lazy(() => import('./pages/DeploymentCenter'));
const CodeEditor          = lazy(() => import('./pages/CodeEditor'));
const PerformanceProfiler = lazy(() => import('./pages/PerformanceProfiler'));
const CollaborationHub    = lazy(() => import('./pages/CollaborationHub'));
const CommandCenter       = lazy(() => import('./pages/CommandCenter'));
const AIInsights          = lazy(() => import('./pages/AIInsights'));
const AutoPromptEngine    = lazy(() => import('./pages/AutoPromptEngine'));
const MarketIntelligence  = lazy(() => import('./pages/MarketIntelligence'));
const AITraining          = lazy(() => import('./pages/AITraining'));
const DataPipeline        = lazy(() => import('./pages/DataPipeline'));
const NetworkMap          = lazy(() => import('./pages/NetworkMap'));
const SmartAlerts         = lazy(() => import('./pages/SmartAlerts'));
const UsageQuotas         = lazy(() => import('./pages/UsageQuotas'));
const PromptMarketplace   = lazy(() => import('./pages/PromptMarketplace'));
const ModelBenchmarks     = lazy(() => import('./pages/ModelBenchmarks'));
const WebScraper          = lazy(() => import('./pages/WebScraper'));
const ContainerManager    = lazy(() => import('./pages/ContainerManager'));
const LoadBalancer        = lazy(() => import('./pages/LoadBalancer'));
const DbManager           = lazy(() => import('./pages/DbManager'));
const LogAnalyzer         = lazy(() => import('./pages/LogAnalyzer'));
const AIAssistantHub      = lazy(() => import('./pages/AIAssistantHub'));
const EventStreamHub      = lazy(() => import('./pages/EventStreamHub'));
const PromptDNA           = lazy(() => import('./pages/PromptDNA'));
const AIModels            = lazy(() => import('./pages/AIModels'));
const Onboarding          = lazy(() => import('./pages/Onboarding'));
const GeoAnalytics        = lazy(() => import('./pages/GeoAnalytics'));
const ABTestManager       = lazy(() => import('./pages/ABTestManager'));
const AutonomousAgent     = lazy(() => import('./pages/AutonomousAgent'));
const SprintPlanner       = lazy(() => import('./pages/SprintPlanner'));
const RoadmapBuilder      = lazy(() => import('./pages/RoadmapBuilder'));
const BrandKitManager     = lazy(() => import('./pages/BrandKitManager'));
const PhysicsSimulation   = lazy(() => import('./pages/PhysicsSimulation'));
const EmailStudio         = lazy(() => import('./pages/EmailStudio'));
const LearningCenter      = lazy(() => import('./pages/LearningCenter'));
const ObservabilityHub    = lazy(() => import('./pages/ObservabilityHub'));
const VoiceCommander      = lazy(() => import('./pages/VoiceCommander'));
const MultiAgentOrchestrator = lazy(() => import('./pages/MultiAgentOrchestrator'));
const CryptoWallet        = lazy(() => import('./pages/CryptoWallet'));
const AIVideoStudio       = lazy(() => import('./pages/AIVideoStudio'));
const ActivityMap         = lazy(() => import('./pages/ActivityMap'));
const ArtifactStore       = lazy(() => import('./pages/ArtifactStore'));
const AuditCenter         = lazy(() => import('./pages/AuditCenter'));
const BackupManager       = lazy(() => import('./pages/BackupManager'));
const BuildMatrix         = lazy(() => import('./pages/BuildMatrix'));
const BuildStudio         = lazy(() => import('./pages/BuildStudio'));
const CICDPipeline        = lazy(() => import('./pages/CICDPipeline'));
const ConfigManager       = lazy(() => import('./pages/ConfigManager'));
const DeploymentGrid      = lazy(() => import('./pages/DeploymentGrid'));
const DockerComposer      = lazy(() => import('./pages/DockerComposer'));
const EnvironmentManager  = lazy(() => import('./pages/EnvironmentManager'));
const EventTimeline       = lazy(() => import('./pages/EventTimeline'));
const ExecutiveSummary    = lazy(() => import('./pages/ExecutiveSummary'));
const FileManager         = lazy(() => import('./pages/FileManager'));
const GitIntegration      = lazy(() => import('./pages/GitIntegration'));
const GlobalPulse         = lazy(() => import('./pages/GlobalPulse'));
const GraphQLStudio       = lazy(() => import('./pages/GraphQLStudio'));
const GRPCConsole         = lazy(() => import('./pages/GRPCConsole'));
const HealthCheck         = lazy(() => import('./pages/HealthCheck'));
const HTTPDebugger        = lazy(() => import('./pages/HTTPDebugger'));
const JSONFormatter       = lazy(() => import('./pages/JSONFormatter'));
const KPIDashboard        = lazy(() => import('./pages/KPIDashboard'));
const LicenseManager      = lazy(() => import('./pages/LicenseManager'));
const LiveFeed            = lazy(() => import('./pages/LiveFeed'));
const PlatformRadar       = lazy(() => import('./pages/PlatformRadar'));
const PluginManager       = lazy(() => import('./pages/PluginManager'));
const RegexTester         = lazy(() => import('./pages/RegexTester'));
const ReleaseManager      = lazy(() => import('./pages/ReleaseManager'));
const ResourceMonitor     = lazy(() => import('./pages/ResourceMonitor'));
const RESTExplorer        = lazy(() => import('./pages/RESTExplorer'));
const SSHManager          = lazy(() => import('./pages/SSHManager'));
const StatusBoard         = lazy(() => import('./pages/StatusBoard'));
const SystemHealth        = lazy(() => import('./pages/SystemHealth'));
const SystemLogsPage      = lazy(() => import('./pages/SystemLogsPage'));
const TestRunner          = lazy(() => import('./pages/TestRunner'));
const UpdateCenter        = lazy(() => import('./pages/UpdateCenter'));
const UptimeMonitor       = lazy(() => import('./pages/UptimeMonitor'));
const Landing             = lazy(() => import('./pages/Landing'));
const Pricing             = lazy(() => import('./pages/Pricing'));
const Signup              = lazy(() => import('./pages/Signup'));
const Login               = lazy(() => import('./pages/Login'));
const Billing             = lazy(() => import('./pages/Billing'));
const Admin               = lazy(() => import('./pages/Admin'));
const Affiliates          = lazy(() => import('./pages/Affiliates'));
const Referrals           = lazy(() => import('./pages/Referrals'));
const Privacy             = lazy(() => import('./pages/Privacy'));
const Terms               = lazy(() => import('./pages/Terms'));
const Docs                = lazy(() => import('./pages/Docs'));
const SystemStatus        = lazy(() => import('./pages/SystemStatus'));

/* ── Page loading skeleton ──────────────────────────────────────── */
function PageLoader() {
  return (
    <div className="page-loading">
      <div className="spinner" />
      <span style={{ fontSize: '0.78rem', color: 'var(--muted)', fontFamily: 'DM Mono, monospace' }}>
        Loading…
      </span>
    </div>
  );
}

/* ── Live Activity Ticker ───────────────────────────────────────── */
const TICKER_EVENTS = [
  { icon: '📡', text: 'Broadcast dispatched to Bolt.new workspace', color: 'var(--gold)' },
  { icon: '✓', text: 'Handshake confirmed — Lovable session active', color: 'var(--teal)' },
  { icon: '🔄', text: 'Workflow pipeline step 2/4 completed', color: 'var(--blue)' },
  { icon: '⚡', text: 'AI Optimizer enhanced prompt (clarity +34%)', color: 'var(--purple)' },
  { icon: '📊', text: 'Analytics telemetry refreshed — 7-day trend up', color: 'var(--teal)' },
  { icon: '🔒', text: 'Vault audit passed — AES-256 credentials verified', color: 'var(--gold)' },
  { icon: '📁', text: 'Kanban board task moved to “Done & Deployed”', color: 'var(--teal)' },
  { icon: '📡', text: 'Mission Queue executed 3 prompts successfully', color: 'var(--gold)' },
  { icon: '📶', text: 'Ping sweep complete — all accounts responding <30ms', color: 'var(--blue)' },
  { icon: '✨', text: 'Prompt library updated with new template variant', color: 'var(--purple)' },
];

function LiveActivityTicker({ accounts, broadcasts }) {
  const [tickerIdx, setTickerIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setTickerIdx(i => (i + 1) % TICKER_EVENTS.length);
        setVisible(true);
      }, 300);
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  const evt = TICKER_EVENTS[tickerIdx];
  const totalBc = broadcasts.length;
  const activeAcc = accounts.filter(a => a.status === 'active').length;

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 8000,
      height: 28,
      background: 'rgba(10,10,18,0.95)',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center',
      padding: '0 16px',
      gap: 16,
      fontSize: 10.5,
    }}>
      {/* Status pills */}
      <div style={{ display: 'flex', gap: 10, flexShrink: 0, alignItems: 'center' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--teal)', fontWeight: 700 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--teal)', display: 'inline-block', animation: 'pulse 2s infinite', boxShadow: '0 0 5px var(--teal)' }} />
          {activeAcc} active
        </span>
        <span style={{ color: 'rgba(255,255,255,0.12)' }}>|</span>
        <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{totalBc} broadcasts</span>
        <span style={{ color: 'rgba(255,255,255,0.12)' }}>|</span>
      </div>
      {/* Scrolling event */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', gap: 7, minWidth: 0,
        opacity: visible ? 1 : 0, transition: 'opacity 0.3s ease',
      }}>
        <span style={{ color: evt.color, fontSize: 11 }}>{evt.icon}</span>
        <span style={{ color: 'rgba(200,200,220,0.7)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'DM Mono, monospace' }}>
          {evt.text}
        </span>
      </div>
      {/* Right: branding + shortcut hint */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0, color: 'rgba(255,255,255,0.2)', fontSize: 9.5 }}>
        <span>Ctrl+Space — Command Palette</span>
        <span style={{ color: 'rgba(255,255,255,0.1)' }}>|</span>
        <span style={{ color: 'rgba(245,183,49,0.4)', fontWeight: 700 }}>⚡ BSP</span>
      </div>
    </div>
  );
}

/* ── All pages in order (for dot nav) ──────────────────────────── */
const PAGES = [
  { id: 'dashboard',       label: 'Dashboard',        emoji: '🏠' },
  { id: 'missioncontrol',  label: 'Mission Control',  emoji: '🛰️' },
  { id: 'analytics',       label: 'Analytics',        emoji: '📊' },
  { id: 'accounts',        label: 'My Accounts',      emoji: '🔌' },
  { id: 'creditmonitor',   label: 'Credit Monitor',   emoji: '💳' },
  { id: 'broadcast',       label: 'Broadcast Studio', emoji: '📡' },
  { id: 'screenwall',      label: 'Screen Wall',      emoji: '🖥' },
  { id: 'projects',        label: 'Projects',         emoji: '📁' },
  { id: 'workflows',       label: 'Workflows',        emoji: '⚙' },
  { id: 'scheduler',       label: 'Scheduler',        emoji: '⏱' },
  { id: 'automation',      label: 'Automation Control', emoji: '🚀' },
  { id: 'promptqueue',     label: 'Prompt Queue',     emoji: '🔁' },
  { id: 'library',         label: 'Prompt Library',   emoji: '📚' },
  { id: 'promptbuilder',   label: 'Prompt Builder',   emoji: '🧱' },
  { id: 'optimizer',       label: 'AI Optimizer',     emoji: '✨' },
  { id: 'templates',       label: 'Templates',        emoji: '📌' },
  { id: 'comparison',      label: 'Comparison',       emoji: '↔️' },
  { id: 'sandbox',         label: 'Sandbox',          emoji: '🧪' },
  { id: 'history',         label: 'History',          emoji: '🕓' },
  { id: 'responseinbox',   label: 'Response Inbox',   emoji: '📥' },
  { id: 'reports',         label: 'Reports',          emoji: '📊' },
  { id: 'notifications',   label: 'Notifications',    emoji: '🔔' },
  { id: 'integrations',    label: 'Integrations',     emoji: '🔗' },
  { id: 'teamhub',         label: 'Team Hub',         emoji: '👥' },
  { id: 'knowledgebase',   label: 'Knowledge Base',   emoji: '📖' },
  { id: 'changelog',       label: 'Changelog',        emoji: '📝' },
  { id: 'vault',           label: 'Security Vault',   emoji: '🔒' },
  { id: 'terminal',        label: 'AI Terminal',      emoji: '🖥️' },
  { id: 'costtracker',     label: 'Cost Tracker',     emoji: '💰' },
  { id: 'liveconsole',     label: 'Live Console',     emoji: '📺' },
  { id: 'autopromptengine',    label: 'Auto-Prompt',       emoji: '🎯' },
  { id: 'aiinsights',          label: 'AI Insights',       emoji: '💡' },
  { id: 'marketintelligence',  label: 'Market Intel',      emoji: '📈' },
  { id: 'aitraining',          label: 'AI Training',       emoji: '🧠' },
  { id: 'datapipeline',        label: 'Data Pipeline',     emoji: '🔀' },
  { id: 'networkmap',          label: 'Network Map',       emoji: '🌐' },
  { id: 'smartalerts',         label: 'Smart Alerts',      emoji: '🔔' },
  { id: 'usagequotas',         label: 'Usage & Quotas',    emoji: '📊' },
  { id: 'promptmarketplace',   label: 'Prompt Market',     emoji: '🏪' },
  { id: 'modelbenchmarks',     label: 'Model Benchmarks',  emoji: '🏆' },
  { id: 'webscraper',          label: 'Web Scraper',       emoji: '🕸️' },
  { id: 'containermanager',    label: 'Container Manager', emoji: '📦' },
  { id: 'loadbalancer',        label: 'Load Balancer',    emoji: '⚖️' },
  { id: 'dbmanager',           label: 'Db Manager',        emoji: '🗄️' },
  { id: 'loganalyzer',         label: 'Log Analyzer',      emoji: '📺' },
  { id: 'tokenanalyzer',       label: 'Token Analyzer',    emoji: '🔢' },
  { id: 'featuremarketplace',  label: 'Feature Market',    emoji: '🏪' },
  { id: 'agentworkflows',      label: 'Agent Workflows',   emoji: '🤖' },
  { id: 'apiintegrations',     label: 'API Integrations',  emoji: '🔗' },
  { id: 'devutilities',        label: 'Dev Utilities',     emoji: '🛠️' },
  { id: 'dataanalytics',       label: 'Data Analytics',    emoji: '📊' },
  { id: 'uiextensions',        label: 'UI Extensions',     emoji: '🎨' },
  { id: 'securityguards',      label: 'Security Guards',   emoji: '🛡️' },
  { id: 'aichat',              label: 'AI Chat',           emoji: '💬' },
  { id: 'deploymentcenter',    label: 'Deployment Center', emoji: '🚀' },
  { id: 'codeeditor',          label: 'Code Editor',       emoji: '💻' },
  { id: 'performanceprofiler', label: 'Perf Profiler',     emoji: '📈' },
  { id: 'collaborationhub',    label: 'Collab Hub',        emoji: '🤝' },
  { id: 'commandcenter',       label: 'Command Center',    emoji: '🎯' },
  { id: 'aiassistanthub',      label: 'AI Assistant Hub',  emoji: '🤖' },
  { id: 'eventstreamhub',      label: 'Event Stream Hub',  emoji: '⚡' },
  { id: 'promptdna',           label: 'Prompt DNA',        emoji: '🧬' },
  { id: 'aimodels',            label: 'AI Models',         emoji: '🧠' },
  { id: 'docs',            label: 'Help Center',      emoji: '📖' },
  { id: 'settings',        label: 'Settings',         emoji: '⚙️' },
  { id: 'systemstatus',    label: 'System Status',    emoji: '🌡️' },
  { id: 'landing',         label: 'Landing Page',     emoji: '🌐' },
  { id: 'pricing',         label: 'Pricing Plans',    emoji: '💳' },
  { id: 'signup',          label: 'Sign Up Screen',   emoji: '📝' },
  { id: 'login',           label: 'Login Screen',     emoji: '🔓' },
  { id: 'billing',         label: 'Billing Portal',   emoji: '💰' },
  { id: 'admin',           label: 'Admin Console',    emoji: '👑' },
  { id: 'affiliates',      label: 'Affiliates Program', emoji: '🤝' },
  { id: 'referrals',       label: 'Referrals Program',  emoji: '🎁' },
  { id: 'privacy',         label: 'Privacy Policy',   emoji: '🔒' },
  { id: 'terms',           label: 'Terms of Service', emoji: '📄' },
  { id: 'geoanalytics',    label: 'Geo Analytics',    emoji: '🗺️' },
  { id: 'abtestmanager',   label: 'A/B Testing',      emoji: '🧪' },
  { id: 'autonomousagent', label: 'Basit Auto Agent',  emoji: '🤖' },
  { id: 'physicssimulation', label: 'Anti-Gravity Lab', emoji: '🌌' },
  { id: 'sprintplanner',   label: 'Sprint Planner',   emoji: '📋' },
  { id: 'roadmapbuilder',  label: 'Roadmap Builder',  emoji: '🗺️' },
  { id: 'brandkitmanager', label: 'Brand Kit',        emoji: '🎨' },
  { id: 'emailstudio',             label: 'Email Studio',             emoji: '📧' },
  { id: 'learningcenter',          label: 'Learning Center',          emoji: '🎓' },
  { id: 'observabilityhub',        label: 'Observability Hub',        emoji: '🔭' },
  { id: 'voicecommander',          label: 'Voice Commander',          emoji: '🎙️' },
  { id: 'multiagentorchestrator',  label: 'Agent Orchestrator',       emoji: '🕹️' },
  { id: 'cryptowallet',            label: 'Crypto Wallet',            emoji: '👛' },
  { id: 'aivideostudio',           label: 'AI Video Studio',          emoji: '🎥' },
  { id: 'activitymap',             label: 'Activity Map',             emoji: '🗺️' },
  { id: 'artifactstore',           label: 'Artifact Store',           emoji: '📦' },
  { id: 'auditcenter',             label: 'Audit Center',             emoji: '🔍' },
  { id: 'backupmanager',           label: 'Backup Manager',           emoji: '💾' },
  { id: 'buildmatrix',             label: 'Build Matrix',             emoji: '🧱' },
  { id: 'buildstudio',             label: 'Build Studio',             emoji: '🏗️' },
  { id: 'cicdpipeline',            label: 'CI/CD Pipeline',           emoji: '🔄' },
  { id: 'configmanager',           label: 'Config Manager',           emoji: '⚙️' },
  { id: 'deploymentgrid',          label: 'Deployment Grid',          emoji: '🚀' },
  { id: 'dockercomposer',          label: 'Docker Composer',          emoji: '🐳' },
  { id: 'environmentmanager',      label: 'Environment Manager',      emoji: '🌿' },
  { id: 'eventtimeline',           label: 'Event Timeline',           emoji: '📅' },
  { id: 'executivesummary',        label: 'Executive Summary',        emoji: '📊' },
  { id: 'filemanager',             label: 'File Manager',             emoji: '🗂️' },
  { id: 'gitintegration',          label: 'Git Integration',          emoji: '🌿' },
  { id: 'globalpulse',             label: 'Global Pulse',             emoji: '🌍' },
  { id: 'graphqlstudio',           label: 'GraphQL Studio',           emoji: '🔷' },
  { id: 'grpcconsole',             label: 'gRPC Console',             emoji: '⚡' },
  { id: 'healthcheck',             label: 'Health Check',             emoji: '🩺' },
  { id: 'httpdebugger',            label: 'HTTP Debugger',            emoji: '🐛' },
  { id: 'jsonformatter',           label: 'JSON Formatter',           emoji: '{ }' },
  { id: 'kpidashboard',            label: 'KPI Dashboard',            emoji: '📈' },
  { id: 'licensemanager',          label: 'License Manager',          emoji: '🪪' },
  { id: 'livefeed',                label: 'Live Feed',                emoji: '📡' },
  { id: 'platformradar',           label: 'Platform Radar',           emoji: '📻' },
  { id: 'pluginmanager',           label: 'Plugin Manager',           emoji: '🔌' },
  { id: 'regextester',             label: 'Regex Tester',             emoji: '🔎' },
  { id: 'releasemanager',          label: 'Release Manager',          emoji: '🏷️' },
  { id: 'resourcemonitor',         label: 'Resource Monitor',         emoji: '📟' },
  { id: 'restexplorer',            label: 'REST Explorer',            emoji: '🌐' },
  { id: 'sshmanager',              label: 'SSH Manager',              emoji: '🔐' },
  { id: 'statusboard',             label: 'Status Board',             emoji: '🟢' },
  { id: 'systemhealth',            label: 'System Health',            emoji: '💚' },
  { id: 'systemlogspage',          label: 'System Logs',              emoji: '📋' },
  { id: 'testrunner',              label: 'Test Runner',              emoji: '🧪' },
  { id: 'updatecenter',            label: 'Update Center',            emoji: '🔃' },
  { id: 'uptimemonitor',           label: 'Uptime Monitor',           emoji: '⏱️' },
];

/* ── Premium Topbar ─────────────────────────────────────────────── */
function Topbar({ title, onNav, onConnect, onExport, accounts, broadcasts, theme, onToggleTheme, onMenuOpen }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ]       = useState('');
  const [showNotifs, setShowNotifs] = useState(false);

  // Feature 3: Sound Muted state synchronized with soundEngine
  const [muted, setMuted] = useState(() => sound.muted);
  const handleToggleMute = () => {
    const newVal = !sound.muted;
    sound.setMuted(newVal);
    setMuted(newVal);
    sound.play('click');
  };

  // Feature 4: Workspace environment context selector
  const [activeProfile, setActiveProfile] = useState('Production');
  const [showProfiles, setShowProfiles] = useState(false);

  // Feature 5: Telemetry stats scheduler
  const [telemetry, setTelemetry] = useState({ cpu: 18, mem: 16.4, latency: 24 });
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry({
        cpu: Math.floor(12 + Math.random() * 16),
        mem: +(16.1 + Math.random() * 0.8).toFixed(1),
        latency: Math.floor(18 + Math.random() * 14)
      });
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const todayBroadcasts  = broadcasts.filter(b => new Date(b.createdAt).toDateString() === new Date().toDateString());
  const expiredAccounts  = accounts.filter(a => a.status === 'expired_session');
  const notifCount       = expiredAccounts.length + (todayBroadcasts.length > 0 ? 1 : 0);

  // Global search: filter pages + accounts
  const searchResults = searchQ.trim().length > 1 ? [
    ...PAGES.filter(p => p.label.toLowerCase().includes(searchQ.toLowerCase())).map(p => ({ type: 'page', ...p })),
    ...accounts.filter(a => a.name.toLowerCase().includes(searchQ.toLowerCase())).map(a => ({ type: 'account', id: 'accounts', label: a.name, emoji: '👤', sub: a.platform })),
  ] : [];

  const pagesResults = searchResults.filter(r => r.type === 'page');
  const accountsResults = searchResults.filter(r => r.type === 'account');

  const handleSearchSelect = (item) => {
    onNav(item.id);
    setSearchOpen(false);
    setSearchQ('');
  };

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(s => !s); }
      if (e.key === 'Escape') { setSearchOpen(false); setShowNotifs(false); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div style={{
      height: 'var(--topbar-h)', borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12,
      background: 'rgba(14,14,22,0.8)', backdropFilter: 'blur(16px)',
      position: 'sticky', top: 0, zIndex: 100, flexShrink: 0,
    }}>
      {/* Mobile hamburger */}
      <button
        onClick={onMenuOpen}
        className="topbar-toggle"
        title="Open menu"
        aria-label="Open navigation"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Page title with Feature 4 profile selector */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{title}</div>
          <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2, display: 'flex', gap: 6 }}>
            <span>Bolt Studio Pro</span>
            <span>·</span>
            <span style={{ color: 'var(--gold)' }}>{accounts.length} account{accounts.length !== 1 ? 's' : ''}</span>
            {todayBroadcasts.length > 0 && <><span>·</span><span style={{ color: 'var(--teal)' }}>{todayBroadcasts.length} sent today</span></>}
          </div>
        </div>

        {/* Feature 4 Profile Switcher */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => { sound.play('click'); setShowProfiles(!showProfiles); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '4px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.06)',
              background: 'var(--surface2)', color: '#dde0f0', cursor: 'pointer', fontSize: 10.5,
              outline: 'none', transition: 'all 0.15s'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--gold)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
          >
            💼 <span>{activeProfile}</span>
            <span style={{ fontSize: 7, opacity: 0.6 }}>▼</span>
          </button>
          {showProfiles && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 6px)', left: 0, width: 140,
              background: 'var(--surface2)', border: '1px solid var(--border2)',
              borderRadius: 8, boxShadow: '0 8px 32px rgba(0,0,0,0.5)', overflow: 'hidden', zIndex: 1000,
            }}>
              {['Production', 'Staging', 'Dev Sandbox'].map(p => (
                <div
                  key={p}
                  onClick={() => {
                    sound.play('click');
                    setActiveProfile(p);
                    setShowProfiles(false);
                  }}
                  style={{
                    padding: '8px 12px', fontSize: 11, color: activeProfile === p ? 'var(--gold)' : '#dde0f0',
                    cursor: 'pointer', background: activeProfile === p ? 'var(--surface3)' : 'transparent',
                    fontFamily: 'DM Mono, monospace'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface3)'}
                  onMouseLeave={e => e.currentTarget.style.background = activeProfile === p ? 'var(--surface3)' : 'transparent'}
                >
                  {p}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Feature 5: Telemetry stats dashboard view */}
      <div style={{ display: 'flex', gap: 12, fontSize: 10, fontFamily: 'DM Mono, monospace', color: 'var(--muted2)', background: 'var(--surface2)', padding: '5px 12px', borderRadius: 8, border: '1px solid var(--border)', marginRight: 4, flexShrink: 0 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ color: 'var(--teal)', fontWeight: 700 }}>CPU</span> {telemetry.cpu}%</span>
        <span style={{ color: 'rgba(255,255,255,0.06)' }}>|</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ color: 'var(--purple)', fontWeight: 700 }}>MEM</span> {telemetry.mem}MB</span>
        <span style={{ color: 'rgba(255,255,255,0.06)' }}>|</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ color: 'var(--gold)', fontWeight: 700 }}>LAT</span> {telemetry.latency}ms</span>
      </div>

      {/* Global Search */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setSearchOpen(s => !s)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '6px 12px', borderRadius: 8, border: '1px solid var(--border)',
            background: 'var(--surface2)', color: 'var(--muted)', cursor: 'pointer',
            fontSize: 12, fontFamily: '"Syne", sans-serif',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)'; }}
        >
          <span>🔍</span>
          <span>Search</span>
          <span style={{ fontSize: 9, padding: '1px 5px', background: 'var(--surface3)', borderRadius: 4, fontFamily: 'DM Mono, monospace' }}>⌘K</span>
        </button>

        {/* Search Dropdown with Feature 6 category groupings */}
        {searchOpen && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: 320,
            background: 'var(--surface2)', border: '1px solid var(--border2)',
            borderRadius: 12, boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
            overflow: 'hidden', zIndex: 1000,
          }}>
            <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>
              <input
                autoFocus
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                placeholder="Search pages, accounts..."
                style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#e4e4ed', fontSize: 13 }}
              />
            </div>
            {searchQ.trim().length < 2 ? (
              <div style={{ padding: '8px 0' }}>
                <div style={{ fontSize: 10, color: 'var(--muted)', padding: '4px 14px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Quick Navigation</div>
                {PAGES.slice(0, 6).map(p => (
                  <div key={p.id} onClick={() => handleSearchSelect(p)}
                    style={{ padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5, color: '#d0d0e0', transition: 'background 0.1s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface3)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <span>{p.emoji}</span> {p.label}
                  </div>
                ))}
              </div>
            ) : (pagesResults.length > 0 || accountsResults.length > 0) ? (
              <div style={{ padding: '8px 0', maxHeight: 300, overflowY: 'auto' }}>
                
                {/* Feature 6 Pages results category */}
                {pagesResults.length > 0 && (
                  <div>
                    <div style={{ fontSize: 9, color: 'var(--gold)', padding: '6px 14px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.03)' }}>Workspace Pages</div>
                    {pagesResults.map(r => (
                      <div key={r.id} onClick={() => handleSearchSelect(r)}
                        style={{ padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5, color: '#d0d0e0', transition: 'background 0.1s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--surface3)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <span>{r.emoji}</span>
                        <span>{r.label}</span>
                        <span style={{ marginLeft: 'auto', fontSize: 9, color: 'var(--gold)', padding: '1px 5px', background: 'var(--gold-glow)', borderRadius: 4 }}>page</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Feature 6 Accounts results category */}
                {accountsResults.length > 0 && (
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', marginTop: 4, paddingTop: 4 }}>
                    <div style={{ fontSize: 9, color: 'var(--teal)', padding: '6px 14px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.03)' }}>Connected Integrations</div>
                    {accountsResults.map(r => (
                      <div key={r.label} onClick={() => handleSearchSelect(r)}
                        style={{ padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5, color: '#d0d0e0', transition: 'background 0.1s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--surface3)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <span>{r.emoji}</span>
                        <div>
                          <div>{r.label}</div>
                          {r.sub && <div style={{ fontSize: 10, color: 'var(--muted)' }}>{r.sub}</div>}
                        </div>
                        <span style={{ marginLeft: 'auto', fontSize: 9, color: 'var(--teal)', padding: '1px 5px', background: 'var(--teal-glow)', borderRadius: 4 }}>account</span>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--muted)', fontSize: 12 }}>No results for "{searchQ}"</div>
            )}
          </div>
        )}
      </div>

      {/* Notifications Bell */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setShowNotifs(s => !s)}
          style={{
            width: 36, height: 36, borderRadius: 9, border: '1px solid var(--border)',
            background: showNotifs ? 'var(--gold-glow)' : 'var(--surface2)',
            color: showNotifs ? 'var(--gold)' : 'var(--muted)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, position: 'relative', transition: 'all 0.15s',
          }}
        >
          🔔
          {notifCount > 0 && (
            <span style={{
              position: 'absolute', top: -4, right: -4,
              width: 16, height: 16, borderRadius: '50%',
              background: 'var(--red)', color: '#fff',
              fontSize: 8, fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid var(--surface)',
            }}>
              {notifCount}
            </span>
          )}
        </button>

        {showNotifs && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: 280,
            background: 'var(--surface2)', border: '1px solid var(--border2)',
            borderRadius: 12, boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
            overflow: 'hidden', zIndex: 1000,
          }}>
            <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#e4e4ed' }}>Notifications</span>
              {notifCount > 0 && <span style={{ fontSize: 9, padding: '2px 6px', background: 'var(--red)', color: '#fff', borderRadius: 999, fontWeight: 700 }}>{notifCount}</span>}
            </div>
            <div style={{ padding: '8px 0' }}>
              {expiredAccounts.map(a => (
                <div key={a.id}
                  onClick={() => { onNav('accounts'); setShowNotifs(false); }}
                  style={{ padding: '10px 14px', cursor: 'pointer', display: 'flex', gap: 10, alignItems: 'flex-start', transition: 'background 0.1s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface3)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ fontSize: 18 }}>⚠️</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#e4e4ed' }}>{a.name} session expired</div>
                    <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 2 }}>Reconnect this account to keep broadcasting</div>
                  </div>
                </div>
              ))}
              {todayBroadcasts.length > 0 && (
                <div
                  onClick={() => { onNav('history'); setShowNotifs(false); }}
                  style={{ padding: '10px 14px', cursor: 'pointer', display: 'flex', gap: 10, alignItems: 'flex-start', transition: 'background 0.1s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface3)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ fontSize: 18 }}>📡</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--teal)' }}>{todayBroadcasts.length} broadcasts today</div>
                    <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 2 }}>View full history →</div>
                  </div>
                </div>
              )}
              {notifCount === 0 && (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--muted)', fontSize: 12 }}>
                  ✓ All clear — nothing to action
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Dark / Light mode toggle */}
      <button
        onClick={onToggleTheme}
        title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        style={{
          width: 36, height: 36, borderRadius: 9, border: '1px solid var(--border)',
          background: 'var(--surface2)', color: 'var(--muted)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15,
          transition: 'all 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)'; }}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      {/* Sound Mute Toggle */}
      <button
        onClick={handleToggleMute}
        title={muted ? "Unmute sounds" : "Mute sounds"}
        style={{
          width: 36, height: 36, borderRadius: 9, border: '1px solid var(--border)',
          background: muted ? 'rgba(239,68,68,0.1)' : 'var(--surface2)',
          color: muted ? 'var(--red)' : 'var(--muted)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
          transition: 'all 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
      >
        {muted ? '🔇' : '🔊'}
      </button>

      {/* Export + Connect */}
      <button
        onClick={onExport}
        title="Export data"
        style={{
          width: 36, height: 36, borderRadius: 9, border: '1px solid var(--border)',
          background: 'var(--surface2)', color: 'var(--muted)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
          transition: 'all 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)'; }}
      >
        ⬇
      </button>

      <button className="btn btn-gold btn-sm btn-pulse" onClick={onConnect} style={{ fontSize: 12, padding: '6px 14px' }}>
        ⚡ Connect
      </button>
    </div>
  );
}

/* ── Dot Navigation Bar ─────────────────────────────────────────── */
function DotNav({ page, onNav }) {
  const currentIdx = PAGES.findIndex(p => p.id === page);
  const [hovered, setHovered] = useState(null);

  const goNext = useCallback(() => {
    onNav(PAGES[(currentIdx + 1) % PAGES.length].id);
  }, [currentIdx, onNav]);

  const goPrev = useCallback(() => {
    onNav(PAGES[(currentIdx - 1 + PAGES.length) % PAGES.length].id);
  }, [currentIdx, onNav]);

  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT' || e.target.isContentEditable) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goNext();
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext, goPrev]);

  return (
    <div style={{
      position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)',
      zIndex: 9999, display: 'flex', alignItems: 'center', gap: 6,
      padding: '8px 14px',
      background: 'rgba(14, 14, 22, 0.92)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999,
      boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(245,183,49,0.08)',
    }}>
      {/* Prev */}
      <button onClick={goPrev} title="Previous (←)" style={{
        width: 28, height: 28, borderRadius: '50%', border: 'none',
        background: 'rgba(255,255,255,0.06)', color: 'var(--muted)',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 14, transition: 'all 0.15s',
      }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,183,49,0.15)'; e.currentTarget.style.color = 'var(--gold)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'var(--muted)'; }}
      >‹</button>

      {/* Dots */}
      {PAGES.map((p) => {
        const isActive  = page === p.id;
        const isHovered = hovered === p.id;
        return (
          <div key={p.id} style={{ position: 'relative' }}>
            {isHovered && (
              <div style={{
                position: 'absolute', bottom: 'calc(100% + 10px)', left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(14,14,22,0.97)', border: '1px solid rgba(245,183,49,0.3)',
                borderRadius: 8, padding: '5px 10px', whiteSpace: 'nowrap',
                fontSize: 11, fontWeight: 700, color: '#e4e4ed', pointerEvents: 'none',
                boxShadow: '0 4px 16px rgba(0,0,0,0.4)', zIndex: 10000,
              }}>
                {p.emoji} {p.label}
                <div style={{
                  position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
                  borderLeft: '5px solid transparent', borderRight: '5px solid transparent',
                  borderTop: '5px solid rgba(245,183,49,0.3)',
                }} />
              </div>
            )}
            <button
              onClick={() => onNav(p.id)}
              onMouseEnter={() => setHovered(p.id)}
              onMouseLeave={() => setHovered(null)}
              title={p.label}
              style={{
                width: isActive ? 28 : 10, height: 10, borderRadius: 999, border: 'none', cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                background: isActive
                  ? 'linear-gradient(90deg, #f5b731, #e0a020)'
                  : isHovered ? 'rgba(245,183,49,0.5)' : 'rgba(255,255,255,0.2)',
                boxShadow: isActive ? '0 0 10px rgba(245,183,49,0.5)' : 'none',
                padding: 0,
              }}
            />
          </div>
        );
      })}

      {/* Next */}
      <button onClick={goNext} title="Next (→)" style={{
        width: 28, height: 28, borderRadius: '50%', border: 'none',
        background: 'linear-gradient(135deg,rgba(245,183,49,.2),rgba(245,183,49,.1))',
        color: 'var(--gold)', cursor: 'pointer', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: 14, fontWeight: 700, transition: 'all 0.15s',
        boxShadow: '0 0 8px rgba(245,183,49,0.2)',
      }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,183,49,0.3)'; e.currentTarget.style.transform = 'scale(1.1)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg,rgba(245,183,49,.2),rgba(245,183,49,.1))'; e.currentTarget.style.transform = 'scale(1)'; }}
      >›</button>

      {/* Counter */}
      <div style={{
        fontSize: 10, fontWeight: 700, color: 'var(--muted)',
        paddingLeft: 6, borderLeft: '1px solid rgba(255,255,255,0.1)',
        minWidth: 32, textAlign: 'center', fontFamily: 'DM Mono, monospace',
      }}>
        {currentIdx + 1}/{PAGES.length}
      </div>
    </div>
  );
}

/* ── Main App ────────────────────────────────────────────────────── */
export default function App() {
  const getInitialPage = () => {
    const path = window.location.pathname;
    if (path === '/') return 'landing';
    if (path === '/login') return 'login';
    if (path === '/signup') return 'signup';
    if (path === '/onboarding') return 'onboarding';
    if (path === '/pricing') return 'pricing';
    if (path === '/billing') return 'billing';
    const p = path.slice(1);
    return p || 'landing';
  };

  const [page, setPage]             = useState(getInitialPage);
  const [showConnect, setShowConnect] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showScratchpad, setShowScratchpad] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('agentflow_theme') || 'dark');
  const { accounts, broadcasts, workflows, exportData, setState } = useStore();

  // Sync URL when page state changes
  useEffect(() => {
    const currentPath = window.location.pathname;
    const targetPath = page === 'landing' ? '/' : `/${page}`;
    if (currentPath !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
  }, [page]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setPage(getInitialPage());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Apply theme to body
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('agentflow_theme', theme);
  }, [theme]);

  // Start automation brain
  useEffect(() => {
    brain.start(60000);
    window.__brain = brain;
    return () => brain.stop();
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(t => t === 'dark' ? 'light' : 'dark');
  }, []);

  useEffect(() => {
    const publicPages = ['landing', 'pricing', 'signup', 'login', 'onboarding', 'forgot-password', 'privacy', 'terms'];
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (!currentSession) {
        if (!publicPages.includes(page)) {
          setPage('landing');
        }
      } else {
        if (['landing', 'login', 'signup'].includes(page)) {
          setPage('dashboard');
        }
        setState(prev => ({
          ...prev,
          user: currentSession.user,
          plan: currentSession.user.plan || prev.plan || 'trial',
        }));
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (!currentSession) {
        setState(prev => ({ ...prev, user: null, plan: 'free' }));
        if (!publicPages.includes(page)) {
          setPage('landing');
        }
      } else {
        setState(prev => ({
          ...prev,
          user: currentSession.user,
          plan: currentSession.user.plan || prev.plan || 'trial',
        }));
        if (['landing', 'login', 'signup'].includes(page)) {
          setPage('dashboard');
        }
      }
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [page, setState]);

  const onNav        = useCallback((p) => {

    sound.play('click');
    if (p === 'scratchpad') {
      setShowScratchpad(true);
    } else {
      setPage(p);
    }
  }, []);
  const onConnect    = useCallback(() => setShowConnect(true), []);
  const onCloseConnect = useCallback(() => setShowConnect(false), []);

  // Global Ctrl+Space → Command Palette | ? → Shortcuts | N → Scratchpad
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT' || e.target.isContentEditable) return;
      if ((e.ctrlKey || e.metaKey) && e.code === 'Space') {
        e.preventDefault();
        setShowPalette(s => !s);
      }
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowShortcuts(s => !s);
      }
      if ((e.key === 'n' || e.key === 'N') && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowScratchpad(s => !s);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const renderPage = () => {
    switch (page) {
      case 'dashboard':      return <Dashboard       onNav={onNav} onConnect={onConnect} />;
      case 'missioncontrol': return <MissionControl  onNav={onNav} />;
      case 'analytics':      return <Analytics       onNav={onNav} />;
      case 'accounts':       return <Accounts        onConnect={onConnect} />;
      case 'creditmonitor':  return <CreditMonitor   onNav={onNav} />;
      case 'broadcast':      return <Broadcast       onNav={onNav} />;
      case 'projects':       return <Projects        onNav={onNav} />;
      case 'workflows':      return <Workflows       onNav={onNav} />;
      case 'scheduler':      return <Scheduler       onNav={onNav} />;
      case 'automation':     return <AutomationControl onNav={onNav} />;
      case 'promptqueue':    return <PromptQueue />;
      case 'library':        return <Library         onNav={onNav} />;
      case 'promptbuilder':  return <PromptBuilder   onNav={onNav} />;
      case 'optimizer':      return <Optimizer       onNav={onNav} />;
      case 'templates':      return <Templates       onNav={onNav} />;
      case 'comparison':     return <Comparison      onNav={onNav} />;
      case 'sandbox':        return <Sandbox         onNav={onNav} />;
      case 'history':        return <History         onNav={onNav} />;
      case 'responseinbox':  return <ResponseInbox   onNav={onNav} />;
      case 'reports':        return <Reports         onNav={onNav} />;
      case 'notifications':  return <Notifications   onNav={onNav} />;
      case 'integrations':   return <Integrations    onNav={onNav} />;
      case 'teamhub':        return <TeamHub         onNav={onNav} />;
      case 'knowledgebase':  return <KnowledgeBase   onNav={onNav} />;
      case 'changelog':      return <ChangeLog       onNav={onNav} />;
      case 'screenwall':     return <ScreenWall      onConnect={onConnect} />;
      case 'vault':          return <Vault />;
      case 'terminal':       return <Terminal        onNav={onNav} />;
      case 'costtracker':    return <CostTracker     onNav={onNav} />;
      case 'liveconsole':    return <LiveConsole     onNav={onNav} />;
      case 'tokenanalyzer':  return <TokenAnalyzer   onNav={onNav} />;
      case 'featuremarketplace': return <FeatureMarketplace onNav={onNav} />;
      case 'agentworkflows':    return <AgentWorkflows    onNav={onNav} />;
      case 'apiintegrations':   return <ApiIntegrations   onNav={onNav} />;
      case 'devutilities':      return <DevUtilities      onNav={onNav} />;
      case 'dataanalytics':     return <DataAnalytics     onNav={onNav} />;
      case 'uiextensions':      return <UiExtensions      onNav={onNav} />;
      case 'securityguards':    return <SecurityGuards    onNav={onNav} />;
      case 'aichat':            return <AiChat            onNav={onNav} />;
      case 'deploymentcenter':  return <DeploymentCenter  onNav={onNav} />;
      case 'codeeditor':        return <CodeEditor         onNav={onNav} />;
      case 'performanceprofiler': return <PerformanceProfiler onNav={onNav} />;
      case 'collaborationhub':  return <CollaborationHub  onNav={onNav} />;
      case 'commandcenter':       return <CommandCenter       onNav={onNav} />;
      case 'autopromptengine':    return <AutoPromptEngine    onNav={onNav} />;
      case 'aiinsights':          return <AIInsights          onNav={onNav} />;
      case 'marketintelligence':  return <MarketIntelligence  onNav={onNav} />;
      case 'aitraining':          return <AITraining          onNav={onNav} />;
      case 'datapipeline':        return <DataPipeline        onNav={onNav} />;
      case 'networkmap':          return <NetworkMap          onNav={onNav} />;
      case 'smartalerts':         return <SmartAlerts         onNav={onNav} />;
      case 'usagequotas':         return <UsageQuotas         onNav={onNav} />;
      case 'promptmarketplace':   return <PromptMarketplace   onNav={onNav} />;
      case 'modelbenchmarks':     return <ModelBenchmarks     onNav={onNav} />;
      case 'webscraper':          return <WebScraper          onNav={onNav} />;
      case 'containermanager':    return <ContainerManager />;
      case 'loadbalancer':        return <LoadBalancer />;
      case 'dbmanager':           return <DbManager />;
      case 'loganalyzer':         return <LogAnalyzer />;
      case 'aiassistanthub':      return <AIAssistantHub   onNav={onNav} />;
      case 'eventstreamhub':      return <EventStreamHub   onNav={onNav} />;
      case 'promptdna':           return <PromptDNA        onNav={onNav} />;
      case 'aimodels':            return <AIModels         onNav={onNav} />;
      case 'onboarding':          return <Onboarding       onNav={onNav} />;
      case 'geoanalytics':        return <GeoAnalytics      onNav={onNav} />;
      case 'abtestmanager':       return <ABTestManager     onNav={onNav} />;
      case 'autonomousagent':     return <AutonomousAgent   onNav={onNav} />;
      case 'physicssimulation':   return <PhysicsSimulation onNav={onNav} />;
      case 'sprintplanner':       return <SprintPlanner     onNav={onNav} />;
      case 'roadmapbuilder':      return <RoadmapBuilder    onNav={onNav} />;
      case 'brandkitmanager':     return <BrandKitManager   onNav={onNav} />;
      case 'emailstudio':             return <EmailStudio onNav={onNav} />;
      case 'learningcenter':          return <LearningCenter onNav={onNav} />;
      case 'observabilityhub':        return <ObservabilityHub onNav={onNav} />;
      case 'voicecommander':          return <VoiceCommander onNav={onNav} />;
      case 'multiagentorchestrator':  return <MultiAgentOrchestrator onNav={onNav} />;
      case 'cryptowallet':            return <CryptoWallet onNav={onNav} />;
      case 'aivideostudio':           return <AIVideoStudio onNav={onNav} />;
      case 'activitymap':             return <ActivityMap onNav={onNav} />;
      case 'artifactstore':           return <ArtifactStore onNav={onNav} />;
      case 'auditcenter':             return <AuditCenter onNav={onNav} />;
      case 'backupmanager':           return <BackupManager onNav={onNav} />;
      case 'buildmatrix':             return <BuildMatrix onNav={onNav} />;
      case 'buildstudio':             return <BuildStudio onNav={onNav} />;
      case 'cicdpipeline':            return <CICDPipeline onNav={onNav} />;
      case 'configmanager':           return <ConfigManager onNav={onNav} />;
      case 'deploymentgrid':          return <DeploymentGrid onNav={onNav} />;
      case 'dockercomposer':          return <DockerComposer onNav={onNav} />;
      case 'environmentmanager':      return <EnvironmentManager onNav={onNav} />;
      case 'eventtimeline':           return <EventTimeline onNav={onNav} />;
      case 'executivesummary':        return <ExecutiveSummary onNav={onNav} />;
      case 'filemanager':             return <FileManager onNav={onNav} />;
      case 'gitintegration':          return <GitIntegration onNav={onNav} />;
      case 'globalpulse':             return <GlobalPulse onNav={onNav} />;
      case 'graphqlstudio':           return <GraphQLStudio onNav={onNav} />;
      case 'grpcconsole':             return <GRPCConsole onNav={onNav} />;
      case 'healthcheck':             return <HealthCheck onNav={onNav} />;
      case 'httpdebugger':            return <HTTPDebugger onNav={onNav} />;
      case 'jsonformatter':           return <JSONFormatter onNav={onNav} />;
      case 'kpidashboard':            return <KPIDashboard onNav={onNav} />;
      case 'licensemanager':          return <LicenseManager onNav={onNav} />;
      case 'livefeed':                return <LiveFeed onNav={onNav} />;
      case 'platformradar':           return <PlatformRadar onNav={onNav} />;
      case 'pluginmanager':           return <PluginManager onNav={onNav} />;
      case 'regextester':             return <RegexTester onNav={onNav} />;
      case 'releasemanager':          return <ReleaseManager onNav={onNav} />;
      case 'resourcemonitor':         return <ResourceMonitor onNav={onNav} />;
      case 'restexplorer':            return <RESTExplorer onNav={onNav} />;
      case 'sshmanager':              return <SSHManager onNav={onNav} />;
      case 'statusboard':             return <StatusBoard onNav={onNav} />;
      case 'systemhealth':            return <SystemHealth onNav={onNav} />;
      case 'systemlogspage':          return <SystemLogsPage onNav={onNav} />;
      case 'testrunner':              return <TestRunner onNav={onNav} />;
      case 'updatecenter':            return <UpdateCenter onNav={onNav} />;
      case 'uptimemonitor':           return <UptimeMonitor onNav={onNav} />;
      case 'settings':       return <Settings        onNav={onNav} />;
      case 'systemstatus':   return <SystemStatus    onNav={onNav} />;
      case 'docs':           return <Docs            onNav={onNav} />;
      case 'landing':        return <Landing         onNav={onNav} />;
      case 'pricing':        return <Pricing         onNav={onNav} />;
      case 'signup':         return <Signup          onNav={onNav} />;
      case 'login':          return <Login           onNav={onNav} />;
      case 'forgot-password': return <Login          onNav={onNav} initialShowForgotPassword={true} />;
      case 'billing':        return <Billing         onNav={onNav} />;
      case 'admin':          return <Admin           onNav={onNav} />;
      case 'affiliates':     return <Affiliates      onNav={onNav} />;
      case 'referrals':      return <Referrals       onNav={onNav} />;
      case 'privacy':        return <Privacy         onNav={onNav} />;
      case 'terms':          return <Terms           onNav={onNav} />;
      default:               return <Dashboard       onNav={onNav} onConnect={onConnect} />;
    }
  };

  const isPublicPage = ['landing', 'pricing', 'signup', 'login', 'onboarding', 'forgot-password', 'privacy', 'terms'].includes(page);

  if (isPublicPage) {
    return (
      <ToastProvider>
        <div style={{ backgroundColor: '#0a0a0f', minHeight: '100vh', color: '#e2e8f0' }}>
          <ErrorBoundary onNav={onNav}>
            <Suspense fallback={<PageLoader />}>
              {renderPage()}
            </Suspense>
          </ErrorBoundary>
        </div>
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <AuthGuard>
        <div className="app">
          {/* Mobile sidebar backdrop */}
          {sidebarOpen && (
            <div
              className="sidebar-backdrop"
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
          )}

          <Sidebar
            page={page}
            onNav={(p) => { onNav(p); setSidebarOpen(false); }}
            accounts={accounts}
            broadcasts={broadcasts}
            workflows={workflows}
            onConnect={onConnect}
            className={sidebarOpen ? 'sidebar-open' : ''}
          />
          <div className="main">
            <Topbar
              title={PAGES.find(p => p.id === page)?.label || 'Dashboard'}
              onNav={onNav}
              onExport={exportData}
              onConnect={onConnect}
              accounts={accounts}
              broadcasts={broadcasts}
              theme={theme}
              onToggleTheme={toggleTheme}
              onMenuOpen={() => setSidebarOpen(s => !s)}
            />
            <div className="content">
              <ErrorBoundary onNav={onNav}>
                <Suspense fallback={<PageLoader />}>
                  {renderPage()}
                </Suspense>
              </ErrorBoundary>
              <DotNav page={page} onNav={onNav} />
              <div style={{ height: 60 }} />
            </div>
          </div>
          <AddAccountModal open={showConnect} onClose={onCloseConnect} />
          <CommandPalette
            open={showPalette}
            onClose={() => setShowPalette(false)}
            onNav={(p) => { onNav(p); setShowPalette(false); }}
            onConnect={() => { onConnect(); setShowPalette(false); }}
            onExport={exportData}
          />
          <ShortcutsModal open={showShortcuts} onClose={() => setShowShortcuts(false)} />
          <Scratchpad open={showScratchpad} onClose={() => setShowScratchpad(false)} />
          <SystemStatusBar onNav={onNav} />
          <LiveActivityTicker accounts={accounts} broadcasts={broadcasts} />
          <CopilotWidget onNav={onNav} currentPage={page} />
        </div>
      </AuthGuard>
    </ToastProvider>
  );
}
