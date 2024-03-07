import { OverlayModule } from '@angular/cdk/overlay';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
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
import { StoreModule } from '@ngrx/store';
import { AppRoutingModule } from './app/app-routing.module';
import { AppComponent } from './app/app.component';
import { selectedDatabaseReducer } from './app/reducers/headerreducer';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      AppRoutingModule,
      OverlayModule,
      FormsModule,
      StoreModule.forRoot({ selectedDatabases: selectedDatabaseReducer }, {})
    ),
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
