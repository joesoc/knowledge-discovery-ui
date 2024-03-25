import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
  inject,
} from '@angular/core';
import { DomSanitizer, SafeHtml, SafeUrl } from '@angular/platform-browser';
import { Prompt } from 'src/app/interfaces/IAnswerServerConversationPrompts';
import { IManageResourcesResponse } from 'src/app/interfaces/IAnswerServerConversationResponse';
import { AnswerService } from 'src/app/services/answer.service';
import { DataService } from 'src/app/services/data.service';
import { environment } from 'src/environments/environment.prod';
import { FormsModule } from '@angular/forms';
import { DynamicValidChoicesComponent } from './dynamic-valid-choices/dynamic-valid-choices.component';
import { ChatUrlDirective } from './chat-url/chat-url.directive';
import { ChatSettingsComponent } from './chat-settings/chat-settings.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { NgClass, NgIf, NgFor } from '@angular/common';
import { LoadingIndicatorComponent } from '../../shared/loading-indicator/loading-indicator.component';
import { lucideRefreshCw } from '@ng-icons/lucide';
import { QmsService } from 'src/app/services/qms.service';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css'],
    standalone: true,
    imports: [
        NgClass,
        NgIf,
        NgIcon,
        ChatSettingsComponent,
        NgFor,
        ChatUrlDirective,
        DynamicValidChoicesComponent,
        FormsModule,
        LoadingIndicatorComponent,
    ],
    viewProviders: [provideIcons({lucideRefreshCw})]
})
export class ChatComponent implements OnInit, AfterViewInit {

  private changeDetector = inject(ChangeDetectorRef);
  sessionID: string = '';
  messages: Array<Message> = [];

  previewUrl?: SafeUrl;
  rawUrl?: string;
  showChatSettings: boolean = false;
  answer_source: string = '';
  answer_text: string = '';
  loading: boolean = false;
  @Output() closeChat = new EventEmitter<void>();

  @ViewChildren('chatMessage') chatMessages!: QueryList<ElementRef<HTMLElement>>;
  @ViewChild(LoadingIndicatorComponent) loadingIndicator?: LoadingIndicatorComponent;

  @ViewChild('messageInput')
  messageInput!: ElementRef<HTMLInputElement>;

  onCloseButtonClick() {
    this.closeChat.emit();
  }
  showChat = true;
  isMinimized = false;
  newMessage = { username: 'User1', timestamp: new Date(), text: '' };
  constructor(
    private answerService: AnswerService,
    private sanitizer: DomSanitizer,
    private redisService: DataService,
    private qmsService: QmsService
  ) {}

  toggleChatSettings(): void {
    this.showChatSettings = !this.showChatSettings;
  }

  closeSettings(): void {
    this.showChatSettings = false;
  }
  minimizeChat() {
    this.isMinimized = true;
    // Additional logic to only show the chat header
  }

  maximizeChat() {
    this.isMinimized = false;
    // Logic to show the entire chat window
  }

  ngOnInit(): void {
    this.initializeChatbot();
  }

  ngAfterViewInit(): void {
    // Focus on the message input when the component is initialized
    this.messageInput.nativeElement.focus();
  }

  initializeChatbot(): void {
    this.setLoading(true);
    // Replace 'variables' with any required session variables
    this.answerService.getSessionID().subscribe(async (response: IManageResourcesResponse) => {
      this.sessionID = response.autnresponse.responsedata.result.managed_resources.id;
      // this.redisService.addDataToRedis(this.sessionID, database.value, answerServerSystem.value);
      this.answerService.converse(this.sessionID, '').subscribe(response => {
        let prompts: Prompt[] = response.autnresponse.responsedata.prompts;
        prompts.forEach(prompt => {
          this.addMessage('Conversation Server', prompt.prompt, false);
        });
        this.setLoading(false);
      });
      //this.addMessage('Hello! How can I help you today?'+this.sessionID, false);
    });
  }
  // Example method to add a message
  addMessage(username: string, text: SafeHtml, fromUser: boolean, choices: string[] = []) {
    const message = {
      username: username,
      timestamp: new Date().toLocaleTimeString(),
      text: text,
      fromUser: fromUser,
      choices: choices,
    };

    this.messages.push(message);
    this.changeDetector.detectChanges();
    this.scrollToBottom();
  }

  setLoading(loading: boolean) {
    this.loading = loading;
    this.changeDetector.detectChanges();
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    if (this.loadingIndicator) {
      this.loadingIndicator.elementRef.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
      return;
    }

    try {
      this.chatMessages.last.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    } catch (error) {}
  }

  decodeHtml(html: string) {
    var txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }

  sendMessage() {
    const startTime = Date.now(); // Capture start time
    const sessionIDInputHTML: SafeHtml = `<input type="hidden" name="sessionID" value="${this.sessionID}">`;

    const userMessage = {
      username: 'User',
      timestamp: new Date().toLocaleTimeString(),
      text: this.newMessage.text,
      fromUser: true,
    };
    this.addMessage('User', this.newMessage.text, true);
    this.newMessage.text = '';

    const messagesToCheck = [
      'What is your question?',
      'Did that answer your question?',
      'Whats next?',
      "<p>I don't have any answers</p>",
      "OK, let's cancel that.",
      'Welcome to Virtual Agent',
      'Thank you and have a nice day...',
      'Let me look up other answers for you',
    ]; // Add your messages here
    const messageToAvoidAddingSessionID = ['Ask another question', 'Summarize the document', 'End'];
    let usertext = '';
    if (messageToAvoidAddingSessionID.includes(userMessage.text)) {
      usertext = userMessage.text;
    } else {
      usertext = userMessage.text + `|${this.sessionID}`;
    }

    this.setLoading(true);
    this.answerService.converse(this.sessionID, usertext).subscribe(response => {
      let prompts: Prompt[] = response.autnresponse.responsedata.prompts;
      prompts.forEach(prompt => {
        const endTime = Date.now(); // Capture end time
        const duration = (endTime - startTime) / 1000; // Calculate duration in seconds

        if (!messagesToCheck.includes(prompt.prompt)) {
          const doc = new DOMParser().parseFromString(prompt.prompt, 'text/html');
          const hiddenValue = doc.querySelector(
            'input[id="sourceHiddenField"]'
          ) as HTMLInputElement;
          if (hiddenValue !== null) {
            this.answer_source = hiddenValue.value;
          }
          let summary:string = '';
          const texthiddenValue = doc.querySelector(
            'input[id="textHiddenField"]'
          ) as HTMLInputElement;
          if (texthiddenValue !== null) {
            this.answer_text = texthiddenValue.value;
          }
          
          console.log("Summary = " + summary);
          console.log("Logging prompt");
          console.log(prompt.prompt);
          const safeMessage: SafeHtml = this.sanitizer.bypassSecurityTrustHtml(
            this.decodeHtml(prompt.prompt) +
              '<br><span class="responded-time">Responded in ' +
              duration +
              ' seconds</span>'
          );
          this.addMessage('Conversation Server', safeMessage, false);
        } else {
          if (prompt.valid_choices) {
            let response = prompt.prompt;
            // this.loadValidChoices(prompt.valid_choices.valid_choice);
            let responseHTML = `${response}<br>`;
            let safeMessage: SafeHtml = this.sanitizer.bypassSecurityTrustHtml(responseHTML);
            this.addMessage(
              'Conversation Server',
              safeMessage,
              false,
              prompt.valid_choices.valid_choice
            );
          } else {
            let safeMessage: SafeHtml = this.sanitizer.bypassSecurityTrustHtml(prompt.prompt);
            this.addMessage('Conversation Server', safeMessage, false);
          }
        }

        this.setLoading(false);
      });
    });
  }

  selectChoice(choice: string): void {
    this.newMessage.text = choice;
    this.newMessage.timestamp = new Date();
    this.sendMessage();
  }

  showPreview(url: string) {
    this.rawUrl = url;
    // TODO: remove this hard coded url
    url = `?Action=View&NoACI=true&Reference=${encodeURIComponent(
      url
    )}&EmbedImages=true&StripScript=true&OriginalBaseURL=true&Links="${encodeURIComponent(
      this.answer_text
    )}"&Boolean=true&OutputType=HTML#LinkMark`;
    this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `${environment.view_api}${url}`
    );
  }

  closePreview() {
    this.rawUrl = undefined;
    this.previewUrl = undefined;
  }

  replayMessage(messgae: Message) {
    this.newMessage.text = messgae.text.toString();
    this.sendMessage();
  }
}

interface Message {
    username: string;
    timestamp: string;
    text: SafeHtml;
    fromUser: boolean;
    choices: string[];
}