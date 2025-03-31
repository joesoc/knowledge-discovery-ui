import { Component, computed, HostListener, inject, Input, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';
import { Subscription } from 'rxjs';
import { ISearchResultItem } from 'src/app/interfaces/IsearchResultItem';
import { SettingsService } from 'src/app/services/settings.service';
import { environment } from 'src/environments/environment';
import { SearchResultItemComponent } from '../search-result-item/search-result-item.component';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css'],
  imports: [SearchResultItemComponent, NgIcon],
  viewProviders: [provideIcons({ lucideX })],
})
export class SearchResultsComponent {
  enableView: boolean = localStorage.getItem('viewEnabled') === 'true';
  constructor(
    private domSanitizer: DomSanitizer,
    private settingsService: SettingsService
  ) {
    this.sanitizer = domSanitizer;
  }
  private readonly sanitizer = inject(DomSanitizer);
  @Input() isLoading = false;
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Input() searchResults: ISearchResultItem[] = [];

  canClose = false;
  timeout: any;
  readonly previewItem = signal<ISearchResultItem | null>(null);
  private subscription: Subscription = new Subscription();
  readonly previewUrl = computed(() => {
    const item = this.previewItem();

    if (!item) {
      return null;
    }
    let params = new URLSearchParams();
    params.append('Reference', item.autnidentifier);
    params.append('NoACI', 'true');
    params.append('SecurityInfo', localStorage.getItem('token') as string);
    params.append('EmbedImages', 'true');
    params.append('StripScript', 'true');
    params.append('Links', '');
    params.append('OriginalBaseURL', 'true');
    params.append('Boolean', 'true');
    params.append('OutputType', 'HTML');
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `${environment.view_api}?Action=View&${params.toString()}`
    );
  });

  loadPage(page: number) {}

  showPreview(item: ISearchResultItem): void {
    this.previewItem.set(item);
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => (this.canClose = true), 100);
  }

  @HostListener('document:keydown.escape')
  hidePreview() {
    this.previewItem.set(null);
    this.canClose = false;
    clearTimeout(this.timeout);
  }

  @HostListener('document:click', ['$event'])
  hidePreviewOnClick(event: MouseEvent) {
    if (!this.previewItem() || !this.canClose) {
      return;
    }

    // if we click outside the preview, close it
    if (!(event.target as HTMLElement).closest('.preview')) {
      this.hidePreview();
    }
  }

  ngOnInit() {
    this.subscription = this.settingsService.previewEnabled$.subscribe(enabled => {
      this.enableView = enabled;
    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // If an element outside the preview is focused, close the preview
  @HostListener('document:focusin', ['$event'])
  hidePreviewOnFocus(event: FocusEvent) {
    if (!this.previewItem() || !this.canClose) {
      return;
    }

    if (!(event.target as HTMLElement).closest('.preview')) {
      this.hidePreview();
    }
  }
}
