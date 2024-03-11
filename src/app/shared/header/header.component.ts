import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChildren,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLogOut } from '@ng-icons/lucide';
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
    FormsModule,
    TypeaheadSuggestionComponent,
  ],
  providers: [provideIcons({ lucideLogOut })],
})
export class HeaderComponent {
  private readonly store = inject(Store);
  private readonly loginService = inject(LoginService);
  private readonly destroyRef = inject(DestroyRef);
  readonly selectedDatabases$ = this.store.select(selectDatabases);
  readonly databaseCount$ = this.store.select(selectDatabaseCount);
  readonly typeaheadResults$ = this.store.select(selectTypeaheadResults);
  readonly typeaheadLoading$ = this.store.select(selectTypeaheadLoading);
  readonly typeaheadShowResults$ = this.store.select(selectTypeaheadShowResults);

  username = localStorage.getItem('username') ?? '';
  searchTerm: string = '';
  readonly didSearch$ = new Subject<string>();

  @Input() title: { titleValue: string } | undefined;
  @Output() searchTermChanged = new EventEmitter<string>();
  @Output() selectedDatabasesChanged = new EventEmitter<string[]>();
  @Output() showVectorResultsChanged = new EventEmitter<boolean>();
  @Output() showIDOLResultsChanged = new EventEmitter<boolean>();

  @ViewChildren(TypeaheadSuggestionComponent) suggestions?: QueryList<TypeaheadSuggestionComponent>;

  // Add this to your existing TypeScript class
  public showSettingsDialog = false;

  activeDescendantManager?: ActiveDescendantKeyManager<TypeaheadSuggestionComponent>;

  propogateSearchTerm(value: string) {
    const result = this.activeDescendantManager?.activeItem?.value;
    debugger;
    this.store.dispatch(TypeaheadActions.closeTypeahead());

    if (result) {
      this.searchTerm = result;
      this.searchTermChanged.emit(result);
      return;
    }

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

    this.didSearch$
      .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
      .subscribe(searchTerm => {
        this.store.dispatch(TypeaheadActions.loadTypeahead({ search: searchTerm }));
      });
  }

  ngAfterViewInit() {
    this.activeDescendantManager = new ActiveDescendantKeyManager(this.suggestions!)
      .withVerticalOrientation()
      .withTypeAhead()
      .withWrap();
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

  closeTypeahead(): void {
    this.store.dispatch(TypeaheadActions.closeTypeahead());
  }

  onKeydown(event: KeyboardEvent) {
    this.activeDescendantManager?.onKeydown(event);

    // if this is an arrow key, prevent the default behavior
    if (event.key.startsWith('Arrow')) {
      event.preventDefault();
    }
  }
}
