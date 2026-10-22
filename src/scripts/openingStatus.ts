/**
 * Live "Open Now / Closed Now" badge in the Contact section.
 *
 * Contact.astro renders the badge and everything this script needs, so no content is duplicated here:
 *
 *   <span data-opening-status data-time-zone data-hours data-open-class data-closed-class>   the badge
 *     <span data-status-label="open"   data-ka="…">Open Now</span>
 *     <span data-status-label="closed" data-ka="…" hidden>Closed Now</span>
 *
 * Both labels are in the markup and the inactive one is `hidden`, so the language toggle (which swaps
 * `data-ka` text per element) keeps working in either state without this script knowing about languages.
 *
 * The status is re-evaluated on every wall-clock minute — the timer is re-aimed at the next :00 each time
 * rather than run as a fixed 60 s interval, so it never drifts and flips right at 10:00 / 11:00 / 21:00.
 * It pauses while the tab is hidden or the page is in the back/forward cache, and catches up the moment the
 * page is shown again (background timers are throttled by browsers, so they can't be trusted to be on time).
 */
import { isOpenAt, msUntilNextMinute, type OpeningHours } from './openingHours';

const noop = () => {};

/** Returns a function that stops the timer and removes every listener. */
export function initOpeningStatus() {
  const badge = document.querySelector<HTMLElement>('[data-opening-status]');
  const openLabel = badge?.querySelector<HTMLElement>('[data-status-label="open"]');
  const closedLabel = badge?.querySelector<HTMLElement>('[data-status-label="closed"]');
  const { timeZone, hours, openClass, closedClass } = badge?.dataset ?? {};
  if (!badge || !openLabel || !closedLabel || !timeZone || !hours || !openClass || !closedClass) return noop;

  let schedule: OpeningHours[];
  try {
    schedule = JSON.parse(hours);
  } catch {
    return noop;
  }

  let timer: number | undefined;

  const render = () => {
    const open = isOpenAt(Date.now(), schedule, timeZone);
    badge.classList.toggle(openClass, open);
    badge.classList.toggle(closedClass, !open);
    openLabel.hidden = !open;
    closedLabel.hidden = open;
  };

  const stop = () => {
    window.clearTimeout(timer);
    timer = undefined;
  };

  const tick = () => {
    // The badge was removed from the document (e.g. the page content was swapped): nothing left to update.
    if (!badge.isConnected) return dispose();

    try {
      render();
    } catch {
      // Engine without Intl timezone support: leave the markup as rendered rather than retry forever.
      return dispose();
    }
    timer = window.setTimeout(tick, msUntilNextMinute(Date.now()));
  };

  const start = () => {
    stop();
    tick();
  };

  const onVisibilityChange = () => (document.hidden ? stop() : start());
  const onPageShow = (event: PageTransitionEvent) => {
    if (event.persisted) start();
  };

  function dispose() {
    stop();
    document.removeEventListener('visibilitychange', onVisibilityChange);
    window.removeEventListener('pagehide', stop);
    window.removeEventListener('pageshow', onPageShow);
  }

  document.addEventListener('visibilitychange', onVisibilityChange);
  window.addEventListener('pagehide', stop);
  window.addEventListener('pageshow', onPageShow);

  start();
  return dispose;
}
