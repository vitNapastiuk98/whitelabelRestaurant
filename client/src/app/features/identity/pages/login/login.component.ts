import { Component, inject, signal } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { AuthService } from '../../data-access/auth.service';

@Component({ selector: 'app-login', imports: [FormField], templateUrl: './login.component.html', styleUrl: './login.component.scss' })
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  loading = signal(false);
  error = signal('');
  readonly model = signal({ username: '', password: '' });
  readonly form = form(this.model, fields => { required(fields.username); required(fields.password); });

  submit() {
    if (this.form().invalid() || this.loading()) { this.form().markAsTouched(); return; }
    this.loading.set(true); this.error.set('');
    const { username, password } = this.model();
    this.auth.login(username, password).subscribe({
      next: () => { this.loading.set(false); void this.router.navigateByUrl('/admin/content'); },
      error: err => { this.loading.set(false); this.error.set(err.error?.message || 'Accesso non riuscito. Riprova.'); }
    });
  }
}
