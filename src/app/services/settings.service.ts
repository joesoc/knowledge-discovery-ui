import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private previewEnabledSubject = new BehaviorSubject<boolean>(false);
  private vectorSearchEnabledSubject = new BehaviorSubject<boolean>(false);
  private peopleAlsoAskedEnabledSubject = new BehaviorSubject<boolean>(false);
  previewEnabled$ = this.previewEnabledSubject.asObservable();
  vectorSearchEnabled$ = this.vectorSearchEnabledSubject.asObservable();
  peopleAlsoAskedEnabled$ = this.peopleAlsoAskedEnabledSubject.asObservable();
  setVectorSearchEnabled(enabled: boolean) {
    this.vectorSearchEnabledSubject.next(enabled);
  }
  setPreviewEnabled(enabled: boolean) {
    this.previewEnabledSubject.next(enabled);
  }
  setPeopleAlsoAskedEnabled(enabled: boolean) {
    this.peopleAlsoAskedEnabledSubject.next(enabled);
  }
}
