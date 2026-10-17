import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WhitelabelService } from '../../../features/whitelabel/data-access/whitelabel.service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  store = inject(WhitelabelService);
  year = new Date().getFullYear();
}
