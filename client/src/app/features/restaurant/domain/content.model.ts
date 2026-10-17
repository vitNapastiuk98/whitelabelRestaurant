export type  HomePageItem = {
  file: File | string | null;   // the uploaded file
  text1: string;
  text2: string;
}

export interface AboutSectionData {
  title: string;
  tag1: string;
  tag2: string;
  caption: string;
  content: string;
  image: File | string | null;
}

export interface MenuItem {
  name: string;
  price: number;
  description?: string;
  allergens?: string;
  photo?: string;
}

export interface MenuCategory {
  name: string;        // e.g. "Antipasti", "Primi", ...
  items: MenuItem[];   // each item has name + price
}

export interface EditMenuData {
  title: string;          // e.g. "Menu"
  description: string;    // short text about the menu
  categories: MenuCategory[];
}

// edit-events-data.interface.ts

export interface EventItem {
  photo: File | string | null;
  title: string;
  description: string;
  date: string; // or Date if you prefer
}

export interface EventsData {
  title: string;    // e.g. "Jazz Events"
  subtitle: string; // e.g. "Non perderti i nostri appuntamenti..."
  events: EventItem[];
}
export interface Specialty {
  photo: File | string | null;
  name: string;
  menuLink: string;
}

export interface SpecialtiesData {
  specialties: Specialty[]; // Exactly 3 specialties
}

export interface RestaurantContent {
  home?: { items: HomePageItem[] };
  about?: AboutSectionData;
  menu?: EditMenuData;
  events?: EventsData;
  specialties?: SpecialtiesData;
}
