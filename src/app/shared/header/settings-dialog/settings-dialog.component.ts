import { AsyncPipe, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { Store } from '@ngrx/store';
import { SettingsActions } from '../../../state/settings/settings.actions';
import {
  selectIdolSearchResultsPosition,
  selectVectorSearchResultsPosition,
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

  readonly vectorSearchResultsPosition$ = this.store.select(selectVectorSearchResultsPosition);
  readonly idolSearchResultsPosition$ = this.store.select(selectIdolSearchResultsPosition);

  setVectorSearchResultsPosition(position: 'left' | 'right') {
    this.store.dispatch(SettingsActions.positionVectorSearchResults({ position }));
  }

  setIdolSearchResultsPosition(position: 'left' | 'right') {
    this.store.dispatch(SettingsActions.positionIdolSearchResults({ position }));
  }
}
