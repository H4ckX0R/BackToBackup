import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import DefaultPreset from './themes/defaultPreset';
import { tokenInterceptor } from './core/auth/token.interceptor';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApiModule } from './api/api.module';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    providePrimeNG({
      theme: {
        preset: DefaultPreset,
        options: {
          darkModeSelector: false, // TODO: Crear tema oscuro
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng'
          }
        }
      },
      ripple: true
    }),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([
      tokenInterceptor
    ])),
    importProvidersFrom(ApiModule.forRoot({
      rootUrl: 'http://localhost:3000'
    }))
  ]
};
