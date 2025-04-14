import {Type} from '@angular/core';
import {ModalBase} from '../../content/admin/modals/modal.base';

export type IUser = {
  isAuthenticated: boolean,
  username: string,
  token?: string
}

export type  IWhitelabel = {
  whitelabelId: string;
  logoId: string;
  name: string;
  features: string[];
}

export type  AdminContentItem = {
  editModal: Type<ModalBase>;
  label: string;
  viewComponent: any;
}

export type  HomePageItem = {
  file: File | null;   // the uploaded file
  text1: string;
  text2: string;
}

export interface AboutSectionData {
  title: string;
  tag1: string;
  tag2: string;
  caption: string;
  content: string;
  image: File | null;
}

export interface MenuItem {
  name: string;
  price: number;
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
  photo: File | null;
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
  photo: File | null;
  name: string;
  menuLink: string;
}

export interface SpecialtiesData {
  specialties: Specialty[]; // Exactly 3 specialties
}
