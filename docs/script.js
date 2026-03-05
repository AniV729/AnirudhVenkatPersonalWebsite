/* ── PARTICLE FIELD (cyber) ── */
(function () {
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles, mouse = { x: -9999, y: -9999 };
  const COUNT = 65, MAX_DIST = 140, SPEED = 0.5;
  const C_GREEN  = '0,255,136';
  const C_CYAN   = '0,220,255';
  const C_HOT    = '57,255,20';   // neon lime for cursor
  let tick = 0;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle() {
    this.x      = Math.random() * W;
    this.y      = Math.random() * H;
    this.vx     = (Math.random() - 0.5) * SPEED;
    this.vy     = (Math.random() - 0.5) * SPEED;
    this.size   = Math.random() < 0.2 ? 3 : 1.5;   // some larger "hub" nodes
    this.pulse  = Math.random() * Math.PI * 2;      // phase offset for blink
    this.color  = Math.random() < 0.35 ? C_CYAN : C_GREEN;
  }

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, () => new Particle());
  }

  function drawSquare(x, y, s, color, alpha) {
    ctx.fillStyle = `rgba(${color},${alpha})`;
    ctx.fillRect(x - s, y - s, s * 2, s * 2);
  }

  function draw() {
    tick++;
    ctx.clearRect(0, 0, W, H);

    // update positions
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    }

    // connections between nodes
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX_DIST) {
          const alpha = (1 - d / MAX_DIST) * 0.3;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${C_GREEN},${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }

      // cursor beam
      const mdx = particles[i].x - mouse.x;
      const mdy = particles[i].y - mouse.y;
      const md  = Math.sqrt(mdx * mdx + mdy * mdy);
      if (md < MAX_DIST * 1.5) {
        const a = (1 - md / (MAX_DIST * 1.5)) * 0.55;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(${C_HOT},${a})`;
        ctx.lineWidth = 0.9;
        ctx.stroke();
      }
    }

    // draw nodes as squares with pulse
    for (const p of particles) {
      const blink = 0.55 + 0.45 * Math.sin(p.pulse + tick * 0.025);
      drawSquare(p.x, p.y, p.size, p.color, blink);
      // glow ring on hub nodes
      if (p.size > 2) {
        ctx.strokeStyle = `rgba(${p.color},${blink * 0.25})`;
        ctx.lineWidth = 1;
        ctx.strokeRect(p.x - p.size - 2, p.y - p.size - 2, (p.size + 2) * 2, (p.size + 2) * 2);
      }
    }

    // cursor crosshair dot
    if (mouse.x > 0) {
      ctx.fillStyle = `rgba(${C_HOT},0.9)`;
      ctx.fillRect(mouse.x - 2, mouse.y - 2, 4, 4);
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  init();
  draw();
})();

/* ── CURSOR GLOW ── */
const glow = document.getElementById('cursor-glow');
document.addEventListener('mousemove', e => {
  glow.style.left = e.clientX + 'px';
  glow.style.top  = e.clientY + 'px';
});

/* ── SCROLL PROGRESS ── */
const progress = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  progress.style.width = pct + '%';
}, { passive: true });

/* ── NAV SCROLLED STATE ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ── MOBILE MENU ── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

/* ── TYPEWRITER ── */
const phrases = [
  'Computer Science & Business @ University of Michigan',
  'AI & ML Engineer',
  'Quantum Computing Researcher',
  'Cybersecurity Researcher',
  'Published Mathematician',
  'Builder & Founder',
  'ISEF CIA 1st Place Winner',
];
let phraseIdx = 0;
let charIdx = 0;
let deleting = false;
let typeSpeed = 65;
const typeEl = document.getElementById('typewriter');

function type() {
  const current = phrases[phraseIdx];
  if (!deleting) {
    charIdx++;
    typeEl.textContent = current.slice(0, charIdx);
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(type, 2200);
      return;
    }
  } else {
    charIdx--;
    typeEl.textContent = current.slice(0, charIdx);
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      setTimeout(type, 400);
      return;
    }
  }
  const speed = deleting ? typeSpeed * 0.4 : typeSpeed;
  setTimeout(type, speed + Math.random() * 30);
}
setTimeout(type, 800);

/* ── REVEAL ON SCROLL ── */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);
revealEls.forEach((el, i) => {
  // stagger children within same parent
  const siblings = Array.from(el.parentElement.children).filter(c => c.classList.contains('reveal'));
  const idx = siblings.indexOf(el);
  el.style.transitionDelay = (idx * 0.07) + 's';
  revealObserver.observe(el);
});

/* ── SMOOTH NAV SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── PROJECT CARD TILT ── */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width  / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `translateY(-4px) rotateY(${dx * 4}deg) rotateX(${-dy * 4}deg)`;
    card.style.transition = 'transform 0.08s ease, border-color 0.3s, box-shadow 0.3s';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.4s ease, border-color 0.3s, box-shadow 0.3s';
  });
});

/* ── AWARD ITEM STAGGER ── */
const awardItems = document.querySelectorAll('.award-item');
const awardObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const i = Array.from(awardItems).indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
        awardObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);
awardItems.forEach(item => awardObserver.observe(item));

/* ── SKILL TAG WAVE ON HOVER ── */
document.querySelectorAll('.skill-group').forEach(group => {
  group.addEventListener('mouseenter', () => {
    const tags = group.querySelectorAll('.skill-tag');
    tags.forEach((tag, i) => {
      setTimeout(() => {
        tag.style.borderColor = 'rgba(139, 92, 246, 0.3)';
        tag.style.background  = 'rgba(139, 92, 246, 0.07)';
        tag.style.color       = 'var(--text)';
        setTimeout(() => {
          tag.style.borderColor = '';
          tag.style.background  = '';
          tag.style.color       = '';
        }, 600);
      }, i * 45);
    });
  });
});

/* ── INITIAL HERO REVEAL ── */
window.addEventListener('DOMContentLoaded', () => {
  const heroReveals = document.querySelectorAll('#hero .reveal');
  heroReveals.forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 100 + i * 120);
  });
});

/* ── COURSE MODAL ── */
const COURSES = {
  cs: {
    name: 'Computer Science',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16,18 22,12 16,6"/><polyline points="8,6 2,12 8,18"/></svg>`,
    courses: [
      { code: 'EECS 203',      name: 'Discrete Math' },
      { code: 'EECS 280',      name: 'Programming & Data Structures' },
      { code: 'EECS 281',      name: 'Data Structures & Algorithms' },
      { code: 'EECS 370',      name: 'Computer Organization' },
      { code: 'ENGR 100',      name: 'Technological Revolutions' },
      { code: 'EECS 445',      name: 'Machine Learning' },
      { code: 'EECS 482 & 408', name: 'Advanced Operating Systems' },
    ]
  },
  ross: {
    name: 'Ross School of Business',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>`,
    courses: [
      { code: 'BA 100',        name: 'Intro to Ross' },
      { code: 'BA 200',        name: 'Businesses & Leaders' },
      { code: 'Econ 101',      name: 'Microeconomics' },
      { code: 'ACC 300',       name: 'Financial Accounting' },
      { code: 'BCOM 250',      name: 'Business Communication' },
      { code: 'FIN 300',       name: 'Financial Management' },
      { code: 'TO 301',        name: 'Business Analytics & Statistics' },
      { code: 'ACC 301',       name: 'Managerial Accounting' },
      { code: 'Econ 102',      name: 'Macroeconomics' },
      { code: 'Strategy 290',  name: 'Business Strategy' },
      { code: 'TO 300',        name: 'Business Information Systems' },
    ]
  },
  math: {
    name: 'Mathematics Minor',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>`,
    courses: [
      { code: 'Math 214', name: 'Linear Algebra' },
      { code: 'Math 215', name: 'Multivariable Calculus' },
      { code: 'Math 216', name: 'Differential Equations' },
      { code: 'Math 423', name: 'Mathematics of Finance' },
      { code: 'Math 425', name: 'Probability' },
      { code: 'Math 481', name: 'Mathematical Logic' },
    ]
  }
};

const modal        = document.getElementById('course-modal');
const modalIcon    = modal.querySelector('.course-modal-icon');
const modalName    = modal.querySelector('.course-modal-name');
const pillsWrap    = modal.querySelector('.course-pills-wrap');
const closeBtn     = modal.querySelector('.course-modal-close');
const backdrop     = modal.querySelector('.course-modal-backdrop');

function openModal(key) {
  const data = COURSES[key];
  if (!data) return;

  modalIcon.innerHTML = data.icon;
  modalName.textContent = data.name;
  pillsWrap.innerHTML = '';

  data.courses.forEach(c => {
    const pill = document.createElement('div');
    pill.className = 'course-pill';
    pill.innerHTML = `<code>${c.code}</code><span>${c.name}</span>`;
    pillsWrap.appendChild(pill);
  });

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  // Staggered pill reveal
  const pills = pillsWrap.querySelectorAll('.course-pill');
  pills.forEach((pill, i) => {
    setTimeout(() => pill.classList.add('visible'), 120 + i * 55);
  });
}

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('.major-tile').forEach(tile => {
  tile.addEventListener('click', () => openModal(tile.dataset.major));
});
closeBtn.addEventListener('click', closeModal);
backdrop.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
