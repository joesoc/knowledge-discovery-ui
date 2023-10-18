import { Component, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Input() title: { titleValue: string; } | undefined;
  @Output() searchTermChanged = new EventEmitter<string>();

  propogateSearchTerm(value: string) {
    this.searchTermChanged.emit(value);
  }
}
