import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ISearchResultItem } from 'src/app/interfaces/IsearchResultItem';
import { SettingsService } from 'src/app/services/settings.service';
@Component({
  selector: 'app-search-result-item',
  templateUrl: './search-result-item.component.html',
  styleUrls: ['./search-result-item.component.css'],
  standalone: true,
})
export class SearchResultItemComponent {
  @Input({ required: true }) resultitem!: ISearchResultItem;
  @Input() selected: boolean = false;

  @Output() readonly showPreview = new EventEmitter<void>();
  viewEnabled: boolean = false;
  constructor(
    private sanitizer: DomSanitizer,
    private settingsService: SettingsService
  ) {}

  ngOnInit() {
    this.settingsService.previewEnabled$.subscribe(enabled => {
      this.viewEnabled = enabled;
    });
  }
  getSanitizedHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
