import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IResultSummary } from 'src/app/interfaces/IsearchResultsSummary';

@Component({
  selector: 'app-results-count',
  templateUrl: './results-count.component.html',
  styleUrls: ['./results-count.component.css'],
})
export class ResultsCountComponent {
  @Input() keyword: string = '';
  @Input() resultsSummary: IResultSummary = {} as IResultSummary;
  @Input() resultType: string = '';
}
