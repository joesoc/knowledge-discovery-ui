import { Component, Input, SimpleChanges } from '@angular/core';
import { ISearchResultItem } from 'src/app/interfaces/IsearchResultItem';
import { SearchResultItemComponent } from '../search-result-item/search-result-item.component';
import { NgIf, NgFor } from '@angular/common';

@Component({
    selector: 'app-search-results',
    templateUrl: './search-results.component.html',
    styleUrls: ['./search-results.component.css'],
    standalone: true,
    imports: [NgIf, NgFor, SearchResultItemComponent]
})
export class SearchResultsComponent {
  @Input() isLoading = false;
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Input() searchResults: ISearchResultItem[] = [];
  loadPage(page: number) {
  }
}
