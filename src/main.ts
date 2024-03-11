import { provideHttpClient, withInterceptors } from '@angular/common/http';
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
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { AppComponent } from './app/app.component';
import { LandingPageComponent } from './app/landing-page/landing-page.component';
import { LoginComponent } from './app/login/login.component';
import { authGuard } from './app/shared/guards/auth.guard';
import { authInterceptor } from './app/shared/interceptors/auth.interceptor';
import { databaseFeature, databaseFeatureKey } from './app/state/database/database.reducer';
import { settingsFeature, settingsFeatureKey } from './app/state/settings/settings.reducer';
import { TypeaheadEffects } from './app/state/typeahead/typeahead.effects';
import { typeaheadFeature, typeaheadFeatureKey } from './app/state/typeahead/typeahead.reducer';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'search',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: LandingPageComponent,
    canActivate: [authGuard],
  },
  {
    path: 'search',
    component: LandingPageComponent,
    canActivate: [authGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideStore(),
    provideState({ name: settingsFeatureKey, reducer: settingsFeature.reducer }),
    provideState({ name: databaseFeatureKey, reducer: databaseFeature.reducer }),
    provideState({ name: typeaheadFeatureKey, reducer: typeaheadFeature.reducer }),
    provideEffects([TypeaheadEffects]),
    provideStoreDevtools(),
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
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
}).catch(err => console.error(err));
