import { Component, Input } from '@angular/core';
import { IResultSummary } from 'src/app/interfaces/IsearchResultsSummary';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-results-count',
    templateUrl: './results-count.component.html',
    styleUrls: ['./results-count.component.css'],
    standalone: true,
    imports: [NgIf]
})
export class ResultsCountComponent {
  @Input() keyword:string = "";
  @Input() resultsSummary:IResultSummary = {} as IResultSummary;
  @Input() resultType:string = "";
}
