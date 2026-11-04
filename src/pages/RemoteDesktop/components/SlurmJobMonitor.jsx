import React, { useState, useEffect } from 'react';

const INITIAL_JOBS = [
  { id: '92014', partition: 'gpu-a100', name: 'dist-ai-train', user: 'student', state: 'R', time: '02:14:05', nodes: 1, nodelist: 'c04' },
  { id: '92015', partition: 'gpu-v100', name: 'protein-fold', user: 'researcher', state: 'PD', time: '00:00:00', nodes: 2, nodelist: '(Resources)' },
  { id: '92018', partition: 'cpu-standard', name: 'genomics-alignment', user: 'bio-lab', state: 'R', time: '45:12', nodes: 4, nodelist: 'node[10-13]' },
];

const PARTITIONS = [
  { name: 'gpu-a100', status: 'UP', totalNodes: 16, allocatedNodes: 14, availGPUs: 8, maxTime: '7-00:00:00' },
  { name: 'gpu-v100', status: 'UP', totalNodes: 32, allocatedNodes: 28, availGPUs: 16, maxTime: '3-00:00:00' },
  { name: 'cpu-standard', status: 'UP', totalNodes: 128, allocatedNodes: 96, availGPUs: 0, maxTime: '14-00:00:00' },
  { name: 'debug', status: 'UP', totalNodes: 8, allocatedNodes: 2, availGPUs: 4, maxTime: '00:30:00' },
];

export default function SlurmJobMonitor() {
  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const [refreshInterval, setRefreshInterval] = useState(5000);
  const [lastRefreshed, setLastRefreshed] = useState(new Date().toLocaleTimeString());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  // sbatch form state
  const [jobName, setJobName] = useState('my-slurm-job');
  const [partition, setPartition] = useState('gpu-a100');
  const [nodes, setNodes] = useState(1);
  const [timeLimit, setTimeLimit] = useState('01:00:00');
  const [scriptContent, setScriptContent] = useState('#!/bin/bash\n#SBATCH --gres=gpu:1\necho "Running HPC workload..."\npython train.py');

  useEffect(() => {
    if (refreshInterval <= 0) return;
    const interval = setInterval(() => {
      setLastRefreshed(new Date().toLocaleTimeString());
      // simulate slight job time update or queue fluctuation
      setJobs(prev => prev.map(job => {
        if (job.state === 'R') {
          return { ...job, time: incrementTime(job.time) };
        }
        return job;
      }));
    }, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  const incrementTime = (timeStr) => {
    if (timeStr.includes(':') && timeStr.split(':').length === 2) {
      let [m, s] = timeStr.split(':').map(Number);
      s += 5;
      if (s >= 60) { m += 1; s = 0; }
      return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    return timeStr;
  };

  const handleSbatchSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(null);
    setTimeout(() => {
      const newJobId = String(Math.floor(10000 + Math.random() * 90000));
      const newJob = {
        id: newJobId,
        partition,
        name: jobName,
        user: 'student',
        state: 'PD',
        time: '00:00:00',
        nodes: Number(nodes),
        nodelist: '(Priority)'
      };
      setJobs([newJob, ...jobs]);
      setIsSubmitting(false);
      setSubmitSuccess(`Job #${newJobId} successfully submitted via sbatch!`);
    }, 1000);
  };

  const cancelJob = (id) => {
    setJobs(jobs.filter(j => j.id !== id));
  };

  return (
    <div style={{ padding: 24, color: '#e2e8f0', background: 'var(--bg)', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Header & Refresh Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            📊 Slurm HPC Cluster & Job Monitor
          </h2>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
            Connected to Campus HPC Cluster • Last Synced: <span style={{ color: '#38bdf8' }}>{lastRefreshed}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <label style={{ fontSize: 12, color: 'var(--muted)' }}>
            Refresh Interval:
            <select
              value={refreshInterval}
              onChange={e => setRefreshInterval(Number(e.target.value))}
              style={{
                marginLeft: 8,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 6,
                padding: '4px 8px',
                color: '#fff',
                fontSize: 12,
                cursor: 'pointer'
              }}
            >
              <option value={2000}>2s (Realtime)</option>
              <option value={5000}>5s (Default)</option>
              <option value={15000}>15s</option>
              <option value={30000}>30s</option>
              <option value={0}>Manual Only</option>
            </select>
          </label>
          <button
            onClick={() => setLastRefreshed(new Date().toLocaleTimeString())}
            style={{
              background: 'rgba(99,102,241,0.2)',
              border: '1px solid rgba(99,102,241,0.4)',
              color: '#818cf8',
              padding: '5px 12px',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 600
            }}
          >
            🔄 Refresh Now
          </button>
        </div>
      </div>

      {/* Partitions Status Grid */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#94a3b8', marginBottom: 12 }}>Cluster Partitions Status</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          {PARTITIONS.map(p => (
            <div key={p.name} style={{ background: 'var(--card)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: '#38bdf8', fontFamily: 'monospace' }}>{p.name}</span>
                <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 99, background: 'rgba(16,185,129,0.15)', color: '#10b981', fontWeight: 600 }}>{p.status}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div>Nodes: <strong style={{ color: '#fff' }}>{p.allocatedNodes} / {p.totalNodes}</strong> allocated</div>
                <div>GPUs Available: <strong style={{ color: '#10b981' }}>{p.availGPUs}</strong></div>
                <div>Max Time: <code style={{ fontSize: 11 }}>{p.maxTime}</code></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid Layout: Active Queue & Sbatch Submission */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 20 }}>
        
        {/* Active Queue Display */}
        <div style={{ background: 'var(--card)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Active Cluster Queue (`squeue`)</h3>
            <span style={{ fontSize: 11, background: 'rgba(56,189,248,0.1)', color: '#38bdf8', padding: '2px 8px', borderRadius: 6 }}>
              {jobs.length} Jobs Total
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'var(--muted)' }}>
                  <th style={{ padding: '8px' }}>JOBID</th>
                  <th style={{ padding: '8px' }}>PARTITION</th>
                  <th style={{ padding: '8px' }}>NAME</th>
                  <th style={{ padding: '8px' }}>ST</th>
                  <th style={{ padding: '8px' }}>TIME</th>
                  <th style={{ padding: '8px' }}>NODES</th>
                  <th style={{ padding: '8px', textAlign: 'right' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(job => (
                  <tr key={job.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '10px 8px', fontFamily: 'monospace', color: '#818cf8', fontWeight: 600 }}>{job.id}</td>
                    <td style={{ padding: '10px 8px' }}>{job.partition}</td>
                    <td style={{ padding: '10px 8px', fontWeight: 600 }}>{job.name}</td>
                    <td style={{ padding: '10px 8px' }}>
                      <span style={{
                        padding: '2px 6px',
                        borderRadius: 4,
                        fontSize: 10,
                        fontWeight: 700,
                        background: job.state === 'R' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)',
                        color: job.state === 'R' ? '#34d399' : '#fbbf24'
                      }}>
                        {job.state}
                      </span>
                    </td>
                    <td style={{ padding: '10px 8px', fontFamily: 'monospace' }}>{job.time}</td>
                    <td style={{ padding: '10px 8px' }}>{job.nodes}</td>
                    <td style={{ padding: '10px 8px', textAlign: 'right' }}>
                      <button
                        onClick={() => cancelJob(job.id)}
                        title="Cancel Job (scancel)"
                        style={{
                          background: 'rgba(239,68,68,0.15)',
                          border: 'none',
                          color: '#f87171',
                          padding: '4px 8px',
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontSize: 11,
                          fontWeight: 600
                        }}
                      >
                        scancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sbatch Submission Form */}
        <div style={{ background: 'var(--card)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 16px 0' }}>🚀 Submit Job (`sbatch`)</h3>

          {submitSuccess && (
            <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399', padding: '10px 12px', borderRadius: 8, fontSize: 12, marginBottom: 16 }}>
              {submitSuccess}
            </div>
          )}

          <form onSubmit={handleSbatchSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>Job Name</label>
                <input
                  type="text"
                  value={jobName}
                  onChange={e => setJobName(e.target.value)}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '8px 10px', color: '#fff', fontSize: 12 }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>Target Partition</label>
                <select
                  value={partition}
                  onChange={e => setPartition(e.target.value)}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '8px 10px', color: '#fff', fontSize: 12, cursor: 'pointer' }}
                >
                  {PARTITIONS.map(p => (
                    <option key={p.name} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>Nodes Count</label>
                <input
                  type="number"
                  min={1}
                  max={32}
                  value={nodes}
                  onChange={e => setNodes(e.target.value)}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '8px 10px', color: '#fff', fontSize: 12 }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>Time Limit (HH:MM:SS)</label>
                <input
                  type="text"
                  value={timeLimit}
                  onChange={e => setTimeLimit(e.target.value)}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '8px 10px', color: '#fff', fontSize: 12, fontFamily: 'monospace' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>Batch Script Content (`job.sh`)</label>
              <textarea
                value={scriptContent}
                onChange={e => setScriptContent(e.target.value)}
                rows={5}
                style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '10px', color: '#38bdf8', fontSize: 12, fontFamily: 'monospace', resize: 'vertical' }}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                background: isSubmitting ? 'rgba(99,102,241,0.3)' : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                border: 'none',
                color: '#fff',
                padding: '10px',
                borderRadius: 8,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                fontSize: 13,
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
                marginTop: 4
              }}
            >
              {isSubmitting ? '⏳ Submitting sbatch job...' : '🚀 Submit sbatch Job'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
