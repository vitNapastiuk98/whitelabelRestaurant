import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {NavigationEnd, Router, RouterLink, RouterOutlet} from '@angular/router';
import {HeaderComponent} from './content/shared/header/header.component';
import {AuthService} from './core/services/auth/auth.service';
import {filter} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'client';
  clientService = inject(AuthService);
  router = inject(Router);
  // Signal that indicates whether we're on an admin route and the user is authenticated
  isAdminRoutes = signal(false);
  destroyRef = inject(DestroyRef)

  ngOnInit() {
    // Subscribe to NavigationEnd events to detect route changes
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef))
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects;
        // If URL starts with '/admin' and user is authenticated, set signal to true
        if (url.startsWith('/admin') && this.clientService.isAuthenticated()) {
          this.isAdminRoutes.set(true);
        } else {
          this.isAdminRoutes.set(false);
        }
      });
  }
}

