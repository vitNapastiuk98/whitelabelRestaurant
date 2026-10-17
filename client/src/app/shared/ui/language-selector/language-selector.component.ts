import { Component, signal } from '@angular/core';

import {CommonModule} from '@angular/common';

interface Language {
  code: string;
  label: string;
  labelShort: string;
  flag: string; // path or URL to flag image
}

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class LanguageSelectorComponent {
  readonly selectedLanguageCode = signal('ita');
  readonly dropdownOpen = signal(false);

  languages: Language[] = [
    {
      code: 'ita',
      labelShort: 'ITA',
      label: "ITALIANO",
      flag: '/flags/flag-ita.png',
    },
    // Add more languages as desired
  ];

  // Finds the currently selected Language object
  get currentLanguage(): Language | undefined {
    return this.languages.find(
      (lang) => lang.code === this.selectedLanguageCode()
    );
  }

  // Flag, label, etc. for the currently selected language
  get currentFlag(): string {
    return this.currentLanguage?.flag || '';
  }

  get currentLabel(): string {
    return this.currentLanguage?.label || '';
  }

  get currentShortLabel() {
    return this.currentLanguage?.labelShort || '';
  }

  toggleDropdown(): void {
    this.dropdownOpen.update(open => !open);
  }

  selectLanguage(lang: Language): void {
    this.selectedLanguageCode.set(lang.code);
    this.dropdownOpen.set(false);
  }
}
