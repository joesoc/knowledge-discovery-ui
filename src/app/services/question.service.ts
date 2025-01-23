import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Answer } from '../interfaces/IAnswerServerResponse';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  private questionSubject = new BehaviorSubject<string>('');
  private answerSubject = new BehaviorSubject<Answer[]>([]);

  question$ = this.questionSubject.asObservable();
  answer$ = this.answerSubject.asObservable();

  setQuestion(question: string) {
    this.questionSubject.next(question);
  }
  setAnswer(answer: Answer[]) {
    this.answerSubject.next(answer);
  }
}
