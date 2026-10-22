/**
 * Hero carousel: a horizontally scrolling, scroll-snapping track of full-width slides.
 * Scrolling stays native (touch, trackpad, keyboard); this adds the arrows, dots and gentle autoplay.
 *
 * Timing matches the original page: a 5 s tick that skips while the track has moved in the last 6 s.
 * Because the autoplay scroll itself counts as movement, slides advance after 5 s the first time and then
 * roughly every 10 s. Autoplay is off for visitors who prefer reduced motion, and holds still while the
 * carousel is hovered or has keyboard focus.
 */
const AUTOPLAY_TICK_MS = 5000;
const QUIET_PERIOD_MS = 6000;

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** True while the visitor is mid-interaction: mouse resting on the carousel, or keyboard focus inside it. */
function isBeingUsed(root: HTMLElement) {
  const hovered = window.matchMedia('(hover: hover)').matches && root.matches(':hover');
  return hovered || root.querySelector(':focus-visible') !== null;
}

function initCarousel(root: HTMLElement) {
  const track = root.querySelector<HTMLElement>('[data-carousel-track]');
  const dots = Array.from(root.querySelectorAll<HTMLElement>('[data-carousel-dot]'));
  if (!track || dots.length === 0) return;

  const slideCount = dots.length;
  let lastMovement = 0;

  // Off-screen slides are lazy in the markup (so they stay out of the critical path); once the page has
  // loaded, fetch them in the background so a swipe never reveals an empty slide.
  const preloadSlides = () => track.querySelectorAll<HTMLImageElement>('img[loading="lazy"]').forEach((img) => (img.loading = 'eager'));
  if (document.readyState === 'complete') preloadSlides();
  else window.addEventListener('load', preloadSlides, { once: true });

  const currentIndex = () => (track.clientWidth > 0 ? Math.round(track.scrollLeft / track.clientWidth) : 0);

  const goTo = (index: number) => {
    track.scrollTo({ left: index * track.clientWidth, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };

  const step = (direction: 1 | -1) => {
    lastMovement = Date.now();
    goTo((currentIndex() + direction + slideCount) % slideCount);
  };

  track.addEventListener(
    'scroll',
    () => {
      lastMovement = Date.now();
      const active = currentIndex();
      dots.forEach((dot, index) => dot.setAttribute('aria-current', String(index === active)));
    },
    { passive: true },
  );

  root.querySelector('[data-carousel-prev]')?.addEventListener('click', () => step(-1));
  root.querySelector('[data-carousel-next]')?.addEventListener('click', () => step(1));
  dots.forEach((dot, index) => dot.addEventListener('click', () => goTo(index)));

  if (!prefersReducedMotion()) {
    window.setInterval(() => {
      if (Date.now() - lastMovement < QUIET_PERIOD_MS || isBeingUsed(root)) return;
      goTo((currentIndex() + 1) % slideCount);
    }, AUTOPLAY_TICK_MS);
  }
}

export function initCarousels() {
  document.querySelectorAll<HTMLElement>('[data-carousel]').forEach(initCarousel);
}
