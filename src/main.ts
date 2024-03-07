import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { Routes, provideRouter } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import {
  lucideAlignLeft,
  lucideAlignRight,
  lucideArrowLeft,
  lucideArrowRight,
  lucideCheck,
  lucideCheckCircle2,
  lucideDatabase,
  lucideMaximize2,
  lucideMessageCircle,
  lucideMinimize2,
  lucideSearch,
  lucideSend,
  lucideSettings,
  lucideX,
  lucideXCircle,
} from '@ng-icons/lucide';
import { provideState, provideStore } from '@ngrx/store';
import { AppComponent } from './app/app.component';
import { LandingPageComponent } from './app/landing-page/landing-page.component';
import { databaseFeature, databaseFeatureKey } from './app/state/database/database.reducer';
import { settingsFeature, settingsFeatureKey } from './app/state/settings/settings.reducer';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'search',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: LandingPageComponent,
  },
  {
    path: 'search',
    component: LandingPageComponent,
  },
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideStore(),
    provideState({ name: settingsFeatureKey, reducer: settingsFeature.reducer }),
    provideState({ name: databaseFeatureKey, reducer: databaseFeature.reducer }),
    provideIcons({
      lucideSettings,
      lucideDatabase,
      lucideSearch,
      lucideAlignLeft,
      lucideAlignRight,
      lucideCheck,
      lucideMinimize2,
      lucideMaximize2,
      lucideX,
      lucideMessageCircle,
      lucideSend,
      lucideCheckCircle2,
      lucideXCircle,
      lucideArrowLeft,
      lucideArrowRight,
    }),
    provideHttpClient(withInterceptorsFromDi()),
  ],
}).catch(err => console.error(err));
