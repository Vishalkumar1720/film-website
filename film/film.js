import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import confetti from 'canvas-confetti';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

/* ==========================================================================
   1. LENIS SMOOTH SCROLL
   ========================================================================== */
const lenis = new Lenis({
  duration: 1.3,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  touchMultiplier: 1.8,
  infinite: false,
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

/* ==========================================================================
   2. AMBIENT STARDUST & CINEMA PARTICLES CANVAS
   ========================================================================== */
const canvas = document.getElementById('film-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
const particleCount = 40;

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

class FilmParticle {
  constructor() {
    this.reset(true);
  }

  reset(initial = false) {
    this.x = Math.random() * width;
    this.y = initial ? Math.random() * height : height + 10;
    this.size = Math.random() * 2.5 + 0.8;
    this.speedY = Math.random() * 0.35 + 0.1;
    this.speedX = (Math.random() - 0.5) * 0.25;
    this.opacity = Math.random() * 0.5 + 0.15;
    const colors = ['#dfba73', '#f7e2b5', '#ffffff', '#8b6e36'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
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
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function initFilmParticles() {
  resizeCanvas();
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new FilmParticle());
  }
}

function renderFilmParticles() {
  ctx.clearRect(0, 0, width, height);
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();
  }
  requestAnimationFrame(renderFilmParticles);
}

window.addEventListener('resize', resizeCanvas);

/* ==========================================================================
   3. CINEMA HUD TIMECODE & SCENE TRACKER
   ========================================================================== */
const timecodeEl = document.getElementById('filmTimecode');
const timelineFill = document.getElementById('hudTimelineFill');
const sceneIndicator = document.getElementById('sceneIndicator');

const scenes = [
  { id: 'scene-01', num: '01' },
  { id: 'scene-02', num: '02' },
  { id: 'scene-03', num: '03' },
  { id: 'scene-04', num: '04' },
  { id: 'scene-05', num: '05' },
  { id: 'scene-06', num: '06' },
  { id: 'scene-07', num: '07' },
  { id: 'scene-08', num: '08' },
  { id: 'scene-09', num: '09' },
  { id: 'scene-10', num: '10' },
  { id: 'scene-11', num: '11' },
  { id: 'scene-12', num: '12' },
];

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? scrollTop / docHeight : 0;

  // Timeline Fill
  if (timelineFill) {
    timelineFill.style.width = `${progress * 100}%`;
  }

  // 24fps Timecode Calculation: 00:MM:SS:FF
  const totalFrames = Math.floor(progress * 24 * 120); // 2 minutes reel representation
  const frames = totalFrames % 24;
  const seconds = Math.floor(totalFrames / 24) % 60;
  const minutes = Math.floor(totalFrames / (24 * 60));

  const pad = (n) => String(n).padStart(2, '0');
  if (timecodeEl) {
    timecodeEl.textContent = `00:${pad(minutes)}:${pad(seconds)}:${pad(frames)}`;
  }

  // Active Scene Detection
  const scrollMiddle = scrollTop + window.innerHeight * 0.45;
  for (let i = scenes.length - 1; i >= 0; i--) {
    const el = document.getElementById(scenes[i].id);
    if (el && el.offsetTop <= scrollMiddle) {
      if (sceneIndicator) {
        sceneIndicator.textContent = `SCENE ${scenes[i].num} / 12`;
      }
      break;
    }
  }
}, { passive: true });

/* ==========================================================================
   4. CELEBRATION CONFETTI
   ========================================================================== */
function fireGoldenConfetti() {
  const count = 180;
  const defaults = {
    origin: { y: 0.7 },
    colors: ['#dfba73', '#f7e2b5', '#ffffff', '#c59b4e', '#8b6e36'],
    disableForReducedMotion: true,
  };

  confetti({ ...defaults, particleCount: Math.floor(count * 0.3), spread: 40, startVelocity: 50 });
  confetti({ ...defaults, particleCount: Math.floor(count * 0.4), spread: 80, decay: 0.92 });
  confetti({ ...defaults, particleCount: Math.floor(count * 0.3), spread: 110, startVelocity: 35 });
}

/* ==========================================================================
   5. GSAP TIMELINES & SCROLL-TRIGGERED NARRATIVE
   ========================================================================== */
function initFilmAnimations() {

  // --- SCENE 01: THE OPENING (ENTRANCE & SCROLL EXIT) ---
  gsap.fromTo(
    '.scene-01-opening .fade-in-entry',
    { opacity: 0, y: 25 },
    {
      opacity: 1,
      y: 0,
      duration: 1.1,
      stagger: 0.16,
      ease: 'power3.out',
      delay: 0.2,
    }
  );

  gsap.to('#filmStartPrompt', {
    opacity: 0,
    y: 12,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '#scene-01',
      start: 'top top',
      end: '+=20%',
      scrub: true,
    },
  });

  gsap.to('.scene-01-content', {
    opacity: 0,
    scale: 0.94,
    y: -35,
    ease: 'none',
    scrollTrigger: {
      trigger: '#scene-01',
      start: '15% top',
      end: 'bottom top',
      scrub: true,
    },
  });

  // --- SCENE 02: CINEMATIC PORTRAIT ZOOM ---
  const tlScene2 = gsap.timeline({
    scrollTrigger: {
      trigger: '#scene-02',
      start: 'top top',
      end: '+=100%',
      pin: true,
      scrub: 1.2,
    },
  });

  tlScene2
    .fromTo('#portraitZoomImg', { scale: 1 }, { scale: 1.22, duration: 3 })
    .fromTo('#stageStmt1', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1 }, 0.3)
    .to('#stageStmt1', { opacity: 0, y: -20, duration: 0.8 }, 1.8)
    .fromTo('#stageStmt2', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1 }, 2.0);

  // --- SCENE 03: MULTI-PLANE PARALLAX ---
  const tlScene3 = gsap.timeline({
    scrollTrigger: {
      trigger: '#scene-03',
      start: 'top top',
      end: '+=110%',
      pin: true,
      scrub: 1.2,
    },
  });

  tlScene3
    .to('#depthBg', { y: -50, scale: 1.05, duration: 2 }, 0)
    .to('#depthMid', { y: -110, scale: 1.08, duration: 2 }, 0)
    .to('#depthFg', { y: -180, scale: 1.12, duration: 2 }, 0);

  // --- SCENE 04: THE IMAGE JOURNEY (CROSS-DISSOLVE CUTS) ---
  const tlScene4 = gsap.timeline({
    scrollTrigger: {
      trigger: '#scene-04',
      start: 'top top',
      end: '+=180%',
      pin: true,
      scrub: 1,
    },
  });

  tlScene4
    .to('#cut1', { opacity: 1, duration: 0.5 })
    .to('#cut1', { opacity: 0, scale: 1.08, duration: 1 }, '+=0.5')
    .to('#cut2', { opacity: 1, visibility: 'visible', scale: 1, duration: 1 }, '-=0.5')
    .to('#cut2', { opacity: 0, scale: 1.08, duration: 1 }, '+=0.5')
    .to('#cut3', { opacity: 1, visibility: 'visible', scale: 1, duration: 1 }, '-=0.5')
    .to('#cut3', { opacity: 0, scale: 1.08, duration: 1 }, '+=0.5')
    .to('#cut4', { opacity: 1, visibility: 'visible', scale: 1, duration: 1 }, '-=0.5');

  // --- SCENE 05: WIDESCREEN HORIZONTAL PAN TRACK ---
  const panWrap = document.getElementById('horizontalPanWrap');
  if (panWrap) {
    const totalScrollWidth = panWrap.scrollWidth - window.innerWidth;

    gsap.to(panWrap, {
      x: -totalScrollWidth,
      ease: 'none',
      scrollTrigger: {
        trigger: '#scene-05',
        start: 'top top',
        end: () => `+=${totalScrollWidth}`,
        pin: true,
        scrub: 1.2,
        invalidateOnRefresh: true,
      },
    });
  }

  // --- SCENE 06: TYPOGRAPHIC INTERLUDE ---
  const words = document.querySelectorAll('.quote-word');
  const tlScene6 = gsap.timeline({
    scrollTrigger: {
      trigger: '#scene-06',
      start: 'top top',
      end: '+=80%',
      pin: true,
      scrub: 1,
    },
  });

  words.forEach((word) => {
    tlScene6.to(word, {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      duration: 0.3,
    });
  });

  // --- SCENE 07: DETAILS FRAGMENTS ---
  gsap.fromTo(
    '.film-strip-card',
    { opacity: 0, y: 35 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.18,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '#scene-07',
        start: 'top 70%',
      },
    }
  );

  // --- SCENE 08: APERTURE SHIFT ---
  gsap.to('#irisFlare', {
    scale: 22,
    opacity: 0.85,
    ease: 'power1.inOut',
    scrollTrigger: {
      trigger: '#scene-08',
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: 1,
    },
  });

  // --- SCENE 09: EMOTIONAL BUILDUP ---
  const tlScene9 = gsap.timeline({
    scrollTrigger: {
      trigger: '#scene-09',
      start: 'top 65%',
    },
  });

  tlScene9
    .fromTo('#buildupA', { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' })
    .fromTo('#buildupB', { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }, '+=0.3');

  // --- SCENE 10: THE CLIMAX REVEAL ---
  let confettiTriggered = false;

  ScrollTrigger.create({
    trigger: '#scene-10',
    start: 'top 55%',
    onEnter: () => {
      if (!confettiTriggered) {
        confettiTriggered = true;
        fireGoldenConfetti();
      }
    },
  });

  gsap.fromTo(
    '.climax-movie-title, .climax-center-frame, .climax-trigger-wrap',
    { opacity: 0, scale: 0.92, y: 30 },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 1.4,
      stagger: 0.22,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#scene-10',
        start: 'top 70%',
      },
    }
  );

  // --- SCENE 11: PERSONAL MESSAGE LETTER ---
  gsap.fromTo(
    '.film-credits-letter',
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#scene-11',
        start: 'top 70%',
      },
    }
  );

  // --- SCENE 12: OUTRO & CREDITS ---
  gsap.fromTo(
    '.outro-content',
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 1.4,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#scene-12',
        start: 'top 75%',
      },
    }
  );
}

/* ==========================================================================
   6. USER INTERACTIONS
   ========================================================================== */
function setupFilmInteractions() {
  // Start prompt click
  const startPrompt = document.getElementById('filmStartPrompt');
  if (startPrompt) {
    startPrompt.addEventListener('click', () => {
      const target = document.getElementById('scene-02');
      if (target) {
        lenis.scrollTo(target, { duration: 1.4 });
      }
    });
  }

  // Illuminate Celebration Button
  const celebrateBtn = document.getElementById('filmCelebrateBtn');
  if (celebrateBtn) {
    celebrateBtn.addEventListener('click', () => {
      fireGoldenConfetti();
      setTimeout(fireGoldenConfetti, 400);
    });
  }

  // Replay Film Button
  const replayBtn = document.getElementById('filmReplayBtn');
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      lenis.scrollTo(0, { duration: 2.2 });
    });
  }

  // Share Film Button
  const shareBtn = document.getElementById('filmShareBtn');
  const toast = document.getElementById('filmToast');
  const toastText = document.getElementById('filmToastText');

  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const shareData = {
        title: 'Anjali — A Film by Scroll',
        text: 'A cinematic birthday visual film dedicated to Anjali.',
        url: window.location.href,
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
          return;
        } catch (e) {
          // dismissed
        }
      }

      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Film celebration link copied to clipboard!');
      } catch (err) {
        showToast('Share link ready: ' + window.location.href);
      }
    });
  }

  function showToast(msg) {
    if (!toast) return;
    toastText.textContent = msg;
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
  initFilmParticles();
  renderFilmParticles();
  initFilmAnimations();
  setupFilmInteractions();
});
