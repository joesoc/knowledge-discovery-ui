import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-results-count',
  templateUrl: './results-count.component.html',
  styleUrls: ['./results-count.component.css']
})
export class ResultsCountComponent {
  @Input() keyword:string = "";
}
