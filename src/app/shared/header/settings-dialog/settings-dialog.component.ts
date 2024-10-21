import { AsyncPipe, NgClass } from '@angular/common';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { Store } from '@ngrx/store';
import { SettingsActions } from '../../../state/settings/settings.actions';
import {
  selectShowIdolSearchResults,
  selectShowVectorSearchResults,
} from '../../../state/settings/settings.selectors';
import { DahService } from 'src/app/services/dah.service';
import { Database } from 'src/app/interfaces/IDahResponse';
import { FormsModule } from '@angular/forms';
import { AnswerService } from 'src/app/services/answer.service';
import { System } from 'src/app/interfaces/IAnswerServerGetStatusResponse';

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.css'],
  standalone: true,
  imports: [NgIcon, AsyncPipe, NgClass, FormsModule],
})
export class SettingsDialogComponent {

  private readonly store = inject(Store);
  private readonly answerService = inject(AnswerService);

  readonly showVectorSearchResults$ = this.store.select(selectShowVectorSearchResults);
  readonly showIdolSearchResults$ = this.store.select(selectShowIdolSearchResults);

  @Output() close = new EventEmitter<void>();

  answerSystems: System[] = [];
  selectedAnswerSystem?: string;

  querySystems: QuerySystem[] = ['Dictionary', 'Index', 'Answerbank'];
  selectedQms?: QuerySystem;

  ngOnInit() {
    this.answerSystems = localStorage.getItem('answerSystems') ? JSON.parse(localStorage.getItem('answerSystems') ?? '[]') : [];

    this.answerService.getAnswerSystems().subscribe((systems: System[]) => { 
      this.answerSystems = systems.filter((system) => system.type !== "conversation");
      localStorage.setItem('answerSystems', JSON.stringify(this.answerSystems));
    });

    this.selectedAnswerSystem = localStorage.getItem('selectedSearchAnswerSystem') ?? 'AlbertVector';
    this.selectedQms = localStorage.getItem('selectedQuerySystem') as QuerySystem ?? 'Dictionary';
  }

  toggleVectorSearchResultsPosition() {
    this.store.dispatch(SettingsActions.toggleVectorSearchResults());
  }

  toggleIdolSearchResultsPosition() {
    this.store.dispatch(SettingsActions.toggleIdolSearchResults());
  }

  onSystemChange(system: string) {
    // store the selected system in local storage
    localStorage.setItem('selectedSearchAnswerSystem', system);
  }
  
  onBehaviorChange(system: QuerySystem) {
    localStorage.setItem('selectedQuerySystem', system);
  }
}

export type QuerySystem = 'Dictionary' | 'Index' | 'Answerbank';