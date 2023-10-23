import { HttpClient } from '@angular/common/http';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IGetStatus, Database } from '../../interfaces/IgetStatus';
import { Store } from '@ngrx/store';
import { addSelectedDatabases } from '../../actions/headeractions';
import { Observable } from 'rxjs';
import { getSelectedDatabases } from '../../reducers/headerreducer';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Input() title: { titleValue: string; } | undefined;
  @Output() searchTermChanged = new EventEmitter<string>();
  @Output() selectedDatabasesChanged = new EventEmitter<string[]>();  // <-- New Output property

  propogateSearchTerm(value: string) {
    this.searchTermChanged.emit(value);
  }
  
  showDropdown = false;
  dropdownOptions = [];
  selectedOptions: string[] = [];
  selectedDatabases$!: Observable<string[]>;

  constructor(private http: HttpClient, private store: Store<{selectedDatabases: string[]}>) {
    this.selectedDatabases$ = this.store.select(getSelectedDatabases);
  }

  // Call this function when you want to update the selected databases.
  updateSelectedDatabases(databases: string[]) {
    this.store.dispatch(addSelectedDatabases({ databases }));
  }

  ngOnInit() {
    // Subscribe to state changes for selected databases
    this.selectedDatabases$.subscribe((databases) => {
      this.selectedOptions = databases;
    });

    this.http.get<IGetStatus>(`https://${environment.dah_fqdb}:${environment.dah_port}/a=getstatus&responseformat=simplejson`).subscribe(
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
      newSelectedOptions = [...this.selectedOptions.slice(0, index), ...this.selectedOptions.slice(index + 1)];
    }

    // Update the store
    this.updateSelectedDatabases(newSelectedOptions);

    // Emit the new selected databases list to the parent component
    this.selectedDatabasesChanged.emit(newSelectedOptions);  // <-- Emitting new selected databases
  }

  @Output() hideLeftChanged = new EventEmitter<boolean>();
  @Output() hideRightChanged = new EventEmitter<boolean>();

  hideLeft = false; // State variable for left-hand side
  hideRight = false; // State variable for right-hand side

  // ... existing methods ...

  toggleLeft() {
    this.hideLeft = !this.hideLeft;
    this.hideLeftChanged.emit(this.hideLeft);
  }

  toggleRight() {
    this.hideRight = !this.hideRight;
    this.hideRightChanged.emit(this.hideRight);
  }
}
