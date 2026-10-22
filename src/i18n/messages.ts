import type { Language } from './languages';

/*
 * UI copy for every language. English is the source of truth for the shape:
 * the Georgian dictionary must provide exactly the same keys (enforced by `Messages`).
 */
const en = {
  brandName: 'cupy | coffee bar',
  nav: { menu: 'Menu', team: 'Team', contact: 'Contact' },
  hero: { slogan: 'coffee.moves.friendship' },
  space: {
    eyebrow: 'The space',
    heading: 'One Space, Three Faces',
    faces: [
      { title: 'Takeaway', body: 'You can takeaway our honest drinks and edibles with you.' },
      { title: 'Workstation', body: 'You can have a calm workday in a creative space.' },
      { title: 'Social Space', body: 'After a hard day you can socialize with your friends or find new ones.' },
    ],
  },
  menu: {
    eyebrow: 'What we pour',
    heading: 'Menu',
    sub: "Tap a category to see everything we've got.",
  },
  team: {
    eyebrow: 'Behind the counter',
    heading: 'Team & Story',
    sub: 'The people who started cupy — and the ones who keep it running.',
    storyButton: 'Story',
    storyHeading: 'Our Story',
  },
  contact: {
    eyebrow: 'Find us',
    heading: 'Contact',
    hoursLabel: 'Opening Hours',
    statusOpen: 'Open Now',
    statusClosed: 'Closed',
    days: {
      mon: 'Monday',
      tue: 'Tuesday',
      wed: 'Wednesday',
      thu: 'Thursday',
      fri: 'Friday',
      sat: 'Saturday',
      sun: 'Sunday',
    },
    address: '148 Aghmashenebli Ave., Tbilisi, Georgia',
    followUs: 'Follow us',
  },
  footer: '© 2026 cupy coffee bar. All rights reserved.',
  close: 'Close',
  /* Accessibility-only strings (not visible on screen). */
  a11y: {
    skipToContent: 'Skip to content',
    mainNavigation: 'Main',
    language: 'Language',
    photos: 'Photos',
    previousSlide: 'Previous slide',
    nextSlide: 'Next slide',
    goToSlide: 'Go to slide',
    mapTitle: 'cupy location map',
  },
};

type Widen<T> = T extends string ? string : { [K in keyof T]: Widen<T[K]> };
export type Messages = Widen<typeof en>;

const ka: Messages = {
  brandName: 'cupy | ყავის ბარი',
  nav: { menu: 'მენიუ', team: 'გუნდი', contact: 'კონტაქტი' },
  hero: { slogan: 'ყავა.ამოძრავებს.მეგობრობას' },
  space: {
    eyebrow: 'სივრცე',
    heading: 'ერთი სივრცე, სამი სახე',
    faces: [
      { title: 'წასაღები', body: 'წაიღეთ ჩვენი პატიოსანი სასმელები და საჭმელები თან.' },
      { title: 'სამუშაო სივრცე', body: 'დაისვენეთ და იმუშავეთ მშვიდად, კრეატიულ სივრცეში.' },
      { title: 'სოციალური სივრცე', body: 'რთული დღის შემდეგ დაისვენეთ მეგობრებთან ერთად ან გაიცანით ახლები.' },
    ],
  },
  menu: {
    eyebrow: 'რას გთავაზობთ',
    heading: 'მენიუ',
    sub: 'დააჭირეთ კატეგორიას სრული ასორტიმენტის სანახავად.',
  },
  team: {
    eyebrow: 'ბარის მიღმა',
    heading: 'გუნდი და ისტორია',
    sub: 'ისინი, ვინც cupy დააფუძნა — და ისინი, ვინც დღეს მას განაგრძობენ.',
    storyButton: 'ისტორია',
    storyHeading: 'ჩვენი ისტორია',
  },
  contact: {
    eyebrow: 'გვიპოვეთ',
    heading: 'კონტაქტი',
    hoursLabel: 'სამუშაო საათები',
    statusOpen: 'ღიაა',
    statusClosed: 'დახურულია',
    days: {
      mon: 'ორშაბათი',
      tue: 'სამშაბათი',
      wed: 'ოთხშაბათი',
      thu: 'ხუთშაბათი',
      fri: 'პარასკევი',
      sat: 'შაბათი',
      sun: 'კვირა',
    },
    address: 'აღმაშენებლის გამზ. 148, თბილისი, საქართველო',
    followUs: 'გამოგვყევით',
  },
  footer: '© 2026 cupy coffee bar. ყველა უფლება დაცულია.',
  close: 'დახურვა',
  /* Not present in the original page (it had English-only aria-labels): please have a native speaker review. */
  a11y: {
    skipToContent: 'მთავარ შინაარსზე გადასვლა',
    mainNavigation: 'მთავარი',
    language: 'ენა',
    photos: 'ფოტოები',
    previousSlide: 'წინა სლაიდი',
    nextSlide: 'შემდეგი სლაიდი',
    goToSlide: 'სლაიდი',
    mapTitle: 'cupy-ს მდებარეობის რუკა',
  },
};

export const messages: Record<Language, Messages> = { en, ka };
