import {Component, signal} from '@angular/core';

@Component({
  selector: 'app-about',
  imports: [
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {

  title= signal('La nostra storia')
  description= signal('Fondato nel 2004 dal sogno di due fratelli, Er Spaghetto\n' +
    'nasce dalla passione per la cucina autentica e dai sapori\n' +
    'della tradizione italiana. I fratelli hanno trasformato il\n' +
    'loro amore per il cibo in un ristorante che celebra\n' +
    'qualità e autenticità.\n' +
    '\n' +
    'Oggi, la tradizione è portata avanti con orgoglio dai loro\n' +
    'figli, che continuano a offrire piatti preparati con\n' +
    'dedizione e ingredienti eccellenti, mantenendo vivo lo\n' +
    'spirito con cui tutto è iniziato.')

  actionText = signal('Scopri di più')
  cardLeftText = signal(`20+ anni di esperienza`)
  cardRightText = signal(`10+ Premi & certificati`)
}
