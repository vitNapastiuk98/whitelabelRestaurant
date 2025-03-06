import {Component, input, Input, OnInit, signal} from '@angular/core';
import { LogoComponent } from '../../restaurant/logo/logo.component';
import {NavigationComponent} from '../navigation/navigation.component';
import {LanguageSelectorComponent} from '../../restaurant/language-selector/language-selector.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [LogoComponent, NavigationComponent,  LanguageSelectorComponent]
})
export class HeaderComponent implements OnInit {
  isAdminRoutes = input(false);

  navigationList = signal<any[]>([])

  ngOnInit() {
    if (this.isAdminRoutes()) {
      this.navigationList.set([
        {name: "Contenuti", path: "/admin/content"},
        {name: "Prenotazioni", path: "/admin/reservations"},
        {name: "Impostazioni", path: "/admin/settings"},
      ])
    } else {
      this.navigationList.set([
        {name: "Su di noi", path: "/about"},
        {name: "Menù", path: "/menu"},
        {name: "Specialità", path: "/specialty"},
        {name: "Eventi", path: "/events"},
        {name: "Prenotazioni", path: "/reservation"},
        {name: "Contatti", path: "/contact"},
      ])
    }
  }

}
