import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgIconsModule } from '@ng-icons/core';
import {
  lucideAlignLeft,
  lucideAlignRight,
  lucideCheck,
  lucideDatabase,
  lucideMaximize2,
  lucideMessageCircle,
  lucideMinimize2,
  lucideSearch,
  lucideSend,
  lucideSettings,
  lucideX,
} from '@ng-icons/lucide';
import { StoreModule } from '@ngrx/store';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AnswerpaneComponent } from './landing-page/answerpane/answerpane.component';
import { ChatSettingsComponent } from './landing-page/chat/chat-settings/chat-settings.component';
import { ChatUrlDirective } from './landing-page/chat/chat-url/chat-url.directive';
import { ChatComponent } from './landing-page/chat/chat.component';
import { DynamicValidChoicesComponent } from './landing-page/chat/dynamic-valid-choices/dynamic-valid-choices.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ResultsCountComponent } from './landing-page/results-count/results-count.component';
import { SearchResultItemComponent } from './landing-page/search-result-item/search-result-item.component';
import { SearchResultsComponent } from './landing-page/search-results/search-results.component';
import { selectedDatabaseReducer } from './reducers/headerreducer';
import { HeaderComponent } from './shared/header/header.component';
import { SettingsDialogComponent } from './shared/header/settings-dialog/settings-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    LandingPageComponent,
    ResultsCountComponent,
    SearchResultsComponent,
    SearchResultItemComponent,
    SettingsDialogComponent,
    AnswerpaneComponent,
    ChatComponent,
    DynamicValidChoicesComponent,
    ChatUrlDirective,
    ChatSettingsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    StoreModule.forRoot({ selectedDatabases: selectedDatabaseReducer }, {}),
    NgIconsModule.withIcons({
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
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
