import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import {CommonModule} from '@angular/common';

interface Slide {
  type: 'image' | 'video';
  src: string;
  alt?: string;
  title?: string;
}

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  standalone: true,
  imports: [HeaderComponent, CommonModule],
})
export class LandingComponent {
  slides: Slide[] = [
    {
      type: 'image',
      src: 'public/images/spaghetti-slide.jpg',
      alt: 'Spaghetti dish',
      title: 'Ingredienti Autentici.<br>Piatti <em>Incredibili</em>.',
    },
    {
      type: 'video',
      src: 'public/videos/pasta-making.mp4',
      title: 'La vera cucina Italiana',
    },
    {
      type: 'image',
      src: 'public/images/another-dish.jpg',
      alt: 'Another tasty dish',
      title: 'Un viaggio nei sapori',
    }
  ];

  currentSlideIndex = 0;

  prevSlide(): void {
    this.currentSlideIndex =
      (this.currentSlideIndex - 1 + this.slides.length) % this.slides.length;
  }

  nextSlide(): void {
    this.currentSlideIndex =
      (this.currentSlideIndex + 1) % this.slides.length;
  }

  goToSlide(index: number): void {
    this.currentSlideIndex = index;
  }
}
