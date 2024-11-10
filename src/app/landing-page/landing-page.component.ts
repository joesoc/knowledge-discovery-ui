import { AsyncPipe, NgIf, NgStyle } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { Store } from '@ngrx/store';
import { Answer, IAnswerServerAskResponse } from '../interfaces/IAnswerServerResponse';
import { Hit } from '../interfaces/IcontentResponse';
import { IQMSModelEncodeResponse } from '../interfaces/Iqmsmodel';
import { ISearchResultItem } from '../interfaces/IsearchResultItem';
import { IResultSummary } from '../interfaces/IsearchResultsSummary';
import { AnswerService } from '../services/answer.service';
import { LlmService } from '../services/llm.service';
import { QmsService } from '../services/qms.service';
import { HeaderComponent } from '../shared/header/header.component';
import { LoadingIndicatorComponent } from '../shared/loading-indicator/loading-indicator.component';
import {
  selectShowIdolSearchResults,
  selectShowVectorSearchResults,
} from '../state/settings/settings.selectors';
import { AnswerpaneComponent } from './answerpane/answerpane.component';
import { ChatComponent } from './chat/chat.component';
import { ResultsCountComponent } from './results-count/results-count.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { isRagResponse, RagAnswer } from '../interfaces/IAnswerServerRAGResponse';
import { QmsPromotionComponent } from "./qms/qms_promotion/qms_promotion.component";
import { IQMSPromotionResult } from '../interfaces/IQMSPromotionResult';
import { DahService } from '../services/dah.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
  standalone: true,
  imports: [
    HeaderComponent,
    NgIf,
    NgIcon,
    ChatComponent,
    AnswerpaneComponent,
    NgStyle,
    ResultsCountComponent,
    SearchResultsComponent,
    LoadingIndicatorComponent,
    AsyncPipe,
    QmsPromotionComponent
],
})


export class LandingPageComponent {
  private readonly store = inject(Store);
  private readonly llm = inject(LlmService);
  readonly showVectorResults$ = this.store.select(selectShowVectorSearchResults);
  readonly showIdolResults$ = this.store.select(selectShowIdolSearchResults);

  topPromotions: IQMSPromotionResult = {} as IQMSPromotionResult;
  searchkeyword: string = '';
  answers: Answer[] | RagAnswer[] = []; // Add your answers here
  gotAnswers: boolean = false;
  question: string = '';
  isChatOpen: boolean = false;
  loading: boolean = false;
  loading_answer_pane: boolean = false;
  duration: number = 0;
  showPromotions = true;
  
  ngOnInit(): void {}
  
  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }

  async fetchAnswer(question: string) {
    console.log("Fetching Answers");
    const start = performance.now();
    this.gotAnswers = false;
    this.loading = true;
    this.loading_answer_pane = true;
  
    // Check if the text is actually a question

    const language = await this.dahService.getLanguage(question).toPromise();
    console.log("Language: ", language?.autnresponse.responsedata.language);
    if (language?.autnresponse.responsedata.language === 'ARABIC') {
      console.log("Language is Arabic. Skip binary classification.");
      this.answers = [];
      this.loading_answer_pane = false;
    }
    else {
      console.log("Language is not Arabic. Proceed with binary classification.");
      const isQuestion = await this.llm.verifyInput(question);
      if (!isQuestion) {
        this.answers = [];
        this.loading_answer_pane = false;
        return;
      }
          // Add a question mark to the query if it doesn't have one
      if (!question.endsWith('?')) {
        question += '?';
      }
    }
  

  
    this.answers = [];
    this.question = question;
  
    (await this.answerService.ask(question, this.getDatabaseSelection())).subscribe(data => {
        this.answers = data.autnresponse.responsedata.answers
          ? data.autnresponse.responsedata.answers.answer
          : [];
      
      this.gotAnswers = true;
      this.loading_answer_pane = false;
      this.duration = performance.now() - start;
    });
  }
  
  resultsSummary: IResultSummary = {} as IResultSummary;
  resultItems: ISearchResultItem[] = [];
  idolresultsItems: ISearchResultItem[] = [];
  idolresultsSummary: IResultSummary = {} as IResultSummary;
  selectedDatabase: string[] = [];

  constructor(
    private svcQms: QmsService,
    private answerService: AnswerService,
    private dahService: DahService
  ) {}

  propogateDatabaseSelection(valueEmitted: any) {
    this.selectedDatabase = [];
    valueEmitted.forEach((database: string) => {
      this.selectedDatabase.push(database);
    });
  }
  getDatabaseSelection() {
    return this.selectedDatabase.join(',');
  }

  // Method to generate the title based on the hit title or the filename in the URL
  generateTitle(existingTitle: string, url: string): string {
    // If existingTitle is not empty, return it
    if (existingTitle) {
      return existingTitle;
    } else {
    }

    // If the title is empty, extract the filename from the URL
    const match = /[^/]*$/.exec(url);
    const generatedTitle = match ? decodeURIComponent(match[0]) : '';

    // If there's a match, return it; otherwise, return an empty string
    return generatedTitle;
  }

  propogateSearchTerm(valueEmitted: any) {
    this.showPromotions = false;
    this.loading= true;    
    this.answers = [];
    this.question = valueEmitted;
    this.fetchAnswer(this.question);
    this.resultsSummary = {} as IResultSummary;
    this.resultItems = [];
    this.idolresultsItems = [];
    this.idolresultsSummary = {} as IResultSummary;
    this.searchkeyword = valueEmitted;
    this.svcQms.getQMSPromotions(this.searchkeyword, this.getDatabaseSelection()).subscribe((data: IQMSPromotionResult) => {
      this.showPromotions = true;
      this.topPromotions = data;
    });
    this.svcQms.encodeQMS(this.searchkeyword).subscribe((data: IQMSModelEncodeResponse) => {
      let autnresponse = data.autnresponse;
      let responsedata = autnresponse.responsedata;
      this.svcQms.getResults(this.searchkeyword, this.getDatabaseSelection()).subscribe(data => {
        this.idolresultsSummary.numhits = parseInt(data.autnresponse.responsedata.numhits);
        this.idolresultsSummary.predicted = data.autnresponse.responsedata.predicted;
        this.idolresultsSummary.totaldbdocs = parseInt(data.autnresponse.responsedata.totaldbdocs);
        this.idolresultsSummary.totaldbsecs = parseInt(data.autnresponse.responsedata.totaldbsecs);
        this.idolresultsSummary.totalhits = parseInt(data.autnresponse.responsedata.totalhits);
        data.autnresponse.responsedata.hit?.forEach((hit: Hit) => {
          this.idolresultsItems.push({
            title: this.generateTitle(hit.title, hit.reference),
            reference: hit.reference,
            summary: hit.summary,
            autnrank: hit.weight, // Add the autnrank property here
          });
        });
      });

      if (responsedata.embeddings) {
        let vector = responsedata.embeddings.vector[0];
        this.svcQms.getVectorResults(vector.$, this.getDatabaseSelection()).subscribe(data => {
          this.resultsSummary.numhits = parseInt(data.autnresponse.responsedata.numhits);
          this.resultsSummary.predicted = data.autnresponse.responsedata.predicted;
          this.resultsSummary.totaldbdocs = parseInt(data.autnresponse.responsedata.totaldbdocs);
          this.resultsSummary.totaldbsecs = parseInt(data.autnresponse.responsedata.totaldbsecs);
          this.resultsSummary.totalhits = parseInt(data.autnresponse.responsedata.totalhits);
          data.autnresponse.responsedata.hit?.forEach((hit: Hit) => {
            this.resultItems.push({
              title: this.generateTitle(hit.title, hit.reference),
              reference: hit.reference,
              summary: hit.summary,
              autnrank: hit.weight, // Add the autnrank property here
            });
          });
        });
        // Do something with the vector
      } 

    });

  }
}
