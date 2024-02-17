import { Component, Input } from '@angular/core';
import { Answer } from 'src/app/interfaces/IAnswerServerResponse';

@Component({
  selector: 'app-answerpane',
  templateUrl: './answerpane.component.html',
  styleUrls: ['./answerpane.component.css']
})
export class AnswerpaneComponent {
  currentIndex: number = 0;
  @Input() question:string = "";
  @Input()answers: Answer[] = []; // Add your answers here
  @Input() gotAnswers: boolean = false;
  ngOnInit(): void {
    this.gotAnswers = false;
  }

  ngAfterViewInit(): void {
    console.table(this.answers);
  }
  get totalAnswers(): number {
    return this.answers.length;
  }

  get currentAnswer(): Answer {
    return this.answers[this.currentIndex];
  }

  get isPrevDisabled(): boolean {
    return this.currentIndex === 0;
  }

  get isNextDisabled(): boolean {
    return this.currentIndex === this.totalAnswers - 1;
  }

  prevAnswer(): void {
    this.currentIndex--;
  }

  nextAnswer(): void {
    this.currentIndex++;
  }
}
