import type { ImageMetadata } from 'astro';
import { menuImages as img } from '@/assets/menu';
import churchkhela from '@/assets/placeholders/churchkhela.jpg';
import iceCreamCoffee from '@/assets/placeholders/ice-cream-coffee.jpg';
import type { Localized } from '@/i18n/languages';

export type MenuItem = {
  name: Localized;
  /** Price in GEL (₾). Omit for items without a price yet. */
  price?: number;
  image: ImageMetadata;
};

export type MenuCategory = {
  id: string;
  title: Localized;
  /** Picture shown on the category button. */
  thumbnail: ImageMetadata;
  /** Items are listed in groups; a divider line is drawn between groups (e.g. price tiers). */
  groups: MenuItem[][];
};

/*
 * Menu content. Item photos come from src/assets/menu; the two items that have no photo yet
 * (Ice-Cream Coffee, Churchkhela) use stock placeholders from src/assets/placeholders.
 */
export const menuCategories: MenuCategory[] = [
  {
    id: 'hot',
    title: { en: 'Hot Drinks', ka: 'ცხელი სასმელები' },
    thumbnail: img.flatWhite,
    groups: [
      [
        { name: { en: 'Espresso', ka: 'ესპრესო' }, price: 7, image: img.espresso },
        { name: { en: 'Americano', ka: 'ამერიკანო' }, price: 7, image: img.americano },
        { name: { en: 'Long Black', ka: 'ლონგ ბლექი' }, price: 7, image: img.longBlack },
        { name: { en: 'V60', ka: 'V60' }, price: 7, image: img.v60 },
        { name: { en: 'Cappuccino', ka: 'კაპუჩინო' }, price: 9, image: img.cappuccino },
        { name: { en: 'Latte', ka: 'ლატე' }, price: 9, image: img.latte },
        { name: { en: 'Flat White', ka: 'ფლეთ უაითი' }, price: 9, image: img.flatWhite },
        { name: { en: 'Cortado', ka: 'კორტადო' }, price: 9, image: img.cortado },
        { name: { en: 'Hot Chocolate', ka: 'ცხელი შოკოლადი' }, price: 9, image: img.hotChocolate },
        { name: { en: 'Tea', ka: 'ჩაი' }, price: 4, image: img.tea },
        { name: { en: 'Turkish Coffee', ka: 'თურქული ყავა' }, price: 4, image: img.turkishCoffee },
      ],
    ],
  },
  {
    id: 'iced',
    title: { en: 'Iced Drinks', ka: 'ყინულიანი სასმელები' },
    thumbnail: img.icedLatte,
    groups: [
      [
        { name: { en: 'Espresso', ka: 'ესპრესო' }, price: 9, image: img.espresso },
        { name: { en: 'Americano', ka: 'ამერიკანო' }, price: 9, image: img.icedAmericano },
        { name: { en: 'V60', ka: 'V60' }, price: 9, image: img.v60 },
        { name: { en: 'Cappuccino', ka: 'კაპუჩინო' }, price: 11, image: img.icedCappuccino },
        { name: { en: 'Latte', ka: 'ლატე' }, price: 11, image: img.icedLatte },
        { name: { en: 'Cortado', ka: 'კორტადო' }, price: 11, image: img.cortado },
        { name: { en: 'Tea', ka: 'ჩაი' }, price: 6, image: img.tea },
      ],
    ],
  },
  {
    id: 'special',
    title: { en: 'Special Drinks', ka: 'სპეციალური სასმელები' },
    thumbnail: img.strawberryLemonade,
    groups: [
      [
        { name: { en: 'Ice-Cream Coffee', ka: 'ნაყინიანი ყავა' }, price: 12, image: iceCreamCoffee },
        { name: { en: 'Bumble Coffee', ka: 'ბამბლ ყავა' }, price: 12, image: img.bumbleCoffee },
        { name: { en: 'Espresso Tonic', ka: 'ესპრესო ტონიკი' }, price: 12, image: img.espressoTonic },
        { name: { en: 'Strawberry Latte', ka: 'მარწყვის ლატე' }, price: 12, image: img.strawberryLatte },
        {
          name: { en: 'Pineapple & Coconut Lemonade', ka: 'ანანასისა და ქოქოსის ლიმონათი' },
          price: 12,
          image: img.pineappleCoconutLemonade,
        },
        {
          name: { en: 'Forest Fruit Lemonade', ka: 'ტყის კენკროვანთა ლიმონათი' },
          price: 12,
          image: img.forestFruitLemonade,
        },
        { name: { en: 'Maracuja Lemonade', ka: 'მარაკუიას ლიმონათი' }, price: 12, image: img.maracujaLemonade },
        { name: { en: 'Strawberry Lemonade', ka: 'მარწყვის ლიმონათი' }, price: 12, image: img.strawberryLemonade },
      ],
    ],
  },
  {
    id: 'cocktails',
    title: { en: 'Cocktails', ka: 'კოქტეილები' },
    thumbnail: img.pinkVelvet,
    groups: [
      [
        { name: { en: 'Vodka Sunrise', ka: 'ვოდკა სანრაიზი' }, price: 18, image: img.vodkaSunrise },
        {
          name: { en: 'Gin Tonic / Gin & Juice', ka: 'ჯინ თონიკი / ჯინი და წვენი' },
          price: 18,
          image: img.ginTonic,
        },
        { name: { en: 'Whiskey-Cola', ka: 'ვისკი-კოლა' }, price: 18, image: img.whiskeyCola },
      ],
      [
        { name: { en: 'Cupy Martini', ka: 'Cupy მარტინი' }, price: 20, image: img.cupyMartini },
        { name: { en: 'Pink Velvet', ka: 'პინკ ველვეტი' }, price: 20, image: img.pinkVelvet },
        { name: { en: 'Irish Cupy', ka: 'Irish Cupy' }, price: 20, image: img.irishCupy },
      ],
    ],
  },
  {
    id: 'matcha',
    title: { en: 'Matcha', ka: 'მაჩა' },
    thumbnail: img.icedMatchaLatte,
    groups: [
      [
        { name: { en: 'Tea', ka: 'ჩაი' }, price: 10, image: img.matcha },
        { name: { en: 'Latte', ka: 'ლატე' }, price: 10, image: img.matchaLatte },
      ],
      [
        { name: { en: 'Iced Latte', ka: 'ცივი ლატე' }, price: 15, image: img.icedMatchaLatte },
        { name: { en: 'Dirty', ka: 'დირთი' }, price: 15, image: img.dirtyMatchaLatte },
        { name: { en: 'Tonic', ka: 'ტონიკი' }, price: 15, image: img.matchaTonic },
        { name: { en: 'Strawberry', ka: 'მარწყვის' }, price: 15, image: img.strawberryMatchaLatte },
      ],
    ],
  },
  {
    id: 'edibles',
    title: { en: 'Edibles', ka: 'საჭმელები' },
    thumbnail: img.hamCheeseSandwich,
    groups: [
      [
        { name: { en: 'Chicken Croissant', ka: 'ქათმის კრუასანი' }, price: 12, image: img.chickenCroissant },
        {
          name: { en: 'Ham & Cheese Sandwich', ka: 'ლორისა და ყველის სენდვიჩი' },
          price: 12,
          image: img.hamCheeseSandwich,
        },
        { name: { en: 'Veggie Sandwich', ka: 'ვეგეტარიანული სენდვიჩი' }, price: 12, image: img.veggie },
      ],
      [
        { name: { en: 'Tiramisu', ka: 'ტირამისუ' }, price: 12, image: img.tiramisu },
        {
          name: { en: 'Mango-Maracuja Panna Cotta', ka: 'მანგო-მარაკუიას პანა-კოტა' },
          price: 10,
          image: img.mangoMaracujaPannaCotta,
        },
        { name: { en: 'Churchkhela', ka: 'ჩურჩხელა' }, price: 5, image: churchkhela },
      ],
    ],
  },
  {
    id: 'other',
    title: { en: 'Other', ka: 'სხვა' },
    thumbnail: img.coffeeBeans,
    groups: [
      [
        { name: { en: 'Coffee Beans', ka: 'ყავის მარცვლები' }, image: img.coffeeBeans },
        { name: { en: 'Turkish Ground Coffee', ka: 'დაფქული თურქული ყავა' }, image: img.turkishGroundCoffee },
      ],
    ],
  },
];
