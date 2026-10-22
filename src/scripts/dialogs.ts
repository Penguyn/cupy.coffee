/**
 * Wires up the native <dialog> modals (menu categories, story).
 *
 * The browser already provides the focus trap, Escape to close, an inert page behind the dialog and focus
 * return to the opener. This adds: opening from a trigger, the Close button, closing by clicking the
 * backdrop, resetting the panel's scroll position, and keeping the page behind the dialog from scrolling.
 *
 * The page is deliberately NOT frozen with `overflow: hidden`: that makes the browser re-evaluate `vw`
 * units (the hero height and section padding use them), so the whole page would jump by a few pixels
 * behind the dialog. Instead, scrolling that would reach the page is cancelled at the dialog.
 */
const SCROLL_KEYS = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ']);

function preventPageScroll(dialog: HTMLDialogElement) {
  const panel = dialog.querySelector<HTMLElement>('[data-dialog-panel]');
  if (!panel) return;

  const panelCanScroll = () => panel.scrollHeight > panel.clientHeight;

  // Wheel / touch: allowed only inside a panel that actually overflows (its own scrolling stays native;
  // `overscroll-behavior: contain` in the CSS stops it chaining to the page at the ends).
  const cancelOutsidePanel = (event: Event) => {
    if (!panelCanScroll() || !panel.contains(event.target as Node)) event.preventDefault();
  };
  dialog.addEventListener('wheel', cancelOutsidePanel, { passive: false });
  dialog.addEventListener('touchmove', cancelOutsidePanel, { passive: false });

  // Keyboard: arrow / page keys would scroll the page when the panel has nothing to scroll.
  // Space on a button must still activate it.
  dialog.addEventListener('keydown', (event) => {
    if (!SCROLL_KEYS.has(event.key) || panelCanScroll()) return;
    if (event.key === ' ' && event.target instanceof HTMLButtonElement) return;
    event.preventDefault();
  });
}

function initDialog(dialog: HTMLDialogElement) {
  preventPageScroll(dialog);

  // A click closes the dialog only if it both started and ended on the backdrop, so dragging a text
  // selection out of the panel doesn't dismiss it.
  let pointerDownOnBackdrop = false;
  dialog.addEventListener('pointerdown', (event) => {
    pointerDownOnBackdrop = event.target === dialog;
  });
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog && pointerDownOnBackdrop) dialog.close();
  });

  dialog.querySelectorAll('[data-dialog-close]').forEach((button) => {
    button.addEventListener('click', () => dialog.close());
  });
}

function initTrigger(trigger: HTMLElement) {
  trigger.addEventListener('click', () => {
    const dialog = document.getElementById(trigger.dataset.dialogOpen ?? '');
    if (!(dialog instanceof HTMLDialogElement) || dialog.open) return;

    dialog.showModal();
    // Only a rendered element can scroll, so reset after showing; the panel is still transparent at this point.
    dialog.querySelector('[data-dialog-panel]')?.scrollTo(0, 0);
  });
}

export function initDialogs() {
  document.querySelectorAll<HTMLDialogElement>('dialog[data-dialog]').forEach(initDialog);
  document.querySelectorAll<HTMLElement>('[data-dialog-open]').forEach(initTrigger);
}
