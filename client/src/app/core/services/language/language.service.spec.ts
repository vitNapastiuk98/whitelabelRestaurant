import { TestBed } from '@angular/core/testing';
import { LanguageService } from './language.service';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {HttpClientService} from '../httpClient/http-client.service';
import {provideHttpClient} from '@angular/common/http';

describe('LanguageService', () => {
  let service: LanguageService;
  let httpService: HttpClientService;
  let httpMock: HttpTestingController;
  const API_URL = 'http://your-api-url.com/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [LanguageService, HttpClientService,
      provideHttpClient(),
      provideHttpClientTesting()]
    });
    service = TestBed.inject(LanguageService);
    httpService = TestBed.inject(HttpClientService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve the selected language from localStorage if available', () => {
    localStorage.setItem('selectedLanguage', 'italian');
    const lang = service.getSelectedLanguage();
    expect(lang).toBe('italian');
  });

  it('should return a language based on navigator.language if no selection is stored', () => {
    const originalLanguage = navigator.language;
    // Override navigator.language (note: in real tests use proper mocks)
    Object.defineProperty(navigator, 'language', { value: 'ru-RU', configurable: true });
    const lang = service.getSelectedLanguage();
    expect(lang).toBe('russian');
    Object.defineProperty(navigator, 'language', { value: originalLanguage, configurable: true });
  });

  it('should load language strings for a supported language', () => {
    const dummyStrings = { welcome: 'Benvenuto' };
    service.loadLanguageStrings('italian').subscribe(strings => {
      expect(strings).toEqual(dummyStrings);
    });
    const req = httpMock.expectOne(`${API_URL}/language/italian`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyStrings);
  });

  it('should fall back to english if an unsupported language is provided', () => {
    const dummyStrings = { welcome: 'Welcome' };
    service.loadLanguageStrings('unsupported').subscribe(strings => {
      expect(strings).toEqual(dummyStrings);
    });
    const req = httpMock.expectOne(`${API_URL}/language/english`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyStrings);
  });
});
