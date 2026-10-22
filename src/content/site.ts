/**
 * Business facts shown in the Contact section and reused for metadata / structured data.
 * Edit them here; nothing else in the codebase hard-codes them.
 */

export type Weekday = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export const site = {
  name: 'cupy coffee bar',
  /** Kept exactly as in the original page. */
  title: 'cupy • ქაფი — coffee bar',
  /** Composed only from facts already on the page (brand, slogan, address). */
  description: 'cupy | coffee bar — coffee.moves.friendship. 148 Aghmashenebli Ave., Tbilisi, Georgia.',
  address: {
    streetAddress: '148 Aghmashenebli Ave.',
    locality: 'Tbilisi',
    country: 'GE',
  },
  phone: '+995 599 79 12 18',
  email: 'coffee.moves.friendship@gmail.com',
  mapEmbedUrl: 'https://www.google.com/maps?q=148+Aghmashenebli+Ave.%2C+Tbilisi%2C+Georgia&output=embed',
  socials: [
    { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/cupy.coffeebar/' },
    { id: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/coffee.moves.friendship/' },
    { id: 'tiktok', label: 'TikTok', href: 'https://www.tiktok.com/@coffee.moves.friendship' },
  ],
  /** The timezone `hours` are written in. "Open now" is always evaluated here, wherever the visitor is. */
  timeZone: 'Asia/Tbilisi',
  hours: [
    { day: 'mon', opens: '10:00', closes: '21:00' },
    { day: 'tue', opens: '10:00', closes: '21:00' },
    { day: 'wed', opens: '10:00', closes: '21:00' },
    { day: 'thu', opens: '10:00', closes: '21:00' },
    { day: 'fri', opens: '10:00', closes: '21:00' },
    { day: 'sat', opens: '11:00', closes: '21:00' },
    { day: 'sun', opens: '11:00', closes: '21:00' },
  ] satisfies { day: Weekday; opens: string; closes: string }[],
} as const;

/** `+995 599 79 12 18` -> `tel:+995599791218` */
export const phoneHref = `tel:${site.phone.replace(/[^\d+]/g, '')}`;
