import { HttpClient } from '@angular/common/http';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IGetStatus, Database } from '../../interfaces/IgetStatus';
import { Store } from '@ngrx/store';
import { addSelectedDatabases } from '../../actions/headeractions';
import { Observable } from 'rxjs';
import { getSelectedDatabases } from '../../reducers/headerreducer';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Input() title: { titleValue: string; } | undefined;
  @Output() searchTermChanged = new EventEmitter<string>();
  @Output() selectedDatabasesChanged = new EventEmitter<string[]>(); 
  @Output() showVectorResultsChanged = new EventEmitter<boolean>();
  @Output() showIDOLResultsChanged = new EventEmitter<boolean>();

  propogateSearchTerm(value: string) {
    this.hideDatabaseSelectionDropDown()
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

    this.http.get<IGetStatus>(`${environment.dah_api}/?a=getstatus&responseformat=simplejson`).subscribe(
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


  handleToggleLeft(EmittedValue: any) {
    // Your logic for toggling left panel
    let booleanValueToEmit: boolean = !!EmittedValue;
    this.showVectorResultsChanged.emit(EmittedValue);
  }

  handleToggleRight(EmittedValue: any) {
    // Your logic for toggling right panel
    let booleanValueToEmit: boolean = !!EmittedValue;
    this.showIDOLResultsChanged.emit(EmittedValue);
  }
    // Add this to your existing TypeScript class
  public showSettingsDialog = false;

  public toggleDatabaseSelection(){
    this.showDropdown = ! this.showDropdown;
    this.showSettingsDialog = !this.showDropdown;
  }
  public hideDatabaseAndSettings(){
    this.hideDatabaseSelectionDropDown();
    this.closeSettingsDialog();
  }
  public hideDatabaseSelectionDropDown(){
    this.showDropdown = false;
  }
  public openSettingsDialog() {
    this.showSettingsDialog = true;
    this.showDropdown = false;
  }

  public closeSettingsDialog() {
    this.showSettingsDialog = false;
  }

}
