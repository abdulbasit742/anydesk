import { useState, useEffect } from 'react';

const QUANTUM_ALGORITHMS = [
  { name: "Shor's Algorithm", desc: 'Integer factorization — breaks RSA encryption', qubits: 4096, status: 'simulating', speedup: '2^512x' },
  { name: "Grover's Search", desc: 'Unstructured database search in O(√N)', qubits: 256, status: 'complete', speedup: '√N' },
  { name: 'VQE Optimizer', desc: 'Variational Quantum Eigensolver for chemistry', qubits: 72, status: 'simulating', speedup: 'Exponential' },
  { name: 'QAOA Circuit', desc: 'Quantum Approximate Optimization Algorithm', qubits: 128, status: 'queued', speedup: 'Polynomial' },
  { name: 'Quantum ML', desc: 'Quantum-enhanced machine learning kernels', qubits: 512, status: 'complete', speedup: 'Quadratic' },
];

function QuantumGate({ label, x, y }) {
  return (
    <div style={{
      position: 'absolute',
      left: x, top: y,
      width: 32, height: 32,
      background: 'rgba(99,102,241,0.8)',
      border: '1px solid rgba(99,102,241,0.6)',
      borderRadius: 4,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 10,
      fontWeight: 700,
      color: '#fff',
      fontFamily: 'DM Mono, monospace',
      boxShadow: '0 0 10px rgba(99,102,241,0.5)',
    }}>
      {label}
    </div>
  );
}

const INITIAL_QUBITS = Array.from({ length: 8 }, (_, i) => ({ state: i % 2, phase: (i * Math.PI) / 4 }));

export default function QuantumExploration() {
  const [selected, setSelected] = useState(0);
  const [qubits, setQubits] = useState(INITIAL_QUBITS);

  useEffect(() => {
    const interval = setInterval(() => {
      setQubits(prev => prev.map(q => ({
        state: Math.random() > 0.5 ? 1 : 0,
        phase: (q.phase + 0.1) % (Math.PI * 2),
      })));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const alg = QUANTUM_ALGORITHMS[selected];

  return (
    <div style={{ padding: 24, color: '#e2e8f0', minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>⚛️ Quantum Exploration</h1>
        <p style={{ color: 'var(--muted)', fontSize: 13 }}>
          Simulate quantum algorithms and explore quantum computing concepts.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16, marginBottom: 20 }}>
        {/* Algorithm selector */}
        <div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Algorithms
          </div>
          {QUANTUM_ALGORITHMS.map((a, i) => (
            <div
              key={a.name}
              onClick={() => setSelected(i)}
              style={{
                padding: '12px 14px',
                background: selected === i ? 'rgba(99,102,241,0.15)' : 'var(--card)',
                border: `1px solid ${selected === i ? '#6366f1' : 'rgba(255,255,255,0.06)'}`,
                borderRadius: 8,
                marginBottom: 8,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{a.name}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>{a.qubits} qubits</div>
            </div>
          ))}
        </div>

        {/* Visualization panel */}
        <div style={{ background: 'var(--card)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{alg.name}</h3>
              <p style={{ fontSize: 12, color: 'var(--muted)' }}>{alg.desc}</p>
            </div>
            <span style={{
              fontSize: 10, padding: '3px 9px', borderRadius: 99,
              background: alg.status === 'complete' ? 'rgba(16,185,129,0.12)' :
                         alg.status === 'simulating' ? 'rgba(99,102,241,0.12)' : 'rgba(245,158,11,0.12)',
              color: alg.status === 'complete' ? '#10b981' :
                     alg.status === 'simulating' ? '#6366f1' : '#f59e0b',
              height: 'fit-content',
              fontWeight: 600,
              textTransform: 'capitalize',
            }}>
              {alg.status}
            </span>
          </div>

          {/* Qubit state visualization */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8 }}>Qubit States</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {qubits.map((q, i) => (
                <div key={i} style={{
                  width: 36, height: 36,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${q.state ? '#6366f1' : '#10b981'}44, ${q.state ? '#6366f1' : '#10b981'}11)`,
                  border: `2px solid ${q.state ? '#6366f1' : '#10b981'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontFamily: 'DM Mono, monospace',
                  fontWeight: 700,
                  color: q.state ? '#6366f1' : '#10b981',
                  boxShadow: `0 0 8px ${q.state ? '#6366f1' : '#10b981'}44`,
                  transition: 'all 0.5s ease',
                }}>
                  |{q.state}⟩
                </div>
              ))}
            </div>
          </div>

          {/* Circuit visualization */}
          <div style={{
            background: 'rgba(0,0,0,0.4)',
            borderRadius: 8,
            height: 80,
            position: 'relative',
            overflow: 'hidden',
            marginBottom: 14,
            border: '1px solid rgba(255,255,255,0.04)',
          }}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{
                position: 'absolute',
                left: 0, right: 0,
                top: 10 + i * 18,
                height: 1,
                background: 'rgba(255,255,255,0.15)',
              }} />
            ))}
            <QuantumGate label="H" x={30} y={4} />
            <QuantumGate label="X" x={80} y={22} />
            <QuantumGate label="CNOT" x={130} y={4} />
            <QuantumGate label="T" x={190} y={40} />
            <QuantumGate label="M" x={240} y={4} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {[
              { label: 'Qubits', value: alg.qubits },
              { label: 'Speedup', value: alg.speedup },
              { label: 'Gate Depth', value: alg.qubits * 2 },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 6, padding: '8px 10px' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#6366f1' }}>{s.value}</div>
                <div style={{ fontSize: 10, color: 'var(--muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
