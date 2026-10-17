import { WhitelabelService } from '../../../features/whitelabel/data-access/whitelabel.service';
import { RouterLink } from '@angular/router';
import { Component, computed, input, inject } from '@angular/core';
import { LogoComponent } from '../../ui/logo/logo.component';
import { NavigationComponent } from '../navigation/navigation.component';
import { LanguageSelectorComponent } from '../../ui/language-selector/language-selector.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [LogoComponent, NavigationComponent, LanguageSelectorComponent, RouterLink],
})
export class HeaderComponent {
  readonly isAdminRoutes = input(false);
  readonly store = inject(WhitelabelService);
  readonly whatsapp = computed(() => 'https://wa.me/' + (this.store.config()?.contactInfo?.phone || '').replace(/\D/g, ''));
  readonly navigationList = computed(() => this.isAdminRoutes() ? [
    { name: 'Contenuti', path: '/admin/content' },
    { name: 'Prenotazioni', path: '/admin/reservations' },
    { name: 'Impostazioni', path: '/admin/settings' },
  ] : [
    { name: 'Su di noi', path: '/about' },
    { name: 'Menù', path: '/menu' },
    { name: 'Specialità', path: '/specialty' },
    { name: 'Eventi', path: '/events' },
    { name: 'Prenotazioni', path: '/reservation' },
    { name: 'Contatti', path: '/contact' },
  ]);
}
