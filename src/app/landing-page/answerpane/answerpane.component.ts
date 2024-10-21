import { Component, inject, Input, SimpleChanges } from '@angular/core';
import { Answer, Paragraph } from 'src/app/interfaces/IAnswerServerResponse';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { DecimalPipe, NgIf } from '@angular/common';
import { isRagResponse, RagAnswer, RagMetadata, Source } from 'src/app/interfaces/IAnswerServerRAGResponse';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { environment } from 'src/environments/environment.prod';
import { lucideXCircle } from '@ng-icons/lucide';
import { HttpClient } from '@angular/common/http';
import { HighlightingService } from 'src/app/services/highlighting/highlighting.service';

@Component({
    selector: 'app-answerpane',
    templateUrl: './answerpane.component.html',
    styleUrls: ['./answerpane.component.css'],
    standalone: true,
    imports: [NgIf, NgIcon, DecimalPipe],
    viewProviders: [provideIcons({lucideXCircle})]
})
export class AnswerpaneComponent {

  private readonly sanitizer = inject(DomSanitizer)
  currentIndex: number = 0;
  @Input() question:string = "";
  @Input() answers: Answer[] | RagAnswer[] = []; // Add your answers here
  @Input() gotAnswers: boolean = false;
  @Input() duration: number = 0;

  showPreview: boolean = false;
  showAllSources = false;

  selectedSource: Source | undefined;

  constructor(private _svc:HighlightingService) {}

  previewUrl: SafeHtml | undefined;

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

    let links = this.currentAnswer['text'];
    let text = this.selectedSource?.['text'];
    let url = this.selectedSource?.['@ref'];

    const response = await this._svc.getHighlightingResults(text, links).toPromise();

    const html = response?.autnresponse.responsedata.hit.content;
    const terms = new Set<string>();

    if (html) {

      // we need to extract the content of all the font tags in the html
      const template = document.createElement('template');
      template.innerHTML = html;

      const fontTags = template.content.querySelectorAll('font');

      fontTags.forEach((fontTag) => {
        if (fontTag.textContent) {
          terms.add(fontTag.textContent);
        }
      });

    }


    url = `?Action=View&NoACI=true&Reference=${encodeURIComponent(
      url
    )}&EmbedImages=true&StripScript=true&OriginalBaseURL=true&Links=${encodeURIComponent(
      Array.from(terms).join(',')
    )}&Boolean=true&OutputType=HTML&MultiHighlight=False&StartTag=<a id="LinkMark"><span style="background-color: yellow; color: black;"><strong>&EndTag=</strong></span></a>#LinkMark`;
    console.log("Viewing  URL " + `${environment.view_api}${url}`);
    this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(

      `${environment.view_api}${url}`
    )
  }
}
