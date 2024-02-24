import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { HomeComponent } from './home/home.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ResultsCountComponent } from './landing-page/results-count/results-count.component';
import { SearchResultsComponent } from './landing-page/search-results/search-results.component';
import { SearchResultItemComponent } from './landing-page/search-result-item/search-result-item.component';
import { StoreModule } from '@ngrx/store';
import { selectedDatabaseReducer } from './reducers/headerreducer';
import { SettingsDialogComponent } from './shared/header/settings-dialog/settings-dialog.component';
import { AnswerpaneComponent } from './landing-page/answerpane/answerpane.component';
import { ChatComponent } from './landing-page/chat/chat.component';

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
    ChatComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    StoreModule.forRoot({selectedDatabases: selectedDatabaseReducer}, {})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
