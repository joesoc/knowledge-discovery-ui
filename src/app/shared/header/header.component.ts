import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { Store } from '@ngrx/store';
import { environment } from 'src/environments/environment.prod';
import { Database, IGetStatus } from '../../interfaces/IgetStatus';
import { DatabaseActions } from '../../state/database/database.actions';
import { selectDatabaseCount, selectDatabases } from '../../state/database/database.selectors';
import { SettingsDialogComponent } from './settings-dialog/settings-dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [
    NgIcon,
    CdkOverlayOrigin,
    RouterLinkActive,
    RouterLink,
    FormsModule,
    NgIf,
    NgFor,
    SettingsDialogComponent,
    CdkConnectedOverlay,
    NgClass,
    AsyncPipe,
  ],
})
export class HeaderComponent {
  private readonly store = inject(Store);
  readonly selectedDatabases$ = this.store.select(selectDatabases);
  readonly databaseCount$ = this.store.select(selectDatabaseCount);

  @Input() title: { titleValue: string } | undefined;
  @Output() searchTermChanged = new EventEmitter<string>();
  @Output() selectedDatabasesChanged = new EventEmitter<string[]>();
  @Output() showVectorResultsChanged = new EventEmitter<boolean>();
  @Output() showIDOLResultsChanged = new EventEmitter<boolean>();

  // Add this to your existing TypeScript class
  public showSettingsDialog = false;

  propogateSearchTerm(value: string) {
    this.searchTermChanged.emit(value);
  }

  showDropdown = false;
  dropdownOptions = [];
  selectedOptions: string[] = [];

  constructor(private http: HttpClient) {}

  // Call this function when you want to update the selected databases.
  updateSelectedDatabases(databases: string[]) {
    this.store.dispatch(DatabaseActions.selectDatabases({ databases }));
  }

  ngOnInit() {
    // Subscribe to state changes for selected databases
    this.selectedDatabases$.subscribe(databases => {
      this.selectedOptions = databases;
    });

    this.http
      .get<IGetStatus>(`${environment.dah_api}/?a=getstatus&responseformat=simplejson`)
      .subscribe(
        (data: any) => {
          const databases = data.autnresponse.responsedata.databases.database;
          this.dropdownOptions = databases.map((db: Database) => db.name);
        },
        err => {
          console.error('Failed to fetch data:', err);
        }
      );
  }

  toggleSelection(option: string) {
    let newSelectedOptions: string[];
    const index = this.selectedOptions.indexOf(option);

    if (index === -1) {
      newSelectedOptions = [...this.selectedOptions, option];
    } else {
      newSelectedOptions = [
        ...this.selectedOptions.slice(0, index),
        ...this.selectedOptions.slice(index + 1),
      ];
    }

    // Update the store
    this.updateSelectedDatabases(newSelectedOptions);

    // Emit the new selected databases list to the parent component
    this.selectedDatabasesChanged.emit(newSelectedOptions); // <-- Emitting new selected databases
  }
}
