import { ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, EventEmitter, Output, QueryList, ViewChild, ViewChildren, inject } from '@angular/core';
import { Prompt } from 'src/app/interfaces/IAnswerServerConversationPrompts';
import { IManageResourcesResponse } from 'src/app/interfaces/IAnswerServerConversationResponse';
import { AnswerService } from 'src/app/services/answer.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DynamicHostDirective } from './dynamic-host.directive';
import { DynamicValidChoicesComponent } from './dynamic-valid-choices/dynamic-valid-choices.component';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  private changeDetector = inject(ChangeDetectorRef);
  sessionID: string = "";
  messages: Array<{ username: string; timestamp: string ; text: SafeHtml; fromUser: boolean, choices: string[] }> = [];

  @Output() closeChat = new EventEmitter<void>();
  @ViewChild(DynamicHostDirective, { static: false })
  dynamicHost!: DynamicHostDirective;

  @ViewChildren('chatMessage') chatMessages!: QueryList<ElementRef<HTMLElement>>;

  onCloseButtonClick() {
    this.closeChat.emit();
  }
  showChat = true;
  isMinimized =false;
  newMessage = {username: 'User1', timestamp: new Date(), text: ''};
  constructor(private answerService: AnswerService, private sanitizer: DomSanitizer, private componentFactoryResolver: ComponentFactoryResolver) { }


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
                             'Let me look up other answers for you']; // Add your messages here

    this.answerService.converse(this.sessionID, userMessage.text).subscribe((response) => {
      let prompts: Prompt[] = response.autnresponse.responsedata.prompts;
      console.table(prompts);
      prompts.forEach((prompt) => {
        const endTime = Date.now(); // Capture end time
        const duration = (endTime - startTime) / 1000; // Calculate duration in seconds

        if (!messagesToCheck.includes(prompt.prompt)) {
          const safeMessage: SafeHtml = this.sanitizer.bypassSecurityTrustHtml(this.decodeHtml(prompt.prompt) + "<br><span class=\"responded-time\">Responded in " + duration + " seconds</span>");
          this.addMessage("Conversation Server", safeMessage, false);

        }
        
        else {
          if (prompt.valid_choices) {
            let response = prompt.prompt;
            let choicesHTML = prompt.valid_choices.valid_choice.map(choice => `<button class='btn btn-primary btn-sm' value='${choice}' style='margin: 5px;'>${choice}</button>`);
            // this.loadValidChoices(prompt.valid_choices.valid_choice);
            let responseHTML = `${response}<br>`;

            console.table(responseHTML);
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
  
}