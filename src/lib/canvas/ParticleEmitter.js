// ParticleEmitter.js — Signal particle animations along curved bezier paths
import { cubicBezier } from './VectorMath.js';

export class ParticleEmitter {
  constructor(options = {}) {
    this.particles = [];
    this.options = {
      speed: 0.008,
      color: '#00FFAA',
      radius: 3,
      trailLength: 6,
      maxParticles: 60,
      ...options,
    };
  }

  emit(edge) {
    if (this.particles.length >= this.options.maxParticles) return;
    this.particles.push({
      id: Math.random().toString(36).slice(2),
      edgeId: edge.id,
      t: 0,
      p0: edge.from, p1: edge.cp1, p2: edge.cp2, p3: edge.to,
      trail: [],
      color: edge.color || this.options.color,
      speed: this.options.speed * (0.7 + Math.random() * 0.6),
    });
  }

  update() {
    this.particles = this.particles.filter(p => p.t < 1);
    for (const p of this.particles) {
      const pos = cubicBezier(p.p0, p.p1, p.p2, p.p3, p.t);
      p.trail.push(pos);
      if (p.trail.length > this.options.trailLength) p.trail.shift();
      p.t += p.speed;
    }
  }

  render(ctx) {
    for (const p of this.particles) {
      if (!p.trail.length) continue;

      // Draw trail
      for (let i = 0; i < p.trail.length - 1; i++) {
        const alpha = (i / p.trail.length) * 0.6;
        ctx.beginPath();
        ctx.strokeStyle = p.color.replace(')', `,${alpha})`).replace('rgb', 'rgba');
        ctx.lineWidth = 1.5;
        ctx.moveTo(p.trail[i].x, p.trail[i].y);
        ctx.lineTo(p.trail[i + 1].x, p.trail[i + 1].y);
        ctx.stroke();
      }

      // Draw head
      const head = p.trail[p.trail.length - 1];
      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.arc(head.x, head.y, this.options.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  clear() { this.particles = []; }
  getCount() { return this.particles.length; }
}
