import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
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
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
})
export class LanguageSelectorComponent implements OnInit {
  langForm!: FormGroup;
  dropdownOpen = false;

  languages: Language[] = [
    {
      code: 'ita',
      labelShort: 'ITA',
      label: "ITALIANO",
      flag: '/flags/flag-ita.png',
    },
    {
      code: 'eng',
      labelShort: 'ENG',
      label: 'ENGLISH',
      flag: '/flags/flag-ita.png',
    },
    // Add more languages as desired
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.langForm = this.fb.group({
      selectedLanguage: ['ita'], // default
    });
  }

  // Convenience getter to read the current language code
  get selectedLanguageCode(): string {
    return this.langForm.get('selectedLanguage')?.value;
  }

  // Finds the currently selected Language object
  get currentLanguage(): Language | undefined {
    return this.languages.find(
      (lang) => lang.code === this.selectedLanguageCode
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
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectLanguage(lang: Language): void {
    this.langForm.patchValue({ selectedLanguage: lang.code });
    this.dropdownOpen = false;
  }
}
