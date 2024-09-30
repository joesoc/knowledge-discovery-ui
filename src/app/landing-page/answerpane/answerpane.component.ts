import { Component, inject, Input, SimpleChanges } from '@angular/core';
import { Answer } from 'src/app/interfaces/IAnswerServerResponse';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { NgIf } from '@angular/common';
import { isRagResponse, RagAnswer, RagMetadata, Source } from 'src/app/interfaces/IAnswerServerRAGResponse';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { environment } from 'src/environments/environment.prod';
import { lucideXCircle } from '@ng-icons/lucide';

@Component({
    selector: 'app-answerpane',
    templateUrl: './answerpane.component.html',
    styleUrls: ['./answerpane.component.css'],
    standalone: true,
    imports: [NgIf, NgIcon],
    viewProviders: [provideIcons({lucideXCircle})]
})
export class AnswerpaneComponent {
  private readonly sanitizer = inject(DomSanitizer)
  currentIndex: number = 0;
  @Input() question:string = "";
  @Input() answers: Answer[] | RagAnswer[] = []; // Add your answers here
  @Input() gotAnswers: boolean = false;
  showAllSources = false;

  selectedSource: Source | undefined;

  get previewUrl(): SafeHtml {
    if (!this.selectedSource) {
      return '';
    }

    let url = this.selectedSource?.['@ref'];
    url = `?Action=View&NoACI=true&Reference=${encodeURIComponent(
      url
    )}&EmbedImages=true&StripScript=true&OriginalBaseURL=true&Links="${encodeURIComponent(
      this.selectedSource['text']
    )}"&Boolean=true&OutputType=HTML#LinkMark`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `${environment.view_api}${url}`
    );
  }

  get sources(): Source[] {
    // if we are not showing all sources, return the first 3 sources
    if (!this.showAllSources) {
      return (this.currentAnswer.metadata as RagMetadata).sources.source.slice(0, 3);
    }

    // if we are showing all sources, return all sources
    return (this.currentAnswer.metadata as RagMetadata).sources.source;
  }

  

  get totalAnswers(): number {
    return this.answers.length;
  }

  get currentAnswer(): Answer | RagAnswer {
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

  isRagAnswer(answer: Answer | RagAnswer): answer is RagAnswer {
    return answer.metadata !== undefined &&
    (answer.metadata as RagMetadata).sources !== undefined &&
    (answer.metadata as RagMetadata).sources.source !== undefined &&
    (answer.metadata as RagMetadata).sources.source.length > 0
  }

  isStandardAnswer(answer: Answer | RagAnswer): answer is Answer {
    return !this.isRagAnswer(answer);
  }
}
