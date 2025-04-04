import { AsyncPipe, NgClass } from '@angular/common';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { Store } from '@ngrx/store';
import { System } from 'src/app/interfaces/IAnswerServerGetStatusResponse';
import { AnswerService } from 'src/app/services/answer.service';
import { SettingsService } from 'src/app/services/settings.service';
import { SettingsActions } from '../../../state/settings/settings.actions';
import {
  selectShowIdolSearchResults,
  selectShowVectorSearchResults,
} from '../../../state/settings/settings.selectors';

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.css'],
  imports: [NgIcon, AsyncPipe, NgClass, FormsModule],
})
export class SettingsDialogComponent {
  private readonly store = inject(Store);
  private readonly answerService = inject(AnswerService);
  readonly showVectorSearchResults$ = this.store.select(selectShowVectorSearchResults);
  readonly showIdolSearchResults$ = this.store.select(selectShowIdolSearchResults);
  isComparisonSearchDisabled: boolean = true;
  private settingsService = inject(SettingsService);

  @Output() close = new EventEmitter<void>();
  answerSystems: System[] = [];
  selectedAnswerSystem?: string;

  querySystems: QuerySystem[] = ['Dictionary', 'Index', 'Answerbank'];
  selectedQms?: QuerySystem;

  defaultOperators: DefaultOperator[] = [
    'WNEAR',
    'DNEAR',
    'YNEAR',
    'NNEAR',
    'XNEAR',
    'AND',
    'OR',
    'BEFORE',
    'AFTER',
    'SENTENCE',
    'DSENTENCE',
    'PARAGRAPH',
  ];
  selectedOperator?: DefaultOperator;

  summaryOptions: SummaryOptions[] = [
    'Concept',
    'Context',
    'Quick',
    'ParagraphConcept',
    'ParagraphContext',
    'RAG',
    'Vector',
  ];
  selectedSummaryOption?: SummaryOptions;

  explicitUserProfileEnabled: boolean = false; // New property


  get viewEnabled() {
    return this.settingsService.getPreviewEnabled()
  }

  set viewEnabled(value: boolean) {
    this.settingsService.setPreviewEnabled(value);
  }

  get peoplealsoaskedEnabled() {
    return this.settingsService.getPeopleAlsoAskedEnabled()
  }

  set peoplealsoaskedEnabled(value: boolean) {
    this.settingsService.setPeopleAlsoAskedEnabled(value);
  }

  ngOnInit() {
    this.answerSystems = localStorage.getItem('answerSystems')
      ? JSON.parse(localStorage.getItem('answerSystems') ?? '[]')
      : [];

    this.answerService.getAnswerSystems().subscribe((systems: System[]) => {
      this.answerSystems = systems.filter(system => system.type !== 'conversation');
      localStorage.setItem('answerSystems', JSON.stringify(this.answerSystems));
    });

    this.selectedAnswerSystem =
      localStorage.getItem('selectedSearchAnswerSystem') ?? 'AlbertVector';
    this.selectedQms = (localStorage.getItem('selectedQuerySystem') as QuerySystem) ?? 'Dictionary';
    this.selectedOperator =
      (localStorage.getItem('selectedOperator') as DefaultOperator) ?? 'WNEAR';
    this.selectedSummaryOption =
      (localStorage.getItem('selectedSummaryOption') as SummaryOptions) ?? 'Concept';

    // Retrieve the toggle state from local storage (default to false if not set)
    this.explicitUserProfileEnabled = localStorage.getItem('explicitUserProfileEnabled') === 'true';
  }

  toggleVectorSearchResultsPosition() {
    this.store.dispatch(SettingsActions.toggleVectorSearchResults());
  }

  toggleIdolSearchResultsPosition() {
    this.store.dispatch(SettingsActions.toggleIdolSearchResults());
  }

  onSystemChange(system: string) {
    localStorage.setItem('selectedSearchAnswerSystem', system);
  }

  onBehaviorChange(system: QuerySystem) {
    localStorage.setItem('selectedQuerySystem', system);
  }

  onOperatorChange(operator: DefaultOperator) {
    localStorage.setItem('selectedOperator', operator);
  }

  onSummaryOptionChange(option: SummaryOptions) {
    localStorage.setItem('selectedSummaryOption', option);
  }

  onExplicitUserProfileToggle(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement && inputElement.checked !== undefined) {
      this.explicitUserProfileEnabled = inputElement.checked;
      localStorage.setItem('explicitUserProfileEnabled', inputElement.checked.toString());
    }
  }
  onviewEnabled(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement && inputElement.checked !== undefined) {
      this.viewEnabled = inputElement.checked;
    }
  }
  onPeopleAlsoAskedEnabled(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement && inputElement.checked !== undefined) {
      this.peoplealsoaskedEnabled = inputElement.checked;
      localStorage.setItem('peoplealsoaskedEnabled', inputElement.checked.toString());
      this.settingsService.setPeopleAlsoAskedEnabled(inputElement.checked);
    }
  }
}

export type QuerySystem = 'Dictionary' | 'Index' | 'Answerbank';
export type DefaultOperator =
  | 'WNEAR'
  | 'DNEAR'
  | 'YNEAR'
  | 'NNEAR'
  | 'XNEAR'
  | 'AND'
  | 'OR'
  | 'BEFORE'
  | 'AFTER'
  | 'SENTENCE'
  | 'DSENTENCE'
  | 'PARAGRAPH';
export type SummaryOptions =
  | 'Concept'
  | 'Context'
  | 'Quick'
  | 'ParagraphConcept'
  | 'ParagraphContext'
  | 'RAG'
  | 'Vector';
