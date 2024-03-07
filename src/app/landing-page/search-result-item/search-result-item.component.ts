import { Component, Input } from '@angular/core';
import { ISearchResultItem } from 'src/app/interfaces/IsearchResultItem';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Component({
    selector: 'app-search-result-item',
    templateUrl: './search-result-item.component.html',
    styleUrls: ['./search-result-item.component.css'],
    standalone: true
})
export class SearchResultItemComponent {
  constructor(private sanitizer: DomSanitizer) { 
  }
  getSanitizedHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
    

  }

  ngOnInit(): void {
    console.log('Debug resultitem.summary:', this.resultitem.summary);
  }
  @Input() resultitem: ISearchResultItem = {} as ISearchResultItem;
}
