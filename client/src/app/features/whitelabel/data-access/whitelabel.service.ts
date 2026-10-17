import { DOCUMENT } from '@angular/core';
import { effect, inject, Injectable, linkedSignal, signal } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { tap } from 'rxjs';
import { IWhitelabel } from '../domain/whitelabel.model';
import { RestaurantContent } from '../../restaurant/domain/content.model';

@Injectable({ providedIn: 'root' })
export class WhitelabelService {
  private readonly enabled = signal(false);
  readonly resource = httpResource<IWhitelabel>(() => this.enabled() ? '/api/whitelabel' : undefined);
  readonly config = linkedSignal<IWhitelabel | undefined, IWhitelabel | null>({
    source: () => this.resource.hasValue() ? this.resource.value() : undefined,
    computation: (value, previous) => value ?? previous?.value ?? null,
  });
  private readonly document = inject(DOCUMENT);

  constructor(private http: HttpClient) {
    effect(() => {
      const colors = this.config()?.colors;
      const palette = {
        green: colors?.primary || '#344e41',
        paper: colors?.background || '#edede9',
        ink: colors?.text || '#171a17',
        button: colors?.button || '#000000',
      };
      const style = this.document.documentElement.style;
      Object.entries(palette).forEach(([name, color]) => style.setProperty(`--restaurant-${name}`, color));
      style.setProperty('--restaurant-on-primary', this.foreground(palette.green));
      style.setProperty('--restaurant-on-button', this.foreground(palette.button));
    });
  }

  private foreground(color: string): string {
    const channels = color.slice(1).match(/.{2}/g)!.map(channel => {
      const value = parseInt(channel, 16) / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    const luminance = channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
    const blackContrast = (luminance + 0.05) / 0.05;
    const whiteContrast = 1.05 / (luminance + 0.05);
    return blackContrast >= whiteContrast ? '#000000' : '#ffffff';
  }

  load() { if (this.enabled()) this.resource.reload(); else this.enabled.set(true); }
  saveSection<K extends keyof RestaurantContent>(section: K, data: RestaurantContent[K]) {
    return this.http.put<IWhitelabel>(`/api/content/${section}`, data).pipe(tap(config => this.config.set(config)));
  }
  saveSettings(data: unknown) {
    return this.http.put<IWhitelabel>('/api/whitelabel', data).pipe(tap(config => this.config.set(config)));
  }
  get whitelabelId(): string | null { return this.config()?.whitelabelId || null; }
}
