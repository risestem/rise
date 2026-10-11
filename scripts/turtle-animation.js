// Native page scrolling works with touch, wheels, keyboards and scrollbars.
const track = document.getElementById('animationContainer');
const stage = track.querySelector('.animation-stage');
const frame = document.getElementById('videoFrame');
const sections = [...track.querySelectorAll('.scroll-text-section')];
const segments = [...track.querySelectorAll('.scrollbar-segment')];
const totalFrames = 150;
const frameURL = number => `/v5_webp/turtleExplodev5${String(number).padStart(5, '0')}.webp`;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const cache = new Map();
let desiredFrame = 1;
let displayedFrame = 1;
let scheduled = false;

// Keep the previous decoded frame visible while the next one downloads.
// Bound the cache and preload only nearby frames, rather than 100 on arrival.
function loadFrame(number) {
  if (cache.has(number)) return cache.get(number);
  const image = new Image();
  const loaded = new Promise(resolve => {
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
  });
  cache.set(number, loaded);
  image.src = frameURL(number);
  if (cache.size > 12) cache.delete(cache.keys().next().value);
  return loaded;
}

function updateFrame(number) {
  desiredFrame = number;
  if (number === displayedFrame) return;
  loadFrame(number).then(image => {
    if (!image || desiredFrame !== number) return;
    frame.src = image.src;
    displayedFrame = number;
    const next = Math.min(totalFrames, number + 1);
    const previous = Math.max(1, number - 1);
    loadFrame(next);
    loadFrame(previous);
  });
}

function update() {
  scheduled = false;
  const rect = track.getBoundingClientRect();
  const top = parseFloat(getComputedStyle(stage).top) || 0;
  const distance = Math.max(1, track.offsetHeight - stage.offsetHeight);
  const progress = Math.max(0, Math.min(1, (top - rect.top) / distance));
  const number = reducedMotion.matches ? 1 : Math.round(progress * (totalFrames - 1)) + 1;
  updateFrame(number);
  const active = Math.min(sections.length - 1, Math.floor(progress * sections.length));
  sections.forEach((section, index) => {
    section.classList.toggle('active', index === active);
    section.setAttribute('aria-hidden', String(index !== active));
    segments[index].classList.toggle('active', index === active);
    segments[index].setAttribute('aria-pressed', String(index === active));
  });
}

function scheduleUpdate() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(update);
}

function measureHeader() {
  const height = document.querySelector('#header-container nav')?.getBoundingClientRect().height || 96;
  track.style.setProperty('--header-height', `${height + 8}px`);
  scheduleUpdate();
}

segments.forEach((segment, index) => {
  segment.addEventListener('click', () => {
    const top = parseFloat(getComputedStyle(stage).top) || 0;
    const distance = track.offsetHeight - stage.offsetHeight;
    window.scrollTo({
      top: window.scrollY + track.getBoundingClientRect().top - top + distance * (index / sections.length + 0.01),
      behavior: reducedMotion.matches ? 'instant' : 'smooth'
    });
  });
});
window.addEventListener('scroll', scheduleUpdate, { passive: true });
window.addEventListener('resize', measureHeader);
reducedMotion.addEventListener('change', scheduleUpdate);
document.addEventListener('header:loaded', () => {
  measureHeader();
  const nav = document.querySelector('#header-container nav');
  if (nav) new ResizeObserver(measureHeader).observe(nav);
});
measureHeader();
update();

const video = document.getElementById('turtleDrawVideo');
const timestamps = [
  { start: 0, end: 1, id: 'code-line-pendown' },
  { start: 1, end: 3, id: 'code-line-forward' },
  { start: 3.5, end: 4.5, id: 'code-line-penup' }
];
video.addEventListener('timeupdate', () => {
  const active = timestamps.find(item => video.currentTime >= item.start && video.currentTime < item.end);
  document.querySelectorAll('.code-line').forEach(line => {
    line.classList.toggle('highlighted', line.id === active?.id);
  });
});
new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (entry.isIntersecting && !reducedMotion.matches) video.play().catch(() => {});
    else video.pause();
  }
}, { threshold: 0.25 }).observe(video);
