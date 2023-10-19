import { Component, Input } from '@angular/core';
import { ISearchResultItem } from 'src/app/interfaces/IsearchResultItem';

@Component({
  selector: 'app-search-result-item',
  templateUrl: './search-result-item.component.html',
  styleUrls: ['./search-result-item.component.css']
})
export class SearchResultItemComponent {
  @Input() resultitem: ISearchResultItem = {} as ISearchResultItem;
}
