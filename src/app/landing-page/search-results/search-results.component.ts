import { Component, Input } from '@angular/core';
import { ISearchResultItem } from 'src/app/interfaces/IsearchResultItem';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent {
  @Input() isLoading = false;
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Input() searchResults: ISearchResultItem[] = [];
  loadPage(page: number) {
  }
}
