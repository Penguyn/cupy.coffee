/**
 * Supported UI languages.
 * `code` is a valid BCP 47 tag (Georgian is `ka`); `label` is what the toggle shows.
 */
export const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'ka', label: 'GE' },
] as const;

export type Language = (typeof LANGUAGES)[number]['code'];

export const DEFAULT_LANGUAGE: Language = 'en';

/** A piece of content that exists in every supported language. */
export type Localized = Record<Language, string>;
