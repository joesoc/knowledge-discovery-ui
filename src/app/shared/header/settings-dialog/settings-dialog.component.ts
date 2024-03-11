import { AsyncPipe, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { Store } from '@ngrx/store';
import { SettingsActions } from '../../../state/settings/settings.actions';
import {
  selectShowIdolSearchResults,
  selectShowVectorSearchResults,
} from '../../../state/settings/settings.selectors';

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.css'],
  standalone: true,
  imports: [NgIcon, AsyncPipe, NgClass],
})
export class SettingsDialogComponent {
  private readonly store = inject(Store);

  readonly showVectorSearchResults$ = this.store.select(selectShowVectorSearchResults);
  readonly showIdolSearchResults$ = this.store.select(selectShowIdolSearchResults);

  toggleVectorSearchResultsPosition() {
    this.store.dispatch(SettingsActions.toggleVectorSearchResults());
  }

  toggleIdolSearchResultsPosition() {
    this.store.dispatch(SettingsActions.toggleIdolSearchResults());
  }
}
