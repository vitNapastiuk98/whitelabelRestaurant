// src/app/app-config.service.ts
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs/operators';
import {IWhitelabel} from '../../types/types';

@Injectable({
  providedIn: 'root'
})
export class WhitelabelService {
  private whitelabel  : IWhitelabel | null = null;

  constructor(private http: HttpClient) {
  }

  loadWhitelabel() {
    return this.http.get<IWhitelabel>('/api/whitelabel')
      .pipe(
        tap({
            next: config => {
              this.whitelabel = config;
            },
            error: err => {
              console.error('Could not load app whitelabel', err);
            }
          }
        )
      )
  }

  get whitelabelId(): string | null {
    return this.whitelabel?.whitelabelId || null;
  }
}
