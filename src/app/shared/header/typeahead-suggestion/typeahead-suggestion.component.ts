import { Highlightable } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-typeahead-suggestion',
  imports: [CommonModule],
  templateUrl: './typeahead-suggestion.component.html',
})
export class TypeaheadSuggestionComponent implements Highlightable {
  @Input({ required: true }) value!: string;

  protected active: boolean = false;

  setActiveStyles(): void {
    this.active = true;
  }

  setInactiveStyles(): void {
    this.active = false;
  }

  getLabel(): string {
    return this.value;
  }
}
