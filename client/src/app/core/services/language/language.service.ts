import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClientService} from '../httpClient/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private supportedLanguages = ['english', 'italian',
    'russian', 'spanish', 'chinese', 'korean'];

  constructor(private httpService: HttpClientService) {}

  /**
   * Returns the selected language from localStorage if available,
   * otherwise determines it from the browser's navigator.language.
   */
  getSelectedLanguage(): string {
    const storedLang = localStorage.getItem('selectedLanguage');
    if (storedLang && this.supportedLanguages.includes(storedLang.toLowerCase())) {
      return storedLang.toLowerCase();
    }
    const browserLang = navigator.language.split('-')[0].toLowerCase();
    switch (browserLang) {
      case 'en':
        return 'english';
      case 'it':
        return 'italian';
      case 'ru':
        return 'russian';
      case 'es':
        return 'spanish';
      case 'zh':
        return 'chinese';
      case 'ko':
        return 'korean';
      default:
        return 'english';
    }
  }

  /**
   * Loads the language JSON file for the given language (or the selected language).
   */
  loadLanguageStrings(lang?: string): Observable<any> {
    const language = lang ? lang.toLowerCase() : this.getSelectedLanguage();
    // Fallback to English if the language is not supported.
    if (!this.supportedLanguages.includes(language)) {
      return this.httpService.getLanguage('english');
    }
    return this.httpService.getLanguage(language);
  }

  /**
   * Allows setting a selected language and stores it in localStorage.
   */
  setSelectedLanguage(lang: string): void {
    if (this.supportedLanguages.includes(lang.toLowerCase())) {
      localStorage.setItem('selectedLanguage', lang.toLowerCase());
    }
  }
}
