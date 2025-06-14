import { AsyncPipe, NgIf, NgStyle } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { Store } from '@ngrx/store';
import { RagAnswer, RagMetadata, Sources } from '../interfaces/IAnswerServerRAGResponse';
import { Answer, Classification, Classifications, Context, Metadata, Paragraph, Subject, Windows } from '../interfaces/IAnswerServerResponse';
import { Hit } from '../interfaces/IcontentResponse';
import { IQMSPromotionResult } from '../interfaces/IQMSPromotionResult';
import { ISearchResultItem } from '../interfaces/IsearchResultItem';
import { IResultSummary } from '../interfaces/IsearchResultsSummary';
import { AnswerService } from '../services/answer.service';
import { DahService } from '../services/dah.service';
import { LlmService } from '../services/llm.service';
import { QmsService } from '../services/qms.service';
import { QuestionService } from '../services/question.service';
import { HeaderComponent, SavedSearch } from '../shared/header/header.component';
import { LoadingIndicatorComponent } from '../shared/loading-indicator/loading-indicator.component';
import {
  selectShowIdolSearchResults,
  selectShowVectorSearchResults,
} from '../state/settings/settings.selectors';
import { AnswerpaneComponent } from './answerpane/answerpane.component';
import { ChatComponent } from './chat/chat.component';
import { QmsPromotionComponent } from './qms/qms_promotion/qms_promotion.component';
import { ResultsCountComponent } from './results-count/results-count.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { PeopleAlsoAskedComponent } from "../people-also-asked/people-also-asked.component";
import { SettingsService } from '../services/settings.service';
import { AgenticService } from '../services/agentic.service';
import { qs } from '../interfaces/IcontentResponse';
import { ChatCompletion } from '../interfaces/IChatCompletionResponse';
import { AgenticAnswerComponent } from './agentic-answer/agentic-answer.component';
import { NifiService } from '../services/nifi.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
  imports: [
    HeaderComponent,
    NgIf,
    NgIcon,
    ChatComponent,
    AnswerpaneComponent,
    ResultsCountComponent,
    SearchResultsComponent,
    LoadingIndicatorComponent,
    AsyncPipe,
    QmsPromotionComponent,
    PeopleAlsoAskedComponent,
    AgenticAnswerComponent
],
})
export class LandingPageComponent {


  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly store = inject(Store);
  private readonly llm = inject(LlmService);
  private readonly nifiservice = inject(NifiService);
  private readonly agentic_service = inject(AgenticService)
  readonly showVectorResults$ = this.store.select(selectShowVectorSearchResults);
  readonly showIdolResults$ = this.store.select(selectShowIdolSearchResults);

  topPromotions: IQMSPromotionResult = {} as IQMSPromotionResult;
  searchkeyword: string = '';
  answers: Answer[] | RagAnswer[] = []; // Add your answers here
  agenticAnswer: ChatCompletion | null = null;
  gotAnswers: boolean = false;
  question: string = '';
  isChatOpen: boolean = false;
  isLoadingSavedSearch: boolean = false;
  loading: boolean = false;
  loading_answer_pane: boolean = false;
  duration: number = 0;
  showPromotions = true;
  loadingPeopleAlsoAsked = false;
  showPeopleAlsoAsked = this.settingsService.getPeopleAlsoAskedEnabled();
  queryResponseSummary: qs = {} as qs;
  selectedSavedSearch: SavedSearch | undefined;

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }

  async fetchAnswer(question: string) {
    console.log('Fetching Answers');
    const start = performance.now();
    this.gotAnswers = false;
    this.loading = true;
    this.loading_answer_pane = true;
    this.loadingPeopleAlsoAsked = true;
    this.agenticAnswer = null;
    // Check if the text is actually a question

   

      // Check if the question matches the specific query
      if (question === "What are the most common topics covered in this set of documents?") {
        this.agentic_service.getTermSummary(this.queryResponseSummary).subscribe((response) => {
          // Handle the response here if needed
          this.agenticAnswer = response;

        this.gotAnswers = true;
        this.loading_answer_pane = false;
        this.loadingPeopleAlsoAsked = false;
        this.duration = performance.now() - start;
        });
      }
      else{
        const language = await this.dahService.getLanguage(question).toPromise();
        // Store the result in local storage
        let lang = language?.autnresponse?.responsedata?.language;
        if (!lang) {
          console.error("Language detection failed", language);
          lang = "english";
        }
        const queryLanguage = `${lang.toLowerCase()}utf8`;

    
        localStorage.setItem('QueryLanguage', queryLanguage);
        
        console.log('Language: ', queryLanguage);
        if (queryLanguage === 'englishutf8') {
          console.log('Language is English. Proceed with binary classification.');
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
        this.answers = [];
        this.question = question;
        let securityInfo: string = localStorage.getItem('token')?.toString() || '';
        (await this.answerService.ask(question, this.getDatabaseSelection(), securityInfo)).subscribe(data => {
          this.answers = data.autnresponse.responsedata.answers
            ? data.autnresponse.responsedata.answers.answer
            : [];
          this.questionService.setQuestion(question);
          // this.questionService.setAnswer(this.answers);
          this.gotAnswers = true;
          this.loading_answer_pane = false;
          this.loadingPeopleAlsoAsked = false;
          this.duration = performance.now() - start;
        });
      }
      else {
        console.log('Language is not English. Skip binary classification.');
        this.answers = [];
        this.loading_answer_pane = false;
        this.loadingPeopleAlsoAsked = false;
      }

    } 
  }

  resultsSummary: IResultSummary = {} as IResultSummary;
  resultItems: ISearchResultItem[] = [];
  idolresultsItems: ISearchResultItem[] = [];
  idolresultsSummary: IResultSummary = {} as IResultSummary;
  selectedDatabase: string[] = [];

  constructor(
    private svcQms: QmsService,
    private answerService: AnswerService,
    private dahService: DahService,
    private questionService: QuestionService,
    private settingsService: SettingsService
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

  ngOnInit() {
    this.settingsService.peopleAlsoAskedEnabled$.subscribe(enabled => {
      this.showPeopleAlsoAsked = enabled;
    });
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
    this.selectedSavedSearch = undefined;
    this.showPromotions = false;
    this.loading = true;
    this.answers = [];
    this.question = valueEmitted;
    let username: string = localStorage.getItem('username')?.toString() || '';
    this.nifiservice.postAudit(username, this.question).subscribe(data => {
      console.log('Audit data sent successfully:', data);
    });
    this.fetchAnswer(this.question);
    if (this.question === 'What are the most common topics covered in this set of documents?'){
      // don't propogate the search term to the results
    }
    else{
      this.resultsSummary = {} as IResultSummary;
      this.resultItems = [];
      this.idolresultsItems = [];
      this.idolresultsSummary = {} as IResultSummary;
      this.searchkeyword = valueEmitted;
      this.svcQms
        .getQMSPromotions(this.searchkeyword, this.getDatabaseSelection())
        .subscribe((data: IQMSPromotionResult) => {
          this.showPromotions = true;
          this.topPromotions = data;
        });
      let securityInfo: string = localStorage.getItem('token')?.toString() || '';
      this.svcQms.getResults(this.searchkeyword, this.getDatabaseSelection(), securityInfo).subscribe(data => {
        this.idolresultsSummary.numhits = parseInt(data.autnresponse.responsedata.numhits);
        this.idolresultsSummary.predicted = data.autnresponse.responsedata.predicted;
        this.idolresultsSummary.totaldbdocs = parseInt(data.autnresponse.responsedata.totaldbdocs);
        this.idolresultsSummary.totaldbsecs = parseInt(data.autnresponse.responsedata.totaldbsecs);
        this.idolresultsSummary.totalhits = parseInt(data.autnresponse.responsedata.totalhits);
        data.autnresponse.responsedata.hit?.forEach((hit: Hit) => {
          this.idolresultsItems.push({
            title: this.generateTitle(hit.title, hit.reference),
            reference: hit.content.DOCUMENT.URL || hit.reference,
            summary: hit.summary,
            autnrank: hit.weight, 
            autnidentifier: hit.content.DOCUMENT.AUTN_IDENTIFIER || ''
        });
        this.queryResponseSummary = data.autnresponse.responsedata.qs;
      });
      console.log('Vector Results enabled');
      });
    }
    }

    onSavedSearchClick(search: SavedSearch) {
    this.selectedSavedSearch = search;
    this.isLoadingSavedSearch = true;
    this.showPromotions = false;
    this.searchkeyword = search.searchTerm ?? '';
    //this.searchkeyword = search.searchTerm || ''; // Re-enable the assignment
    this.loading = true;
    this.answers = [];
      this.resultsSummary = {} as IResultSummary;
      this.resultItems = [];
      this.idolresultsItems = [];
      this.idolresultsSummary = {} as IResultSummary;
      let securityInfo: string = localStorage.getItem('token')?.toString() || '';
      this.svcQms.getResults(this.searchkeyword, this.getDatabaseSelection(), securityInfo, search.stateId).subscribe(data => {
        this.idolresultsSummary.numhits = parseInt(data.autnresponse.responsedata.numhits);
        this.idolresultsSummary.predicted = data.autnresponse.responsedata.predicted;
        this.idolresultsSummary.totaldbdocs = parseInt(data.autnresponse.responsedata.totaldbdocs);
        this.idolresultsSummary.totaldbsecs = parseInt(data.autnresponse.responsedata.totaldbsecs);
        this.idolresultsSummary.totalhits = parseInt(data.autnresponse.responsedata.totalhits);
        search.resultSummary = this.idolresultsSummary;
        // localStorage.setItem('savedsearches', JSON.stringify(search));
        data.autnresponse.responsedata.hit?.forEach((hit: Hit) => {
          this.idolresultsItems.push({
            title: this.generateTitle(hit.title, hit.reference),
            reference: hit.reference,
            summary: hit.summary,
            autnrank: hit.weight, 
            autnidentifier: hit.content.DOCUMENT.AUTN_IDENTIFIER || ''
        });
        this.queryResponseSummary = data.autnresponse.responsedata.qs;
        this.loading = false;
      });
      });
    }
  
    onSearchRemoved(searches: SavedSearch[]) {
      if (searches.length === 0) {
        this.resultItems = [];
        this.idolresultsItems = [];
        this.answers = [];
        this.searchkeyword = '';
        this.loading = false;
      }
    }
}
