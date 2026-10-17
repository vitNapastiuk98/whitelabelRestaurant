import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { WhitelabelService } from '../../data-access/whitelabel.service';
import { AuthService } from '../../../identity/data-access/auth.service';
import { IWhitelabel } from '../../domain/whitelabel.model';

const config: IWhitelabel = {
  whitelabelId: 'restaurant-one', name: 'Trattoria', domain: 'old.example.com',
  domains: ['old.example.com', 'www.example.com'], contactInfo: { email: 'hello@example.com' }
};

describe('SettingsComponent', async () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let http: HttpTestingController;
  let store: WhitelabelService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([]),
        { provide: AuthService, useValue: { logout: jasmine.createSpy('logout') } }]
    }).compileComponents();
    store = TestBed.inject(WhitelabelService);
    store.config.set(config);
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    TestBed.tick();
  });

  afterEach(() => http.verify());
  async function loadAdmins() {
    http.expectOne('/api/admins').flush([{ _id: 'admin-1', username: 'owner' }]);
    await fixture.whenStable();
    TestBed.tick();
  }

  it('loads admins and shows default palette previews', async () => {
    expect(component.loadingAdmins()).toBeTrue();
    await loadAdmins();
    expect(component.loadingAdmins()).toBeFalse();
    expect(fixture.nativeElement.textContent).toContain('owner');
    expect(component.settingsModel().colors).toEqual({
      primary: '#344e41', background: '#edede9', text: '#171a17', button: '#000000'
    });
    expect(fixture.nativeElement.querySelectorAll('.color-preview').length).toBe(4);
  });

  it('saves palette, identity and contacts together and blocks duplicate submissions', async () => {
    await loadAdmins();
    component.form.colors.primary().value.set('#abcdef');
    component.save();
    component.save();
    expect(component.saving()).toBeTrue();
    const request = http.expectOne('/api/whitelabel');
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual({
      name: 'Trattoria', contactInfo: { address: '', phone: '', email: 'hello@example.com' },
      colors: { primary: '#abcdef', background: '#edede9', text: '#171a17', button: '#000000' }
    });
    request.flush({ ...config, colors: request.request.body.colors });
    expect(component.saving()).toBeFalse();
    expect(component.status()).toBe('Impostazioni salvate.');
    expect(store.config()?.colors?.primary).toBe('#abcdef');
  });

  it('rejects invalid colors and retains edits after a server failure', async () => {
    await loadAdmins();
    component.form.colors.primary().value.set('red');
    component.save();
    http.expectNone('/api/whitelabel');
    expect(component.form().invalid()).toBeTrue();
    component.form.colors.primary().value.set('#112233');
    component.save();
    http.expectOne('/api/whitelabel').flush({ message: ['Invalid settings'] }, { status: 400, statusText: 'Bad Request' });
    expect(component.saving()).toBeFalse();
    expect(component.error()).toBe('Invalid settings');
    expect(component.form.colors.primary().value()).toBe('#112233');
  });

  it('sends aliases as a list and displays the server-preserved hostname', async () => {
    await loadAdmins();
    component.domainModel.set({ domain: ' new.example.com ', aliases: ' www.example.com \n\nother.example.com\r\n' });
    component.saveDomain();
    expect(component.savingDomain()).toBeTrue();
    const request = http.expectOne('/api/whitelabel/domain');
    expect(request.request.body).toEqual({ domain: 'new.example.com', aliases: ['www.example.com', 'other.example.com'] });
    const updated = { ...config, domain: 'new.example.com', domains: ['new.example.com', 'old.example.com', 'www.example.com', 'other.example.com'] };
    request.flush(updated);
    expect(store.config()).toEqual(updated);
    expect(component.domainModel()).toEqual({ domain: 'new.example.com', aliases: 'old.example.com\nwww.example.com\nother.example.com' });
    expect(component.savingDomain()).toBeFalse();
    expect(component.domainStatus()).toContain('Domini salvati');
  });

  it('preserves current config on a hostname conflict', async () => {
    await loadAdmins();
    component.domainForm.domain().value.set('taken.example.com');
    component.saveDomain();
    http.expectOne('/api/whitelabel/domain').flush({ message: 'Dominio già utilizzato.' }, { status: 409, statusText: 'Conflict' });
    expect(store.config()).toEqual(config);
    expect(component.savingDomain()).toBeFalse();
    expect(component.domainError()).toBe('Dominio già utilizzato.');
  });

  it('creates an admin once and clears the password after success', async () => {
    await loadAdmins();
    component.adminModel.set({ username: 'manager', password: 'long-test-password' });
    component.createAdmin();
    component.createAdmin();
    expect(component.creatingAdmin()).toBeTrue();
    const request = http.expectOne('/api/admins');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ username: 'manager', password: 'long-test-password' });
    request.flush({ _id: 'admin-2', username: 'manager' });
    expect(component.creatingAdmin()).toBeFalse();
    expect(component.adminModel().password).toBe('');
    expect(component.admins().map(admin => admin.username)).toEqual(['owner', 'manager']);
    expect(component.adminStatus()).toContain('Amministratore aggiunto');
  });

  it('validates usernames and short passwords and displays creation errors', async () => {
    await loadAdmins();
    component.adminModel.set({ username: 'manager', password: 'short' });
    component.createAdmin();
    http.expectNone('/api/admins');
    component.adminModel.set({ username: 'bad user', password: 'long-test-password' });
    component.createAdmin();
    http.expectNone('/api/admins');
    component.adminForm.username().value.set('manager');
    component.createAdmin();
    http.expectOne('/api/admins').flush({ message: 'Nome utente già utilizzato.' }, { status: 409, statusText: 'Conflict' });
    expect(component.creatingAdmin()).toBeFalse();
    expect(component.adminError()).toBe('Nome utente già utilizzato.');
    expect(component.admins().length).toBe(1);
  });

  it('can retry a failed administrator list request', async () => {
    http.expectOne('/api/admins').flush({}, { status: 500, statusText: 'Server Error' });
    await fixture.whenStable();
    TestBed.tick();
    expect(component.loadingAdmins()).toBeFalse();
    expect(component.adminError()).toBe('Caricamento amministratori non riuscito.');
    component.loadAdmins();
    TestBed.tick();
    await loadAdmins();
    expect(component.adminError()).toBe('');
    expect(component.admins().length).toBe(1);
  });
  it('rejects passwords exceeding 72 UTF-8 bytes without mutating loaded config', async () => {
    await loadAdmins();
    component.adminModel.set({ username: 'manager', password: 'é'.repeat(37) });
    component.createAdmin();
    http.expectNone('/api/admins');
    expect(component.adminForm.password().invalid()).toBeTrue();
    component.form.colors.primary().value.set('#abcdef');
    expect(store.config()).toEqual(config);
  });

  it('refreshes the admin resource after creating an account when the first list request failed', async () => {
    http.expectOne('/api/admins').flush({}, { status: 503, statusText: 'Unavailable' });
    await fixture.whenStable();
    TestBed.tick();
    expect(component.admins()).toEqual([]);
    component.adminModel.set({ username: 'manager', password: 'long-test-password' });
    component.createAdmin();
    http.expectOne('/api/admins').flush({ _id: 'admin-2', username: 'manager' });
    TestBed.tick();
    http.expectOne('/api/admins').flush([{ _id: 'admin-1', username: 'owner' }, { _id: 'admin-2', username: 'manager' }]);
    await fixture.whenStable();
    TestBed.tick();
    expect(component.admins().map(admin => admin.username)).toEqual(['owner', 'manager']);
    expect(component.adminModel().password).toBe('');
    expect(component.adminError()).toBe('');
  });

});
