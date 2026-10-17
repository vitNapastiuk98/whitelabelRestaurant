import { Component, computed, inject, linkedSignal } from '@angular/core';
import { WhitelabelService } from '../../../whitelabel/data-access/whitelabel.service';
@Component({ selector: 'app-landing', templateUrl: './landing.component.html', styleUrls: ['./landing.component.scss'], imports: [] })
export class LandingComponent {
  private store = inject(WhitelabelService);
  slides = computed(() => (this.store.config()?.content?.['home']?.items || []).map((item) => ({
    type: 'image', src: item.file || '/hero-spaghetti.jpg', alt: item.text1, title: item.text1, subtitle: item.text2
  })));
  readonly currentSlideIndex = linkedSignal({ source: this.slides, computation: () => 0 });
  prevSlide() { this.currentSlideIndex.update(index => (index - 1 + this.slides().length) % this.slides().length); }
  nextSlide() { this.currentSlideIndex.update(index => (index + 1) % this.slides().length); }
  goToSlide(index: number) { this.currentSlideIndex.set(index); }
}
