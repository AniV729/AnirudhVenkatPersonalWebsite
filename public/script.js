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
  'CS & Business @ University of Michigan',
  'Software Engineer',
  'Quantum Computing Researcher',
  'Security Researcher',
  'Published Mathematician',
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
