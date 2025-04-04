import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private previewEnabledSubject = new BehaviorSubject<boolean>(localStorage.getItem('viewEnabled') === 'true');
  private vectorSearchEnabledSubject = new BehaviorSubject<boolean>(false);
  private peopleAlsoAskedEnabledSubject = new BehaviorSubject<boolean>(localStorage.getItem('peoplealsoaskedEnabled') === 'true');
  previewEnabled$ = this.previewEnabledSubject.asObservable();
  vectorSearchEnabled$ = this.vectorSearchEnabledSubject.asObservable();
  peopleAlsoAskedEnabled$ = this.peopleAlsoAskedEnabledSubject.asObservable();

  getPeopleAlsoAskedEnabled() {
    return this.peopleAlsoAskedEnabledSubject.getValue();
  }

  setVectorSearchEnabled(enabled: boolean) {
    this.vectorSearchEnabledSubject.next(enabled);
  }

  getPreviewEnabled() {
    return this.previewEnabledSubject.getValue();
  }
  setPreviewEnabled(enabled: boolean) {
    localStorage.setItem('viewEnabled', enabled.toString());
    this.previewEnabledSubject.next(enabled);
  }

  setPeopleAlsoAskedEnabled(enabled: boolean) {
    localStorage.setItem('peoplealsoaskedEnabled', enabled.toString());
    this.peopleAlsoAskedEnabledSubject.next(enabled);
  }
}
