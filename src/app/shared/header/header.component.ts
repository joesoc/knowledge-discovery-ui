import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  QueryList,
  ViewChildren,
  inject,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLogOut, lucideSave, lucideX } from '@ng-icons/lucide';
import { Store } from '@ngrx/store';
import { Subject, debounceTime } from 'rxjs';
import { TypeaheadActions } from 'src/app/state/typeahead/typeahead.actions';
import {
  selectTypeaheadLoading,
  selectTypeaheadResults,
  selectTypeaheadShowResults,
} from 'src/app/state/typeahead/typeahead.selectors';
import { environment } from 'src/environments/environment.prod';
import { Database, IGetStatus } from '../../interfaces/IgetStatus';
import { LoginService } from '../../services/login.service';
import { DatabaseActions } from '../../state/database/database.actions';
import { selectDatabaseCount, selectDatabases } from '../../state/database/database.selectors';
import { SettingsDialogComponent } from './settings-dialog/settings-dialog.component';
import { TypeaheadSuggestionComponent } from './typeahead-suggestion/typeahead-suggestion.component';
import { NgpPopover, NgpPopoverTrigger } from 'ng-primitives/popover';
import { NgpTabList, NgpTabButton, NgpTabset } from 'ng-primitives/tabs';
import { DahService } from 'src/app/services/dah.service';
import { IResultSummary } from 'src/app/interfaces/IsearchResultsSummary';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [
    NgIcon,
    CdkOverlayOrigin,
    FormsModule,
    NgIf,
    NgFor,
    SettingsDialogComponent,
    CdkConnectedOverlay,
    NgClass,
    AsyncPipe,
    FormsModule,
    TypeaheadSuggestionComponent,
    NgIcon,
    NgpPopover,
    NgpPopoverTrigger,
    NgpTabList, NgpTabButton, NgpTabset
  ],
  providers: [provideIcons({ lucideLogOut, lucideSave, lucideX })],
})
export class HeaderComponent {

  private readonly store = inject(Store);
  private readonly loginService = inject(LoginService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dah = inject(DahService);
  readonly selectedDatabases$ = this.store.select(selectDatabases);
  readonly databaseCount$ = this.store.select(selectDatabaseCount);
  readonly typeaheadResults$ = this.store.select(selectTypeaheadResults);
  readonly typeaheadLoading$ = this.store.select(selectTypeaheadLoading);
  readonly typeaheadShowResults$ = this.store.select(selectTypeaheadShowResults);
  username = localStorage.getItem('username') ?? '';
  searchTerm: string = '';
  readonly didSearch$ = new Subject<string>();

  @Input() title: { titleValue: string } | undefined;
  @Input() selectedSavedSearch: SavedSearch | undefined;
  @Output() searchTermChanged = new EventEmitter<string>();
  @Output() selectedDatabasesChanged = new EventEmitter<string[]>();
  @Output() showVectorResultsChanged = new EventEmitter<boolean>();
  @Output() showIDOLResultsChanged = new EventEmitter<boolean>();
  @Output() savedSearch = new EventEmitter<SavedSearch>();
  @Output() savedSearchRemoved = new EventEmitter<SavedSearch[]>();

  @ViewChildren(TypeaheadSuggestionComponent) suggestions?: QueryList<TypeaheadSuggestionComponent>;

  // Add this to your existing TypeScript class
  public showSettingsDialog = false;

  activeDescendantManager?: ActiveDescendantKeyManager<TypeaheadSuggestionComponent>;

  lastSearchTerm: string | undefined = undefined;

  propogateSearchTerm(value: string) {
    if (!value || value.trim() === '') {
      console.warn('A search term must be supplied.'); // Move this inside the if block
    } else {
      if (this.lastSearchTerm === value.trim()) {
        return;
      }

      this.lastSearchTerm = value.trim();
     
      const result = this.activeDescendantManager?.activeItem?.value;

      this.store.dispatch(TypeaheadActions.closeTypeahead());

      if (result) {
        this.searchTerm = result;
        this.searchTermChanged.emit(result);
        return;
      }

      this.searchTermChanged.emit(value);
      console.log(value); // Log the value if it's not empty or whitespace
    }
  }

  showDropdown = false;
  dropdownOptions = [];
  selectedOptions: string[] = [];

  get getSavedSearches(): SavedSearch[] {
    try {
      const raw = localStorage.getItem('savedsearches') ?? '[]';
      const data: SavedSearch[] = JSON.parse(raw) as SavedSearch[];
      return data?.filter((s) => s.username === this.username) ?? []
    } catch (e) {
      console.error('Invalid savedsearches in localStorage:', e);
      return [];
    }
  }
  

  protected readonly searchContainer = viewChild.required<ElementRef<HTMLElement>>('searchContainer');

  protected readonly saveSearchTrigger = viewChild(NgpPopoverTrigger);

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

    this.didSearch$
      .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
      .subscribe(searchTerm => {
        // if the search term is empty, close the typeahead
        if (!searchTerm || searchTerm.trim() === '') {
          this.store.dispatch(TypeaheadActions.closeTypeahead());
          return;
        }

        this.store.dispatch(TypeaheadActions.loadTypeahead({ search: searchTerm }));
      });
  }

  ngAfterViewInit() {
    this.activeDescendantManager = new ActiveDescendantKeyManager(this.suggestions!)
      .withVerticalOrientation()
      .withTypeAhead()
      .withWrap();

    this.suggestions?.changes.subscribe(suggestions => {
      this.activeDescendantManager?.updateActiveItem(-1);
    });
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

  logout() {
    this.loginService.logout();
  }

  fetchSuggestions(): void {
    this.didSearch$.next(this.searchTerm);
  }

  openTypeahead(): void {
    this.store.dispatch(TypeaheadActions.openTypeahead());
  }

  @HostListener('document:click', ['$event'])
  closeTypeahead(event: MouseEvent): void {
    // if the click event is outside of the typeahead or input, close it
    const target = event.target as HTMLElement;

    if (
     !this.searchContainer().nativeElement.contains(target)) {
      this.store.dispatch(TypeaheadActions.closeTypeahead());
     }
  }

  onKeydown(event: KeyboardEvent) {
    this.activeDescendantManager?.onKeydown(event);

    // if this is an arrow key, prevent the default behavior
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
    }
  }

  search(value: string) {
    this.searchTerm = value;
    this.propogateSearchTerm(value);
  }
  
  onTypeaheadSuggestionHover(result: string,index: number) {
    this.activeDescendantManager?.setActiveItem(index);
  }

  saveSearch(label: string): void {
      let username = localStorage.getItem('username') ?? '';
      this.dah.saveSearch(this.searchTerm).subscribe(response => {
        const savedSearches = JSON.parse(localStorage.getItem('savedsearches') ?? '[]') as SavedSearch[];
        let resultSummarey: IResultSummary = {
          numhits: 0,
          predicted: '0',
          totaldbdocs: 0,
          totaldbsecs: 0,
          totalhits: 0,
        };
        savedSearches.push({ label: label, stateId: response.state, username: username, searchTerm: this.searchTerm, resultSummary: resultSummarey });
        localStorage.setItem('savedsearches', JSON.stringify(savedSearches));
        this.saveSearchTrigger()?.hide();
      })
  }
  
  loadSavedSearch(search: SavedSearch) {
    this.savedSearch.emit(search);
    this.searchTerm = '';
  }
  
  removeSavedSearch(search: SavedSearch) {
    const savedSearches = this.getSavedSearches.filter(s => s.stateId !== search.stateId);
    localStorage.setItem('savedsearches', JSON.stringify(savedSearches));
    this.savedSearchRemoved.emit(savedSearches);

    if (savedSearches.length === 0) {
      this.searchTerm = '';
    }
  }
}

export interface SavedSearch {
  label: string;
  stateId: string;
  username: string;
  searchTerm?: string;
  resultSummary: IResultSummary
}