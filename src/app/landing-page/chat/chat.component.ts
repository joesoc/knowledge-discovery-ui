import { ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, EventEmitter, Output, QueryList, ViewChild, ViewChildren, inject } from '@angular/core';
import { Prompt } from 'src/app/interfaces/IAnswerServerConversationPrompts';
import { IManageResourcesResponse } from 'src/app/interfaces/IAnswerServerConversationResponse';
import { AnswerService } from 'src/app/services/answer.service';
import { DomSanitizer, SafeHtml, SafeUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  private changeDetector = inject(ChangeDetectorRef);
  sessionID: string = "";
  messages: Array<{ username: string; timestamp: string ; text: SafeHtml; fromUser: boolean, choices: string[] }> = [];
  previewUrl?: SafeUrl;
  rawUrl?: string;

  @Output() closeChat = new EventEmitter<void>();

  @ViewChildren('chatMessage') chatMessages!: QueryList<ElementRef<HTMLElement>>;

  onCloseButtonClick() {
    this.closeChat.emit();
  }
  showChat = true;
  isMinimized =false;
  newMessage = {username: 'User1', timestamp: new Date(), text: ''};
  constructor(private answerService: AnswerService, private sanitizer: DomSanitizer, private componentFactoryResolver: ComponentFactoryResolver) { 
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
  initializeChatbot(): void {
    // Replace 'variables' with any required session variables
        this.answerService.getSessionID().subscribe((response: IManageResourcesResponse) => {
          console.table(response.autnresponse.responsedata);
          this.sessionID = response.autnresponse.responsedata.result.managed_resources.id;
          this.answerService.converse(this.sessionID, '').subscribe((response) => {
            let prompts:Prompt[] = response.autnresponse.responsedata.prompts;
            prompts.forEach((prompt) => {
              this.addMessage("Conversation Server", prompt.prompt, false);
            });
          });
          //this.addMessage('Hello! How can I help you today?'+this.sessionID, false);
        });
      }
        // Example method to add a message
  addMessage(username:string, text: SafeHtml, fromUser: boolean, choices: string[] = []) {
    const message = {
      username: username,
      timestamp: new Date().toLocaleTimeString(),
      text: text,
      fromUser: fromUser,
      choices: choices
    };
    this.messages.push(message);
    this.changeDetector.detectChanges();
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.chatMessages.last.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
    } catch (error) {}
  }

  loadValidChoices(validChoices: string[]){
    // const componentFactory = this.componentFactoryResolver.resolveComponentFactory(DynamicValidChoicesComponent);
    // const viewContainerRef = this.dynamicHost.viewContainerRef;
    // viewContainerRef.clear();
    // const componentRef = viewContainerRef.createComponent(componentFactory);
    // (<DynamicValidChoicesComponent>componentRef.instance).validChoices = validChoices;
  }

  decodeHtml(html: string) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

  sendMessage() {
    const startTime = Date.now(); // Capture start time
    const userMessage = { username: 'User', timestamp: new Date().toLocaleTimeString(), text: this.newMessage.text, fromUser: true };
    this.addMessage("User", this.newMessage.text, true);
    this.newMessage.text = "";

    const messagesToCheck = ['What is your question?', 
                             'Did that answer your question?', 
                             'Whats next?',
                             '<p>I don\'t have any answers</p>',
                             'OK, let\'s cancel that.',
                             'Welcome to Virtual Agent',
                             'Thank you and have a nice day...',
                             'Let me look up other answers for you']; // Add your messages here

    this.answerService.converse(this.sessionID, userMessage.text).subscribe((response) => {
      let prompts: Prompt[] = response.autnresponse.responsedata.prompts;
      prompts.forEach((prompt) => {

        const endTime = Date.now(); // Capture end time
        const duration = (endTime - startTime) / 1000; // Calculate duration in seconds

        if (!messagesToCheck.includes(prompt.prompt)) {
          const doc = new DOMParser().parseFromString(prompt.prompt, 'text/html');
          const hiddenValue = doc.querySelector('input[type="hidden"]') as HTMLInputElement;
          if (hiddenValue !== null) {
            console.log(hiddenValue.value);
          }
          const safeMessage: SafeHtml = this.sanitizer.bypassSecurityTrustHtml(this.decodeHtml(prompt.prompt) + "<br><span class=\"responded-time\">Responded in " + duration + " seconds</span>");
          this.addMessage("Conversation Server", safeMessage, false);
        }
        
        else {
          if (prompt.valid_choices) {
            let response = prompt.prompt;
            // this.loadValidChoices(prompt.valid_choices.valid_choice);
            let responseHTML = `${response}<br>`;
            let safeMessage: SafeHtml = this.sanitizer.bypassSecurityTrustHtml(responseHTML);
            this.addMessage("Conversation Server", safeMessage, false, prompt.valid_choices.valid_choice);
          }
          else{
            let safeMessage: SafeHtml = this.sanitizer.bypassSecurityTrustHtml(prompt.prompt);
            this.addMessage("Conversation Server", safeMessage, false);
          }
        }

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
    url = `/Action=View&NoACI=true&Reference=${encodeURIComponent(url)}&EmbedImages=true&StripScript=true&OriginalBaseURL=true&Links=in%20writing&StartTag=%3Cspan%20class%3D%27haven%2Dsearch%2Dview%2Ddocument%2Dhighlighting%27%3E&EndTag=%3C%2Fspan%3E&Boolean=true&OutputType=HTML`;
    this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`${environment.view_api}${url}`);
  }    
  
  closePreview() {
    this.rawUrl = undefined;
    this.previewUrl = undefined;
  }
}