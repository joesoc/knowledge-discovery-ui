import { NgFor } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { System } from 'src/app/interfaces/IAnswerServerGetStatusResponse';
import { Database } from 'src/app/interfaces/IDahResponse';
import { AnswerService } from 'src/app/services/answer.service';
import { DahService } from 'src/app/services/dah.service';
import { DataService } from 'src/app/services/data.service';
import { SavedSearch } from 'src/app/shared/header/header.component';

@Component({
  selector: 'app-chat-settings',
  templateUrl: './chat-settings.component.html',
  styleUrls: ['./chat-settings.component.css'],
  imports: [FormsModule, NgFor],
})
export class ChatSettingsComponent {
  databases: Database[] = [];
  answerSystems: System[] = [];

  loadingDatabase = true;
  selectedDatabase: string = '';
  selectedAnswerSystem: string = '';
  selectedSavedSearch: SavedSearch = {label: '', stateId: '', username: '', searchTerm: '', resultSummary: {numhits: 0, predicted: '0', totaldbdocs: 0, totaldbsecs: 0, totalhits: 0}};
  selectedSavedSearchStateID: string = '';
  securityinfo: string = '';
  username: string = '';
  savedSearches: SavedSearch[] = [ 
    {
      label: 'No saved searches', 
      stateId: '', 
      username: this.username, 
      searchTerm: '', 
      resultSummary: {
        numhits: 0, 
        predicted: '0', 
        totaldbdocs: 0, 
        totaldbsecs: 0, 
        totalhits: 0
      }
    } 
];
  constructor(
    private dahService: DahService,
    private answerService: AnswerService,
    private dataService: DataService
  ) {
    // populate the databases and answer systems
    const allSavedSearches = JSON.parse(localStorage.getItem('savedsearches') ?? '[]');
    console.log('All saved searches:', allSavedSearches);
    this.username = localStorage.getItem('username') ?? '';
    this.databases = JSON.parse(localStorage.getItem('databases') ?? '[]');
    this.answerSystems = JSON.parse(localStorage.getItem('answerSystems') ?? '[]');
    this.savedSearches = JSON.parse(localStorage.getItem('savedsearches') ?? '[]')
          .filter((s: { username: string; }) => s.username === this.username);
    console.log('Filtered saved searches for user', this.username, ':', this.savedSearches);
    this.securityinfo = localStorage.getItem('token') ?? '';
    this.dahService.getDatabases().subscribe(
      (dbs: Database[]) => {
        this.databases = dbs;
        // cache the databases in local storage
        localStorage.setItem('databases', JSON.stringify(this.databases));
      },
      err => {
        console.log(err);
      }
    );
    this.answerService.getAnswerSystems().subscribe((systems: System[]) => {
      this.answerSystems = systems.filter(system => system.type !== 'conversation');
      // cache the answer systems in local storage
      localStorage.setItem('answerSystems', JSON.stringify(this.answerSystems));
    });
  }
  ngOnInit() {
    this.loadSettings();
  }

  saveSettings(): void {
    localStorage.setItem('selectedDatabase', this.selectedDatabase);
    localStorage.setItem('selectedAnswerSystem', this.selectedAnswerSystem);
    localStorage.setItem('selectedSavedSearch', JSON.stringify(this.selectedSavedSearch));
    localStorage.setItem('selectedSavedSearchStateID', this.selectedSavedSearchStateID);
    console.log('Selected Saved Search State ID:', this.selectedSavedSearchStateID);
    this.dataService.addDataToRedis(
      this.sessionID,
      this.selectedDatabase,
      this.selectedAnswerSystem,
      this.securityinfo,
      this.selectedSavedSearchStateID
    );
    this.closeChatSettings.emit(false);
  }
  loadSettings(): void {
    this.selectedDatabase = localStorage.getItem('selectedDatabase') ?? '';
    this.selectedAnswerSystem = localStorage.getItem('selectedAnswerSystem') ?? '';
    this.selectedSavedSearch = JSON.parse(localStorage.getItem('selectedSavedSearch') ?? '{}');
    this.selectedSavedSearchStateID = localStorage.getItem('selectedSavedSearchStateID') ?? 'No State';
  }

  loadDatabases(): void {
    this.dahService.getDatabases().subscribe(
      (dbs: Database[]) => {
        this.databases = dbs;
      },
      err => {
        console.error(err);
      }
    );
  }

  loadAnswerSystems(): void {
    this.answerService.getAnswerSystems().subscribe((systems: System[]) => {
      this.answerSystems = systems.filter(system => system.type !== 'conversation');
    });
  }

  loadSavedSearches(): void {
    const allSavedSearches = JSON.parse(localStorage.getItem('savedsearches') ?? '[]');
    this.savedSearches = allSavedSearches.filter((s: { username: string; }) => s.username === this.username);
    if (this.savedSearches.length === 0) {
      this.savedSearches.push({label: 'No saved searches', stateId: '', username: this.username, searchTerm: '', resultSummary: {numhits: 0, predicted: '0', totaldbdocs: 0, totaldbsecs: 0, totalhits: 0}}); 
      console.log('No saved searches found for user', this.username);
    }
    console.log('Loaded saved searches:', this.savedSearches);
  }
  @Input() sessionID: string = '';
  @Output() closeChatSettings = new EventEmitter<boolean>();
}
