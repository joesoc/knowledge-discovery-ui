import { Component, inject, Input, SimpleChanges } from '@angular/core';
import { Answer, Paragraph } from 'src/app/interfaces/IAnswerServerResponse';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { DecimalPipe, NgIf } from '@angular/common';
import { isRagResponse, RagAnswer, RagMetadata, Source } from 'src/app/interfaces/IAnswerServerRAGResponse';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { environment } from 'src/environments/environment.prod';
import { lucideThumbsDown, lucideThumbsUp, lucideXCircle } from '@ng-icons/lucide';
import { HttpClient } from '@angular/common/http';
import { HighlightingService } from 'src/app/services/highlighting/highlighting.service';
import { toast } from 'ngx-sonner';
import { catchError, lastValueFrom, of } from 'rxjs';
import { QmsService } from 'src/app/services/qms.service';
import { IContentResponse } from 'src/app/interfaces/IcontentResponse';
import { IContentSingleResponse } from 'src/app/interfaces/IcontentSingleResponse';

@Component({
    selector: 'app-answerpane',
    templateUrl: './answerpane.component.html',
    styleUrls: ['./answerpane.component.css'],
    standalone: true,
    imports: [NgIf, NgIcon, DecimalPipe],
    viewProviders: [provideIcons({lucideXCircle, lucideThumbsUp, lucideThumbsDown})]
})
export class AnswerpaneComponent {


  private readonly sanitizer = inject(DomSanitizer);
  private readonly http = inject(HttpClient);
  private readonly qmsService = inject(QmsService);
  currentIndex: number = 0;
  @Input() question:string = "";
  @Input() answers: Answer[] | RagAnswer[] = []; // Add your answers here
  @Input() gotAnswers: boolean = false;
  @Input() duration: number = 0;

  showPreview: boolean = false;
  showAllSources = false;
  previewing_title: string = ''
  selectedSource: Source | undefined;

  response: 'positive' | 'negative' | 'neutral' = 'neutral';

  ngOnChanges(changes: SimpleChanges) {
    if ('question' in changes) {
      this.response = 'neutral';
    }
  }
    
  previewUrl: SafeHtml | undefined;

  get sources(): Source[] {
    // if we are not showing all sources, return the first 3 sources
    if (!this.showAllSources) {
      return (this.currentAnswer.metadata as RagMetadata).sources.source.slice(0, 3);
    }

    // if we are showing all sources, return all sources
    return (this.currentAnswer.metadata as RagMetadata).sources.source;
  }

  stripCodeBlockWrapper(text: string): string {
    if (!text) return '';
    return text
      .replace(/^```html\s*/i, '')  // remove ```html at the start
      .replace(/^```\s*/i, '')      // or just ```
      .replace(/```$/, '')          // remove trailing ```
      .trim();
  }
  

  get totalAnswers(): number {
    return this.answers.length;
  }

  get currentAnswer(): Answer | RagAnswer {
    const answer = this.answers[this.currentIndex];
    // Helper function to sanitize strings
    const sanitizeString = (str: string): string => {
      return str.replace(/[\n"]/g, '');
    };
  
    // If the answer is a string, return it as is
    if (typeof answer === 'string') {
      return answer;
    }
  
    // If the answer is an object, iterate over its string properties and sanitize them
    if (answer && typeof answer === 'object') {
      const sanitizedAnswer: any = { ...answer };
  
      // Loop over the properties of the answer object
      for (const key in sanitizedAnswer) {
        if (typeof sanitizedAnswer[key] === 'string') {
          sanitizedAnswer[key] = sanitizeString(sanitizedAnswer[key]);
        }
      }
  
      return sanitizedAnswer;
    }
  
    return answer;
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

  cleanParagraph(paragraph: Paragraph) {
    // remove any backslashes
    return paragraph;
  }
  
  async selectSource(source: Source) {
    this.selectedSource = source;

 if (!this.selectedSource) {
      return;
    }
    let security_info_string = localStorage.getItem('token') ?? '';
    let ref = this.selectedSource?.['@ref'];
    this.qmsService.getContent(security_info_string, ref).subscribe((response: IContentSingleResponse) => {
      let display_url = response.autnresponse.responsedata.hit.reference;
      this.previewing_title = display_url;
    });
    let links = this.currentAnswer['text'];
    let text = this.selectedSource?.['text'];
    let url = `?Action=View&NoACI=true&Reference=${encodeURIComponent(
      ref
    )}&EmbedImages=true&StripScript=true&securityinfo=${encodeURIComponent(security_info_string)}&OriginalBaseURL=true&Links=${encodeURIComponent(
      links
    )}&Boolean=true&OutputType=HTML&MultiHighlight=False&StartTag=<a id="LinkMark"><span style="background-color: yellow; color: black;"><strong>&EndTag=</strong></span></a>#LinkMark`;
    this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(

      `${environment.view_api}${url}`
    )
    
  }

  async setResponse(response: 'positive' | 'negative' | 'neutral') {
    this.response = response;
    let username = localStorage.getItem('username');

    try {
      const result = await lastValueFrom(this.http.post(`/api/answerbank/feedback`, {
        question: this.question,
        answer: this.currentAnswer.text,
        username: username,
        response
      }));

      toast(`Registered ${this.response} feedback on the answer.`);
    } catch (e) {
      toast.error('Something went wrong')
    }
  }
}
