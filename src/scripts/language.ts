/**
 * Language toggle.
 *
 * The page is rendered in English. Every translatable element also carries its Georgian text in a data
 * attribute, so switching is a pure DOM swap — instant, no reload, scroll position and open dialogs untouched:
 *
 *   <h2 data-ka="ერთი სივრცე">One Space</h2>                      -> element text
 *   <button aria-label="Next" data-ka-aria-label="შემდეგი">        -> attribute (aria-label, title or alt)
 *
 * The original English is remembered the first time an element is translated, so toggling back restores it.
 */
type Language = 'en' | 'ka';

const TRANSLATABLE_ATTRIBUTES = ['aria-label', 'title', 'alt'] as const;

function translate(language: Language) {
  for (const element of document.querySelectorAll<HTMLElement>('[data-ka]')) {
    element.dataset.en ??= element.textContent ?? '';
    element.textContent = language === 'ka' ? (element.dataset.ka ?? '') : element.dataset.en;
  }

  for (const attribute of TRANSLATABLE_ATTRIBUTES) {
    for (const element of document.querySelectorAll<HTMLElement>(`[data-ka-${attribute}]`)) {
      const original = `data-en-${attribute}`;
      if (!element.hasAttribute(original)) element.setAttribute(original, element.getAttribute(attribute) ?? '');
      const value = element.getAttribute(language === 'ka' ? `data-ka-${attribute}` : original) ?? '';
      element.setAttribute(attribute, value);
    }
  }
}

export function initLanguageToggle() {
  const buttons = document.querySelectorAll<HTMLButtonElement>('[data-lang-button]');

  for (const button of buttons) {
    button.addEventListener('click', () => {
      const language = button.dataset.langButton as Language;
      if (document.documentElement.lang === language) return;

      document.documentElement.lang = language;
      translate(language);
      for (const other of buttons) other.setAttribute('aria-pressed', String(other === button));
    });
  }
}
