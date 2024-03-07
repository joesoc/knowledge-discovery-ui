import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
    selector: 'app-dynamic-valid-choices',
    templateUrl: './dynamic-valid-choices.component.html',
    styleUrls: ['./dynamic-valid-choices.component.css'],
    standalone: true,
    imports: [NgFor]
})
export class DynamicValidChoicesComponent {
  @Input() validChoices: string[] = [];
  
  @Output() choiceSelected = new EventEmitter<string>();

  selectChoice(choice: string) {
    this.choiceSelected.emit(choice);
  }
}
