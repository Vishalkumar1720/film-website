import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import confetti from 'canvas-confetti';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

/* ==========================================================================
   1. LENIS SMOOTH SCROLL INITIALIZATION
   ========================================================================== */
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  touchMultiplier: 1.8,
  infinite: false,
});

// Synchronize Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

/* ==========================================================================
   2. AMBIENT STARDUST / CHAMPAGNE PARTICLES CANVAS
   ========================================================================== */
const canvas = document.getElementById('ambient-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
const particleCount = 45;

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

class Particle {
  constructor() {
    this.reset(true);
  }

  reset(initial = false) {
    this.x = Math.random() * width;
    this.y = initial ? Math.random() * height : height + 10;
    this.size = Math.random() * 2.2 + 0.8;
    this.speedY = Math.random() * 0.4 + 0.15;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.55 + 0.15;
    this.fadeSpeed = Math.random() * 0.005 + 0.002;
    // Golden & Rose Champagne hues
    const hues = ['#dfba73', '#f6f3ed', '#e8b4b8', '#c59b4e'];
    this.color = hues[Math.floor(Math.random() * hues.length)];
  }

  update() {
    this.y -= this.speedY;
    this.x += this.speedX;

    if (this.y < -10 || this.x < -10 || this.x > width + 10) {
      this.reset();
    }
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 8;
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function initParticles() {
  resizeCanvas();
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, width, height);
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();
  }
  requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', () => {
  resizeCanvas();
});

/* ==========================================================================
   3. SCROLL PROGRESS BAR
   ========================================================================== */
const progressBar = document.getElementById('progressBar');

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (progressBar) {
    progressBar.style.width = `${scrollPercent}%`;
  }
}, { passive: true });

/* ==========================================================================
   4. CELEBRATION CONFETTI (CHAMPAGNE & ROSE GOLD)
   ========================================================================== */
function launchCelebrationConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    colors: ['#dfba73', '#c59b4e', '#e8b4b8', '#ffffff', '#fae8cf'],
    disableForReducedMotion: true,
  };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}

/* ==========================================================================
   5. GSAP SCROLL-TRIGGERED NARRATIVE ANIMATIONS
   ========================================================================== */
function initScrollAnimations() {
  // Hero section entrance
  const heroElements = document.querySelectorAll('.hero-chapter .fade-up');
  gsap.fromTo(
    heroElements,
    { opacity: 0, y: 35 },
    {
      opacity: 1,
      y: 0,
      duration: 1.2,
      stagger: 0.18,
      ease: 'power3.out',
      delay: 0.2,
    }
  );

  // Chapter 02: Presence Parallax & Text
  gsap.fromTo(
    '.presence-media',
    { y: 50, opacity: 0.8 },
    {
      y: -40,
      opacity: 1,
      scrollTrigger: {
        trigger: '#chapter-02',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2,
      },
    }
  );

  gsap.fromTo(
    '.presence-text-block',
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '#chapter-02',
        start: 'top 75%',
      },
    }
  );

  // Chapter 03: Nuance traits entrance
  gsap.fromTo(
    '.trait-box',
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '#chapter-03',
        start: 'top 70%',
      },
    }
  );

  gsap.fromTo(
    '.nuance-portrait-frame',
    { scale: 0.92, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#chapter-03',
        start: 'top 65%',
      },
    }
  );

  // Chapter 05: Curated detail glass cards
  gsap.fromTo(
    '.detail-card',
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.9,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '#chapter-05',
        start: 'top 70%',
      },
    }
  );

  // Chapter 06: Polaroid Nostalgia reveal
  gsap.fromTo(
    '.polaroid-style',
    { rotation: -6, opacity: 0, scale: 0.9 },
    {
      rotation: -2,
      opacity: 1,
      scale: 1,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#chapter-06',
        start: 'top 70%',
      },
    }
  );

  // Chapter 07: Stillness emotional text
  gsap.fromTo(
    '.fade-in-scroll',
    { opacity: 0, y: 25 },
    {
      opacity: 1,
      y: 0,
      duration: 1.2,
      stagger: 0.35,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '#chapter-07',
        start: 'top 65%',
      },
    }
  );

  // Chapter 08: Birthday Climax Reveal & Auto-Confetti
  let climaxTriggered = false;
  ScrollTrigger.create({
    trigger: '#chapter-08',
    start: 'top 60%',
    onEnter: () => {
      if (!climaxTriggered) {
        climaxTriggered = true;
        launchCelebrationConfetti();
      }
    },
  });

  gsap.fromTo(
    '.climax-typography, .climax-portrait-wrapper, .climax-action',
    { opacity: 0, scale: 0.94, y: 30 },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 1.4,
      stagger: 0.25,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#chapter-08',
        start: 'top 75%',
      },
    }
  );

  // Chapter 09: Dedicated Letter
  gsap.fromTo(
    '.letter-card',
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#chapter-09',
        start: 'top 70%',
      },
    }
  );

  // Chapter 10: Epilogue Sunset
  gsap.fromTo(
    '.epilogue-content',
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 1.4,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#chapter-10',
        start: 'top 75%',
      },
    }
  );
}

/* ==========================================================================
   6. USER INTERACTIONS & BUTTON HANDLERS
   ========================================================================== */
function setupInteractions() {
  // Scroll Cue / Begin button
  const scrollCue = document.getElementById('scrollCue');
  if (scrollCue) {
    scrollCue.addEventListener('click', () => {
      const target = document.getElementById('chapter-02');
      if (target) {
        lenis.scrollTo(target, { offset: 0, duration: 1.4 });
      }
    });
  }

  // Celebrate Her Day Button
  const celebrateBtn = document.getElementById('celebrateBtn');
  if (celebrateBtn) {
    celebrateBtn.addEventListener('click', () => {
      launchCelebrationConfetti();
      // Secondary delay wave
      setTimeout(launchCelebrationConfetti, 400);
    });
  }

  // Replay Journey
  const replayBtn = document.getElementById('replayBtn');
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      lenis.scrollTo(0, { duration: 2 });
    });
  }

  // Share Button
  const shareBtn = document.getElementById('shareBtn');
  const toast = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');

  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const shareData = {
        title: 'Anjali — The Birthday Monograph',
        text: 'A personal birthday tribute for Anjali · September 23',
        url: window.location.href,
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
          return;
        } catch (err) {
          // Fallback to clipboard if user dismissed native share sheet
        }
      }

      // Clipboard fallback
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Private celebration link copied to clipboard!');
      } catch (err) {
        showToast('Link ready to share: ' + window.location.href);
      }
    });
  }

  function showToast(msg) {
    if (!toast) return;
    toastMessage.textContent = msg;
    toast.classList.add('active');
    setTimeout(() => {
      toast.classList.remove('active');
    }, 3500);
  }
}

/* ==========================================================================
   7. INITIALIZATION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  animateParticles();
  initScrollAnimations();
  setupInteractions();
  document.body.classList.remove('loading');
});
