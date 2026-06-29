const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
const prompt = document.getElementById('prompt');
const asteroid = document.getElementById('asteroid');
const projectCard = document.getElementById('project-card');
const controlsHint = document.getElementById('controls-hint');
const inkCard = document.getElementById('project-card-ink');
const ultrabdbCard = document.getElementById('project-card-ultra-bdb');

let W, H;
let mouseX = 0;
let offsetX = 0;
let time = 0;
let steerProgress = 0;
let dwarfRevealed = false;
let hasMovedMouse = false;

let state = 'idle';
let approachProgress = 0;
let approachDelay = 0;
let dx = 0, dy = 0;
let dwarfBands = [];

let destroyProgress = 0;
let particles = [];
let flashAlpha = 0;
let snakeReachedDwarf = false;

document.body.style.overflow = 'hidden';

function resize() {
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;
}

window.addEventListener('resize', resize);
resize();

// --- Stars ---

class Star {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.z = Math.random() * 3;
    this.size = 0.5 + this.z * 0.7;
    this.baseAlpha = 0.2 + Math.random() * 0.8;
    this.twinkleSpeed = 0.3 + Math.random() * 2;
    this.phase = Math.random() * Math.PI * 2;
  }
  draw() {
    const alpha = this.baseAlpha * (0.5 + 0.5 * Math.sin(time * this.twinkleSpeed + this.phase));
    const speed = 1 + this.z * 0.5;
    const x = ((this.x - offsetX * speed * 2) % W + W) % W;
    ctx.beginPath();
    ctx.arc(x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(180, 200, 255, ${alpha})`;
    ctx.fill();
  }
}

const stars = Array.from({ length: 250 }, () => new Star());

// --- Mouse / Touch ---

document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / W) * 2 - 1;
  if (!hasMovedMouse) {
    hasMovedMouse = true;
    prompt.classList.add('visible');
  }
});

document.addEventListener('touchmove', (e) => {
  const t = e.touches[0];
  mouseX = (t.clientX / W) * 2 - 1;
  if (!hasMovedMouse) {
    hasMovedMouse = true;
    prompt.classList.add('visible');
  }
}, { passive: true });

// --- Visitor counter ---

(async () => {
  try {
    const res = await fetch('https://api.countapi.xyz/hit/0-second-shadow-0/protfolio-visits');
    const data = await res.json();
    document.getElementById('counter-value').textContent = data.value.toLocaleString();
  } catch {
    document.getElementById('counter-value').textContent = 'ERR';
  }
})();

// --- Prompt sequence ---

setTimeout(() => {
  prompt.textContent = 'MOVE YOUR MOUSE TO STEER';
  controlsHint.classList.add('visible');
}, 800);

setTimeout(() => {
  if (!hasMovedMouse) prompt.classList.add('visible');
}, 1800);

// --- Dwarf steering ---

function updateDwarf() {
  if (dwarfRevealed) return;

  steerProgress = Math.min(1, steerProgress + Math.max(0, mouseX) * 0.006);

  if (steerProgress > 0.01) {
    const targetX = W * 0.88;
    const targetY = H * 0.35;
    const progressEased = 1 - Math.pow(1 - steerProgress, 3);
    const currentX = W + (targetX - W) * progressEased;

    asteroid.style.left = (currentX - 50) + 'px';
    asteroid.style.top = (targetY - 50) + 'px';

    if (steerProgress > 0.05) {
      asteroid.classList.add('visible');
    }
  }

  if (steerProgress > 0.65 && !dwarfRevealed) {
    dwarfRevealed = true;
    asteroid.classList.add('revealed');
    prompt.classList.remove('visible');
    setTimeout(() => {
      prompt.textContent = '✦ APPROACHING ✦';
      prompt.classList.add('visible');
      prompt.classList.add('revealed');
    }, 200);
    controlsHint.classList.remove('visible');
  }
}

// --- Brown dwarf ---

function generateDwarf() {
  dwarfBands = [];
  const count = 6 + Math.floor(Math.random() * 4);
  for (let i = 0; i < count; i++) {
    dwarfBands.push({
      yOff: -0.7 + (i / (count - 1)) * 1.4,
      width: 0.08 + Math.random() * 0.12,
      r: 55 + Math.floor(Math.random() * 30),
      g: 30 + Math.floor(Math.random() * 25),
      b: 18 + Math.floor(Math.random() * 20),
    });
  }
}

function drawDwarf(cx, cy, radius, bodyAlpha, glowAlpha) {
  const g = glowAlpha ?? bodyAlpha;

  const outerGlow = ctx.createRadialGradient(cx, cy, radius * 0.1, cx, cy, radius * 9);
  outerGlow.addColorStop(0, `rgba(200, 130, 80, ${0.12 * g})`);
  outerGlow.addColorStop(0.15, `rgba(170, 100, 60, ${0.08 * g})`);
  outerGlow.addColorStop(0.4, `rgba(130, 65, 40, ${0.04 * g})`);
  outerGlow.addColorStop(0.7, `rgba(90, 45, 30, ${0.015 * g})`);
  outerGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = outerGlow;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 9, 0, Math.PI * 2);
  ctx.fill();

  if (bodyAlpha <= 0.01) return;

  const innerGlow = ctx.createRadialGradient(cx, cy, radius * 0.1, cx, cy, radius * 2);
  innerGlow.addColorStop(0, `rgba(220, 160, 100, ${0.15 * g})`);
  innerGlow.addColorStop(0.5, `rgba(180, 100, 60, ${0.06 * g})`);
  innerGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = innerGlow;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();

  const bodyGrad = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.3, 0, cx, cy, radius);
  bodyGrad.addColorStop(0, `rgba(170, 100, 60, ${bodyAlpha * 0.95})`);
  bodyGrad.addColorStop(0.3, `rgba(110, 60, 38, ${bodyAlpha * 0.95})`);
  bodyGrad.addColorStop(0.7, `rgba(75, 45, 30, ${bodyAlpha})`);
  bodyGrad.addColorStop(1, `rgba(50, 32, 22, ${bodyAlpha})`);
  ctx.fillStyle = bodyGrad;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

  for (const band of dwarfBands) {
    const y = cy + band.yOff * radius;
    const h = band.width * radius * 2;
    ctx.fillStyle = `rgba(${band.r + 30}, ${band.g + 15}, ${band.b + 10}, ${bodyAlpha * 0.5})`;
    ctx.fillRect(cx - radius, y - h / 2, radius * 2, h);
  }

  ctx.restore();

  const rimGrad = ctx.createRadialGradient(cx, cy, radius * 0.85, cx, cy, radius);
  rimGrad.addColorStop(0, 'transparent');
  rimGrad.addColorStop(0.6, `rgba(230, 160, 90, ${bodyAlpha * 0.08})`);
  rimGrad.addColorStop(1, `rgba(240, 180, 100, ${bodyAlpha * 0.2})`);
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = rimGrad;
  ctx.fill();
}

// --- Approach ---

function drawApproach(progress) {
  const eased = 1 - Math.pow(1 - progress, 2);
  const scale = 1 + eased * 3.5;
  const bodyDelay = Math.max(0, (eased - 0.7) / 0.3);
  const bodyAlpha = Math.min(1, bodyDelay * 1.5);
  const bodyRadius = 10 + bodyDelay * 60;
  const glowIntensity = Math.min(1, eased * 1.6);
  drawDwarf(dx, dy, bodyRadius * scale, bodyAlpha, glowIntensity);
}

function startApproach() {
  const rect = asteroid.getBoundingClientRect();
  dx = rect.left + rect.width / 2;
  dy = rect.top + rect.height / 2;
  asteroid.style.display = 'none';
  generateDwarf();
  state = 'approaching';
  approachProgress = 0;
}

// --- Snake ---

class SpaceSnake {
  constructor() {
    this.segments = 14;
    this.positions = [];
    this.t = Math.random() * 100;
    this.driftSpeed = 0.3 + Math.random() * 0.2;
    this.chasing = false;
    this.targetX = 0;
    this.targetY = 0;
    this.chaseSpeed = 6;
    this.reached = false;
    this.hidden = false;
    this.reset();
  }

  reset() {
    this.positions = [];
    const startX = -20 * this.segments;
    const startY = H * 0.65 + Math.random() * H * 0.15;
    for (let i = 0; i < this.segments; i++) {
      this.positions.push({ x: startX - i * 14, y: startY });
    }
  }

  setTarget(x, y) {
    this.chasing = true;
    this.targetX = x;
    this.targetY = y;
    this.reached = false;
  }

  flee() {
    this.setTarget(W + 300, H * 0.4);
    this.hidden = false;
  }

  update() {
    const head = this.positions[0];

    if (this.chasing) {
      this.chaseSpeed = Math.min(22, this.chaseSpeed + 0.2);
      const tdx = this.targetX - head.x;
      const tdy = this.targetY - head.y;
      const dist = Math.sqrt(tdx * tdx + tdy * tdy);

      if (dist > 25) {
        head.x += (tdx / dist) * this.chaseSpeed;
        const waveOff = Math.sin(this.t * 12) * 4;
        head.y += (tdy / dist) * this.chaseSpeed + waveOff * 0.2;
      } else {
        this.reached = true;
        if (this.targetX > W) this.hidden = true;
      }
    } else {
      head.x += this.driftSpeed;
      if (head.x > W + 100) {
        this.reset();
        head.x = -20 * this.segments + this.driftSpeed;
      }
      const amp = 35;
      head.y = H * 0.65 + Math.sin(this.t * 2.5) * amp * 0.3
        + Math.sin(this.t * 1.3 + head.x * 0.005) * amp * 0.7;
    }

    this.t += 0.02;

    for (let i = 1; i < this.segments; i++) {
      const prev = this.positions[i - 1];
      const curr = this.positions[i];
      const dx = prev.x - curr.x;
      const dy = prev.y - curr.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const follow = 12;
      if (dist > follow) {
        const ratio = (dist - follow) / dist * 0.35;
        curr.x += dx * ratio;
        curr.y += dy * ratio;
      }
    }
  }

  draw() {
    if (this.hidden) return;
    for (let i = this.segments - 1; i >= 0; i--) {
      const p = this.positions[i];
      const t = 1 - i / this.segments;
      const size = 1.5 + t * 4.5;
      const alpha = 0.2 + t * 0.7;

      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 6);
      grad.addColorStop(0, `rgba(0, 230, 200, ${alpha * 0.2})`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, size * 6, 0, Math.PI * 2);
      ctx.fill();
    }

    for (let i = 0; i < this.segments; i++) {
      const p = this.positions[i];
      const t = 1 - i / this.segments;
      const size = 1.5 + t * 4.5;
      const alpha = 0.2 + t * 0.7;

      ctx.beginPath();
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 240, 200, ${alpha * 0.95})`;
      ctx.fill();
    }

    const h = this.positions[0];
    ctx.beginPath();
    ctx.arc(h.x - 4, h.y - 3, 2, 0, Math.PI * 2);
    ctx.arc(h.x + 4, h.y - 3, 2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(200, 255, 240, 0.9)';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(h.x - 4, h.y - 3, 4, 0, Math.PI * 2);
    ctx.arc(h.x + 4, h.y - 3, 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 240, 200, 0.15)';
    ctx.fill();
  }

  hitTest(mx, my) {
    for (const p of this.positions) {
      const dx = mx - p.x;
      const dy = my - p.y;
      if (dx * dx + dy * dy < 25 * 25) return true;
    }
    return false;
  }
}

// --- Go Gopher ---

class GoGopher {
  constructor() {
    this.visible = false;
    this.size = 1.5;
    this.baseX = W * 0.2;
    this.baseY = H * 0.25;
    this.x = this.baseX;
    this.y = this.baseY;
    this.t = Math.random() * 100;
    this.phase = Math.random() * Math.PI * 2;
    this.bob = 0;
    this.paths = this._initPaths();
  }

  _initPaths() {
    const data = [
      { fill: '#6AD7E5', d: 'M62.8 4c13.6 0 26.3 1.9 33 15 6 14.6 3.8 30.4 4.8 45.9.8 13.3 2.5 28.6-3.6 40.9-6.5 12.9-22.7 16.2-36 15.7-10.5-.4-23.1-3.8-29.1-13.4-6.9-11.2-3.7-27.9-3.2-40.4.6-14.8-4-29.7.9-44.1C34.5 8.5 48.1 5.1 62.8 4' },
      { fill: '#6AD7E5', d: 'M29.3 26.4c-13.6-3.8-3.5-21.1 7.4-14l-7.4 14z' },
      { fill: '#6AD7E5', d: 'M89.6 11.1c10.7-7.5 20.5 9.5 8 13.8l-8-13.8z' },
      { fill: '#F6D2A2', d: 'M21.1 68.7c.2 3.5 3.7 1.9 5.3.8 1.5-1.1 2-.2 2.1-2.3.1-1.4.2-2.7.2-4.1-2.3-.2-4.8.3-6.7 1.7-.9.7-2.8 3-.9 3.9' },
      { fill: '#C6B198', d: 'M21.1 68.7c.5-.2 1.1-.3 1.4-.8' },
      { fill: '#F6D2A2', d: 'M107.1 68.2c-.2 3.5-3.7 1.9-5.3.8-1.5-1.1-2-.2-2.1-2.3-.1-1.4-.2-2.7-.2-4.1 2.3-.2 4.8.3 6.7 1.7 1 .8 2.8 3 .9 3.9' },
      { fill: '#C6B198', d: 'M107.1 68.2c-.5-.2-1.1-.3-1.4-.8' },
      { fill: '#F6D2A2', d: 'M92 112.3c2.7 1.7 7.7 6.8 3.6 9.3-3.9 3.6-6.1-4-9.6-5 1.5-2 3.4-3.9 6-4.3' },
      { fill: '#F6D2A2', d: 'M43.2 118.1c-3.2.5-5 3.4-7.7 4.9-2.5 1.5-3.5-.5-3.7-.9-.4-.2-.4.2-1-.4-2.3-3.7 2.4-6.4 4.9-8.2 3.5-.8 5.7 2.2 7.5 4.6' },
      { fill: '#000', d: 'M29.9 21.7c-1.8-.9-3.1-2.2-2-4.3 1-1.9 2.9-1.7 4.7-.8l-2.7 5.1zm64.9-1.8c1.8-.9 3.1-2.2 2-4.3-1-1.9-2.9-1.7-4.7-.8l2.7 5.1z' },
      { fill: '#fff', d: 'M65.2 22.2c2.4 14.2 25.6 10.4 22.3-3.9-3-12.8-23.1-9.2-22.3 3.9' },
      { fill: '#fff', d: 'M37.5 24.5c3.2 12.3 22.9 9.2 22.2-3.2-.9-14.8-25.3-12-22.2 3.2' },
      { fill: '#fff', d: 'M68 39.2c0 1.8.4 3.9.1 5.9-.5.9-1.4 1-2.2 1.3-1.1-.2-2-.9-2.5-1.9-.3-2.2.1-4.4.2-6.6l4.4 1.3z' },
      { fill: '#000', d: 'M46.3 22.5c0 2-1.5 3.6-3.3 3.6-1.8 0-3.3-1.6-3.3-3.6s1.5-3.6 3.3-3.6c1.8 0 3.3 1.6 3.3 3.6' },
      { fill: '#000', d: 'M74.2 21.6c0 2-1.5 3.6-3.3 3.6-1.8 0-3.3-1.6-3.3-3.6s1.5-3.6 3.3-3.6c1.8 0 3.3 1.6 3.3 3.6' },
      { fill: '#fff', d: 'M45.2 23.3c0 .5-.4.9-.8.9s-.8-.4-.8-.9.4-.9.8-.9c.5 0 .8.4.8.9' },
      { fill: '#fff', d: 'M73.2 22.4c0 .5-.3.9-.8.9-.4 0-.8-.4-.8-.9s.3-.9.8-.9c.4 0 .8.4.8.9' },
      { fill: '#fff', d: 'M58.4 39c-1.5 3.5.8 10.6 4.8 5.4-.3-2.2.1-4.4.2-6.6l-5 1.2z' },
      { fill: '#F6D2A2', d: 'M58.9 32.2c-2.7.2-4.9 3.5-3.5 6 1.9 3.4 6-.3 8.6 0 3 .1 5.4 3.2 7.8.6 2.7-2.9-1.2-5.7-4.1-7l-8.8.4z' },
      { fill: '#231F20', d: 'M69.7 40.2c-.9 0-1.8-.4-2.7-.8-.9-.4-1.9-.8-3-.8h-.3c-.8 0-1.7.3-2.7.7-1.1.4-2.2.7-3.2.7-1.2 0-2.1-.5-2.7-1.6-.7-1.2-.6-2.6.1-3.9.8-1.5 2.2-2.4 3.7-2.6l8.9-.4h.1c2.2.9 4.7 2.6 5.2 4.6.2 1-.1 2-.9 2.9-.8.9-1.6 1.2-2.5 1.2z' },
      { fill: '#000', d: 'M58.6 32.1c-.2-4.7 8.8-5.3 9.8-1.4 1.1 4-9.4 4.9-9.8 1.4' },
    ];
    return data.map(p => ({ fill: p.fill, path: new Path2D(p.d) }));
  }

  resize() {
    this.baseX = W * 0.2;
    this.baseY = H * 0.25;
  }

  update() {
    if (!this.visible) return;
    this.t += 0.008;
    this.x = this.baseX + Math.sin(this.t * 0.7 + this.phase) * 40;
    this.y = this.baseY + Math.sin(this.t * 0.5 + this.phase * 1.3) * 30;
    this.bob = Math.sin(this.t * 3) * 2;
  }

  draw() {
    if (!this.visible) return;
    const x = this.x;
    const y = this.y + this.bob;
    const s = this.size;
    const scale = s * 0.57;
    const cx = 64, cy = 64;

    ctx.save();

    const glow = ctx.createRadialGradient(x, y, 0, x, y, s * 40);
    glow.addColorStop(0, 'rgba(106, 215, 229, 0.12)');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, s * 40, 0, Math.PI * 2);
    ctx.fill();

    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.translate(-cx, -cy);

    for (const { fill, path } of this.paths) {
      ctx.fillStyle = fill;
      ctx.fill(path);
    }

    ctx.restore();
  }

  hitTest(mx, my) {
    if (!this.visible) return false;
    const dx = mx - this.x;
    const dy = my - (this.y + this.bob);
    const r = this.size * 30;
    return dx * dx + dy * dy < r * r;
  }
}

const gopher = new GoGopher();

window.addEventListener('resize', () => gopher.resize());

const snake = new SpaceSnake();

// --- Particles ---

function spawnExplosion(cx, cy) {
  const colors = [
    { r: 200, g: 130, b: 80 },
    { r: 170, g: 100, b: 60 },
    { r: 240, g: 180, b: 100 },
    { r: 255, g: 220, b: 160 },
    { r: 120, g: 70, b: 40 },
    { r: 60, g: 40, b: 25 },
    { r: 0, g: 240, b: 200 },
    { r: 0, g: 200, b: 170 },
  ];
  for (let i = 0; i < 150; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 7;
    const size = 1 + Math.random() * 6;
    const c = colors[Math.floor(Math.random() * colors.length)];
    particles.push({
      x: cx + (Math.random() - 0.5) * 40,
      y: cy + (Math.random() - 0.5) * 40,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1,
      size,
      r: c.r,
      g: c.g,
      b: c.b,
      life: 1,
      decay: 0.004 + Math.random() * 0.018,
    });
  }
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.015;
    p.vx *= 0.99;
    p.life -= p.decay;
    p.size *= 0.995;
    if (p.life <= 0) particles.splice(i, 1);
  }
}

function drawParticles() {
  for (const p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${Math.max(0, p.life)})`;
    ctx.fill();

    const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
    grad.addColorStop(0, `rgba(${p.r}, ${p.g}, ${p.b}, ${Math.max(0, p.life * 0.15)})`);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

// --- Destruction ---

function startDestruction() {
  state = 'destroying';
  destroyProgress = 0;
  snakeReachedDwarf = false;
  particles = [];
  flashAlpha = 0;

  snake.setTarget(dx, dy);
  snake.chaseSpeed = 2;

  projectCard.classList.remove('visible');
}

function drawExplosion(progress) {
  const impact = Math.min(1, progress * 3);
  const bodyFade = Math.max(0, 1 - impact * 2);
  const glowFade = Math.max(0, 1 - impact * 1.4);
  drawDwarf(dx, dy, 315, bodyFade, glowFade);

  flashAlpha = Math.sin(impact * Math.PI) * 0.6;
  if (impact > 0.35 && particles.length === 0) spawnExplosion(dx, dy);

  if (progress > 0.5) {
    flashAlpha = Math.max(0, flashAlpha - 0.025);
  }

  updateParticles();
  drawParticles();

  if (flashAlpha > 0.01) {
    ctx.fillStyle = `rgba(255, 220, 180, ${flashAlpha})`;
    ctx.fillRect(0, 0, W, H);
  }

  if (progress >= 1) {
    state = 'ink-revealed';
    snake.flee();
    setTimeout(() => inkCard.classList.add('visible'), 400);
    setTimeout(() => {
      gopher.visible = true;
      prompt.textContent = '✦ CLICK THE GOPHER ✦';
      prompt.classList.add('visible', 'revealed');
    }, 2500);
  }
}

// --- Canvas click ---

canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  if (state === 'revealed') {
    const ddx = mx - dx;
    const ddy = my - dy;
    if (ddx * ddx + ddy * ddy < 350 * 350) {
      startDestruction();
      return;
    }
  }

  if (gopher.visible && gopher.hitTest(mx, my)) {
    if (!ultrabdbCard.classList.contains('visible')) {
      inkCard.classList.remove('visible');
      ultrabdbCard.classList.add('visible');
      setTimeout(() => {
        prompt.classList.remove('visible');
        prompt.classList.remove('revealed');
      }, 1000);
    }
    return;
  }

  if (snake.hitTest(mx, my) && state !== 'destroying') {
    if (state === 'revealed') startDestruction();
    else inkCard.classList.add('visible');
  }
});

// --- Main loop ---

function animate() {
  time += 0.016;
  offsetX += mouseX * 1.5;
  offsetX *= 0.98;

  ctx.fillStyle = '#05050a';
  ctx.fillRect(0, 0, W, H);

  for (const star of stars) star.draw();

  if (!snake.hidden) { snake.update(); snake.draw(); }
  gopher.update();
  gopher.draw();

  if (state === 'approaching') {
    approachProgress += 0.005;
    if (approachProgress >= 1) {
      approachProgress = 1;
      state = 'revealed';
      prompt.classList.remove('visible');
      setTimeout(() => projectCard.classList.add('visible'), 300);
    }
    drawApproach(approachProgress);
  } else if (state === 'revealed') {
    drawDwarf(dx, dy, 315, 1, 1);
  } else if (state === 'destroying') {
    if (!snakeReachedDwarf) {
      if (snake.reached) {
        snakeReachedDwarf = true;
        destroyProgress = 0;
      } else {
        const pulse = 1 + Math.sin(time * 6) * 0.2;
        drawDwarf(dx, dy, 315, 1, pulse);
      }
    }
    if (snakeReachedDwarf) {
      destroyProgress += 0.008;
      if (destroyProgress >= 1) destroyProgress = 1;
      drawExplosion(destroyProgress);
    }
  } else if (state === 'ink-revealed') {
    // idle — snake already handled above
  } else {
    updateDwarf();
    if (dwarfRevealed) {
      approachDelay += 0.016;
      if (approachDelay > 1.8) startApproach();
    }
  }

  requestAnimationFrame(animate);
}

// --- Tic-tac-toe ---

const tttCells = document.querySelectorAll('.ttt-cell');
const tttStatus = document.getElementById('ttt-status');
const tttReset = document.getElementById('ttt-reset');

const ttt = {
  board: Array(9).fill(null),
  currentPlayer: 'X',
  gameOver: false,
  wins: [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6],
  ],

  init() {
    this.board = Array(9).fill(null);
    this.currentPlayer = 'X';
    this.gameOver = false;
    tttStatus.textContent = 'Your turn (X)';
    tttCells.forEach((cell) => {
      cell.textContent = '';
      cell.className = 'ttt-cell';
    });
  },

  checkWin() {
    for (const w of this.wins) {
      const [a, b, c] = w;
      if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
        return { winner: this.board[a], line: w };
      }
    }
    if (this.board.every(c => c !== null)) return { winner: 'draw', line: null };
    return null;
  },

  makeMove(index) {
    if (this.gameOver || this.board[index] !== null || this.currentPlayer !== 'X') return;

    this.board[index] = 'X';
    tttCells[index].textContent = 'X';
    tttCells[index].classList.add('x');

    const result = this.checkWin();
    if (result) {
      this.gameOver = true;
      if (result.winner === 'draw') { tttStatus.textContent = 'Draw!'; }
      else {
        tttStatus.textContent = 'You win!';
        result.line.forEach(i => tttCells[i].classList.add('win'));
      }
      return;
    }

    this.currentPlayer = 'O';
    tttStatus.textContent = 'AI thinking...';
    setTimeout(() => this.aiMove(), 400);
  },

  aiMove() {
    if (this.gameOver || this.currentPlayer !== 'O') return;

    const empty = this.board.map((v, i) => v === null ? i : null).filter(v => v !== null);
    if (empty.length === 0) return;

    const idx = empty[Math.floor(Math.random() * empty.length)];
    this.board[idx] = 'O';
    tttCells[idx].textContent = 'O';
    tttCells[idx].classList.add('o');

    const result = this.checkWin();
    if (result) {
      this.gameOver = true;
      if (result.winner === 'draw') { tttStatus.textContent = 'Draw!'; }
      else {
        tttStatus.textContent = 'AI wins!';
        result.line.forEach(i => tttCells[i].classList.add('win'));
      }
      return;
    }

    this.currentPlayer = 'X';
    tttStatus.textContent = 'Your turn (X)';
  },
};

tttCells.forEach(cell => {
  cell.addEventListener('click', () => ttt.makeMove(parseInt(cell.dataset.index)));
});

tttReset.addEventListener('click', () => ttt.init());
ttt.init();

animate();
