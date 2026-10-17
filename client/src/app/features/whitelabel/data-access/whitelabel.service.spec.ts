import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApplicationRef, DOCUMENT } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { IWhitelabel } from '../domain/whitelabel.model';
import { WhitelabelService } from './whitelabel.service';

describe('WhitelabelService', () => {
  let service: WhitelabelService;
  let http: HttpTestingController;
  const colors = { primary: '#ffff00', background: '#101010', text: '#eeeeee', button: '#111111' };
  const token = (name: string) => TestBed.inject(DOCUMENT).documentElement.style.getPropertyValue(`--restaurant-${name}`);
  const settle = async () => {
    await TestBed.inject(ApplicationRef).whenStable();
    TestBed.tick();
  };
  const load = async (config: IWhitelabel) => {
    service.load();
    TestBed.tick();
    const request = http.expectOne('/api/whitelabel');
    expect(request.request.method).toBe('GET');
    request.flush(config);
    await settle();
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [WhitelabelService, provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(WhitelabelService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    const style = TestBed.inject(DOCUMENT).documentElement.style;
    ['green', 'paper', 'ink', 'button', 'on-primary', 'on-button'].forEach(name => style.removeProperty(`--restaurant-${name}`));
  });

  it('waits for explicit loading and exposes the resource loading state', async () => {
    TestBed.tick();
    http.expectNone('/api/whitelabel');
    expect(service.whitelabelId).toBeNull();
    expect(service.resource.isLoading()).toBeFalse();
    service.load();
    TestBed.tick();
    expect(service.resource.isLoading()).toBeTrue();
    expect(service.config()).toBeNull();
    http.expectOne('/api/whitelabel').flush({ whitelabelId: 'tenant' });
    await settle();
    expect(service.whitelabelId).toBe('tenant');
    expect(service.resource.isLoading()).toBeFalse();
    expect(service.resource.error()).toBeUndefined();
  });

  it('exposes a first load error and recovers when loading is retried', async () => {
    service.load();
    TestBed.tick();
    http.expectOne('/api/whitelabel').flush({ message: 'Unavailable' }, { status: 503, statusText: 'Unavailable' });
    await settle();
    expect(service.resource.error()).toBeDefined();
    expect(service.config()).toBeNull();
    expect(service.resource.isLoading()).toBeFalse();
    await load({ whitelabelId: 'recovered' });
    expect(service.whitelabelId).toBe('recovered');
    expect(service.resource.error()).toBeUndefined();
  });

  it('retains the last good config and palette while reloading and after a reload failure', async () => {
    await load({ whitelabelId: 'tenant', colors });
    const previous = service.config();
    service.load();
    TestBed.tick();
    expect(service.resource.isLoading()).toBeTrue();
    expect(service.config()).toBe(previous);
    http.expectOne('/api/whitelabel').error(new ProgressEvent('Network error'));
    await settle();
    expect(service.resource.error()).toBeDefined();
    expect(service.config()).toBe(previous);
    expect(token('green')).toBe(colors.primary);
  });

  it('updates public content only after a save succeeds', () => {
    const menu = { title: 'Dinner', description: 'Fresh pasta', categories: [] };
    service.saveSection('menu', menu).subscribe();
    expect(service.config()).toBeNull();
    const request = http.expectOne('/api/content/menu');
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(menu);
    request.flush({ whitelabelId: 'tenant', content: { menu } });
    expect(service.config()?.content?.menu).toEqual(menu);
  });

  it('applies loaded colors and readable foregrounds for light and dark fills', async () => {
    await load({ whitelabelId: 'tenant', colors });
    expect(token('green')).toBe(colors.primary);
    expect(token('paper')).toBe(colors.background);
    expect(token('ink')).toBe(colors.text);
    expect(token('button')).toBe(colors.button);
    expect(token('on-primary')).toBe('#000000');
    expect(token('on-button')).toBe('#ffffff');
  });

  it('applies saved colors only after the HTTP response succeeds', () => {
    TestBed.tick();
    service.saveSettings({ colors }).subscribe();
    expect(token('green')).toBe('#344e41');
    const request = http.expectOne('/api/whitelabel');
    expect(request.request.method).toBe('PUT');
    request.flush({ whitelabelId: 'tenant', colors: { ...colors, primary: '#222222', button: '#ffffff' } });
    TestBed.tick();
    expect(token('green')).toBe('#222222');
    expect(token('on-primary')).toBe('#ffffff');
    expect(token('on-button')).toBe('#000000');
  });

  it('retains the existing config and palette when a settings save fails', () => {
    service.config.set({ whitelabelId: 'tenant', colors });
    TestBed.tick();
    const previous = service.config();
    let failed = false;
    service.saveSettings({ colors: { ...colors, primary: '#ffffff' } }).subscribe({ error: () => { failed = true; } });
    http.expectOne('/api/whitelabel').flush({ message: 'Invalid colors' }, { status: 400, statusText: 'Bad Request' });
    TestBed.tick();
    expect(failed).toBeTrue();
    expect(service.config()).toBe(previous);
    expect(token('green')).toBe(colors.primary);
  });

  it('restores default colors when loading an existing record without a palette', async () => {
    service.config.set({ whitelabelId: 'tenant', colors });
    TestBed.tick();
    await load({ whitelabelId: 'legacy' });
    expect(token('green')).toBe('#344e41');
    expect(token('paper')).toBe('#edede9');
    expect(token('ink')).toBe('#171a17');
    expect(token('button')).toBe('#000000');
    expect(token('on-primary')).toBe('#ffffff');
    expect(token('on-button')).toBe('#ffffff');
  });
});
