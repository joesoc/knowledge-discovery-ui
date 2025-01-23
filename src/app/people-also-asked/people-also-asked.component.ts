import { Component } from '@angular/core';
import { AnswerBankService } from '../services/answer-bank.service';

@Component({
  selector: 'app-people-also-asked',
  imports: [],
  templateUrl: './people-also-asked.component.html',
  styleUrl: './people-also-asked.component.css',
})
export class PeopleAlsoAskedComponent {
  constructor(private answerbanksvc: AnswerBankService) {}
  questions: any[] = []; // Holds the list of questions

  ngOnInit() {
    this.loadInitialQuestions();
  }

  loadInitialQuestions() {
    this.answerbanksvc.getrelatedquestions().subscribe(data => {
      this.questions = data.map((q: any) => ({
        ...q,
        expanded: false,
        loading: false,
        answer: null,
      }));
    });
  }

  toggleQuestion(question: any) {
    if (question.expanded) {
      question.expanded = false; // Collapse the question
    } else {
      question.expanded = true;
      if (!question.answer) {
        this.loadAnswer(question);
      }
    }
  }

  loadAnswer(question: any) {
    question.loading = true;
    this.paaService.getAnswer(question.id).subscribe(
      answer => {
        question.answer = answer;
        question.loading = false;
      },
      () => {
        question.loading = false; // Handle error gracefully
      }
    );
  }
}
