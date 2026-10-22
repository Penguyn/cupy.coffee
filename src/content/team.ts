import type { ImageMetadata } from 'astro';
import baia from '@/assets/team/baia.jpg';
import beso from '@/assets/team/beso.jpg';
import miriani from '@/assets/team/miriani.jpg';
import type { Localized } from '@/i18n/languages';

export type TeamMember = {
  id: string;
  name: Localized;
  role: Localized;
  photo: ImageMetadata;
};

const coFounder: Localized = { en: 'Co-founder & Barista', ka: 'თანადამფუძნებელი და ბარისტა' };

export const team: TeamMember[] = [
  { id: 'baia', name: { en: 'Baia', ka: 'ბაია' }, role: coFounder, photo: baia },
  { id: 'beso', name: { en: 'Beso', ka: 'ბესო' }, role: coFounder, photo: beso },
  { id: 'miriani', name: { en: 'Miriani', ka: 'მირიანი' }, role: coFounder, photo: miriani },
];
