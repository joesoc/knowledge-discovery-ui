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

  defaultOperators: DefaultOperator[] = ['WNEAR', 'DNEAR' , 'YNEAR' , 'NNEAR' , 'XNEAR' , 'AND' , 'OR' , 'BEFORE' , 'AFTER' , 'SENTENCE' , 'DSENTENCE' , 'PARAGRAPH' ];
  selectedOperator?: DefaultOperator;

  summaryOptions: SummaryOptions[] = ['Concept', 'Context', 'Quick', 'ParagraphConcept', 'ParagraphContext', 'RAG', 'Vector'];
  selectedSummaryOption?: SummaryOptions;

  explicitUserProfileEnabled: boolean = false; // New property

  ngOnInit() {
    this.answerSystems = localStorage.getItem('answerSystems') ? JSON.parse(localStorage.getItem('answerSystems') ?? '[]') : [];

    this.answerService.getAnswerSystems().subscribe((systems: System[]) => { 
      this.answerSystems = systems.filter((system) => system.type !== "conversation");
      localStorage.setItem('answerSystems', JSON.stringify(this.answerSystems));
    });

    this.selectedAnswerSystem = localStorage.getItem('selectedSearchAnswerSystem') ?? 'AlbertVector';
    this.selectedQms = localStorage.getItem('selectedQuerySystem') as QuerySystem ?? 'Dictionary';
    this.selectedOperator = localStorage.getItem('selectedOperator') as DefaultOperator ?? 'WNEAR';
    this.selectedSummaryOption = localStorage.getItem('selectedSummaryOption') as SummaryOptions ?? 'Concept';

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

  // Method to handle toggle changes and store the value in local storage
  onExplicitUserProfileToggle(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement && inputElement.checked !== undefined) {
      this.explicitUserProfileEnabled = inputElement.checked;
      localStorage.setItem('explicitUserProfileEnabled', inputElement.checked.toString());
    }
  }
  
}

export type QuerySystem = 'Dictionary' | 'Index' | 'Answerbank';
export type DefaultOperator = 'WNEAR' | 'DNEAR' | 'YNEAR' | 'NNEAR' | 'XNEAR' | 'AND' | 'OR' | 'BEFORE' | 'AFTER' | 'SENTENCE' | 'DSENTENCE' | 'PARAGRAPH' 
export type SummaryOptions = 'Concept' | 'Context' | 'Quick' | 'ParagraphConcept' | 'ParagraphContext' | 'RAG' | 'Vector';
