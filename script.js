/* =============================================
   FRANZI – script.js
   ============================================= */

// --- Partikel-Canvas ---
(function () {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = ['rgba(244,162,97,', 'rgba(78,205,196,', 'rgba(167,139,250,', 'rgba(244,114,182,'];

  function randomBetween(a, b) { return a + Math.random() * (b - a); }

  class Particle {
    constructor() { this.reset(true); }

    reset(initial) {
      this.x     = randomBetween(0, W);
      this.y     = initial ? randomBetween(0, H) : H + 10;
      this.size  = randomBetween(1, 2.5);
      this.speed = randomBetween(0.15, 0.6);
      this.drift = randomBetween(-0.15, 0.15);
      this.alpha = randomBetween(0.2, 0.7);
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    }

    update() {
      this.y -= this.speed;
      this.x += this.drift;
      if (this.y < -10) this.reset(false);
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }
  }

  for (let i = 0; i < 80; i++) particles.push(new Particle());

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();


// --- Nav: scrolled class & mobile burger ---
(function () {
  const nav    = document.getElementById('nav');
  const burger = document.getElementById('navBurger');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  burger.addEventListener('click', () => {
    nav.classList.toggle('open');
    burger.setAttribute('aria-label', nav.classList.contains('open') ? 'Menü schließen' : 'Menü öffnen');
  });

  // Close nav when a link is clicked
  nav.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => nav.classList.remove('open'));
  });
})();


// --- Scroll-Reveal für trait-cards ---
(function () {
  const cards = document.querySelectorAll('.trait-card');
  if (!cards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('visible'), Number(delay));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  cards.forEach(c => observer.observe(c));
})();


// --- Smooth active nav highlight ---
(function () {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a[href^="#"]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));
})();
