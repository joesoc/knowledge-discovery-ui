import { Component, computed, inject, input, resource, signal } from '@angular/core';
import { AnswerBankService } from '../services/answer-bank.service';
import { lastValueFrom, map } from 'rxjs';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus, lucideMinus } from '@ng-icons/lucide';
import {CdkAccordionModule} from '@angular/cdk/accordion';
import { QuestionService } from '../services/question.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IAnswerBankResponse } from '../interfaces/IAnswerBankResponse';
import { SettingsService } from '../services/settings.service';

@Component({
  selector: 'app-people-also-asked',
  imports: [NgIcon, CdkAccordionModule],
  viewProviders: [provideIcons({ lucidePlus, lucideMinus})],
  templateUrl: './people-also-asked.component.html',
  styleUrl: './people-also-asked.component.css',
})
export class PeopleAlsoAskedComponent {
  private readonly answerbank = inject(AnswerBankService);
  private readonly questionService = inject(QuestionService);
  relatedQuestions: IAnswerBankResponse[] = [];
  hasRelatedQuestions: boolean = false;
  isPeopleAlsoAskedEnabled = false;

  readonly isLoading = signal(true);

  constructor(private readonly settingsService: SettingsService) {
    this.questionService.question$.pipe(takeUntilDestroyed()).subscribe((question) => {
      this.isLoading.set(true);
      this.isPeopleAlsoAskedEnabled = localStorage.getItem('peoplealsoaskedEnabled') === 'true';
      this.answerbank.getRelatedQuestions(question).subscribe((response) => {
        const qna_pairs: IAnswerBankResponse[] = Array.isArray(response) ? response : [];

        this.relatedQuestions = qna_pairs;
        this.hasRelatedQuestions = qna_pairs.length > 0;
        this.isLoading.set(false);
      });
    });
  }
}
