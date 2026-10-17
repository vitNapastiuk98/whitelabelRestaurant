import { Component, computed, inject, signal } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { email, form, FormField, maxLength, minLength, pattern, required, validate } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { WhitelabelService } from '../../data-access/whitelabel.service';
import { AuthService } from '../../../identity/data-access/auth.service';
import { IWhitelabel } from '../../domain/whitelabel.model';

type AdminAccount = { _id: string; username: string };
const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

@Component({
  selector: 'app-settings',
  imports: [FormField],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  private store = inject(WhitelabelService);
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private router = inject(Router);
  private config = this.store.config();

  saving = signal(false);
  status = signal('');
  error = signal('');
  savingDomain = signal(false);
  domainStatus = signal('');
  domainError = signal('');
  readonly adminsResource = httpResource<AdminAccount[]>(() => '/api/admins', { defaultValue: [] });
  readonly admins = computed(() => this.adminsResource.hasValue() ? this.adminsResource.value() : []);
  readonly loadingAdmins = computed(() => this.adminsResource.isLoading());
  creatingAdmin = signal(false);
  adminStatus = signal('');
  private adminCommandError = signal('');
  readonly adminError = computed(() => this.adminCommandError() || (this.adminsResource.error() ? this.errorMessage(this.adminsResource.error(), 'Caricamento amministratori non riuscito.') : ''));
  readonly colorFields = [
    { key: 'primary', label: 'Colore principale' },
    { key: 'background', label: 'Sfondo' },
    { key: 'text', label: 'Testo' },
    { key: 'button', label: 'Pulsanti' }
  ] as const;

  readonly settingsModel = signal({
    name: this.config?.name || '', address: this.config?.contactInfo?.address || '',
    phone: this.config?.contactInfo?.phone || '', email: this.config?.contactInfo?.email || '',
    colors: { primary: this.config?.colors?.primary || '#344e41', background: this.config?.colors?.background || '#edede9',
      text: this.config?.colors?.text || '#171a17', button: this.config?.colors?.button || '#000000' }
  });
  readonly form = form(this.settingsModel, fields => {
    required(fields.name); maxLength(fields.name, 120); maxLength(fields.address, 500); maxLength(fields.phone, 40);
    email(fields.email); maxLength(fields.email, 254);
    for (const key of ['primary', 'background', 'text', 'button'] as const) {
      required(fields.colors[key]); pattern(fields.colors[key], HEX_COLOR);
    }
  });
  readonly domainModel = signal({ domain: this.config?.domain || '',
    aliases: (this.config?.domains || []).filter(domain => domain !== this.config?.domain).join('\n') });
  readonly domainForm = form(this.domainModel, fields => { required(fields.domain); maxLength(fields.domain, 253); });
  readonly adminModel = signal({ username: '', password: '' });
  readonly adminForm = form(this.adminModel, fields => {
    required(fields.username); pattern(fields.username, /^[A-Za-z0-9_.-]{3,80}$/);
    required(fields.password); minLength(fields.password, 12); maxLength(fields.password, 72);
    validate(fields.password, ({ value }) => new TextEncoder().encode(value()).length > 72
      ? { kind: 'passwordBytes', message: 'La password non può superare 72 byte.' } : undefined);
  });

  save() {
    if (this.form().invalid() || this.saving()) return;
    this.saving.set(true);
    this.status.set('');
    this.error.set('');
    const { name, colors, ...contactInfo } = this.settingsModel();
    this.store.saveSettings({ name, contactInfo, colors }).pipe(finalize(() => this.saving.set(false))).subscribe({
      next: () => this.status.set('Impostazioni salvate.'),
      error: err => this.error.set(this.errorMessage(err, 'Salvataggio non riuscito.'))
    });
  }

  saveDomain() {
    if (this.domainForm().invalid() || this.savingDomain()) return;
    this.savingDomain.set(true);
    this.domainStatus.set('');
    this.domainError.set('');
    const { domain, aliases } = this.domainModel();
    this.http.put<IWhitelabel>('/api/whitelabel/domain', {
      domain: domain.trim(), aliases: aliases.split(/\r?\n/).map(alias => alias.trim()).filter(Boolean)
    }).pipe(finalize(() => this.savingDomain.set(false))).subscribe({
      next: config => {
        this.store.config.set(config);
        this.domainModel.set({
          domain: config.domain || '',
          aliases: (config.domains || []).filter(alias => alias !== config.domain).join('\n')
        });
        this.domainStatus.set('Domini salvati. Il dominio usato per questa sessione resta disponibile.');
      },
      error: err => this.domainError.set(this.errorMessage(err, 'Salvataggio del dominio non riuscito.'))
    });
  }

  loadAdmins() {
    this.adminCommandError.set('');
    this.adminsResource.reload();
  }

  createAdmin() {
    if (this.adminForm().invalid() || this.creatingAdmin() || this.loadingAdmins()) return;
    this.creatingAdmin.set(true);
    this.adminStatus.set('');
    this.adminCommandError.set('');
    const { username, password } = this.adminModel();
    this.http.post<AdminAccount>('/api/admins', { username: username.trim(), password })
      .pipe(finalize(() => this.creatingAdmin.set(false))).subscribe({
        next: admin => {
          if (this.adminsResource.hasValue()) this.adminsResource.update(admins => [...admins, admin]);
          else this.adminsResource.reload();
          this.adminForm().reset({ username: '', password: '' });
          this.adminStatus.set('Amministratore aggiunto. Può accedere dalla pagina di login.');
        },
        error: err => this.adminCommandError.set(this.errorMessage(err, 'Creazione amministratore non riuscita.'))
      });
  }

  private errorMessage(err: unknown, fallback: string) {
    const message = (err as { error?: { message?: string | string[] } } | null)?.error?.message;
    return Array.isArray(message) ? message.join(' ') : message || fallback;
  }

  logout() {
    this.auth.logout();
    void this.router.navigateByUrl('/admin/login');
  }
}
