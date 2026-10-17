import { Component, computed, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { FooterComponent } from './shared/layout/footer/footer.component';
import { HeaderComponent } from './shared/layout/header/header.component';
import { AuthService } from './features/identity/data-access/auth.service';
import { WhitelabelService } from './features/whitelabel/data-access/whitelabel.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  readonly title = 'client';
  readonly store = inject(WhitelabelService);
  readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly url = toSignal(this.router.events.pipe(
    filter((event): event is NavigationEnd => event instanceof NavigationEnd),
    map(event => event.urlAfterRedirects),
  ), { initialValue: this.router.url });
  readonly isAdminRoutes = computed(() => this.url().startsWith('/admin') && this.auth.isAuthenticated());
  readonly loadingError = computed(() => this.store.resource.error()
    ? 'Impossibile caricare il ristorante. Controlla la connessione e riprova.' : '');

  ngOnInit() { this.load(); }
  load() { this.store.load(); }
}
