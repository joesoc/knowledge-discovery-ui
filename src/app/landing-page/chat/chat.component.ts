import { Component, EventEmitter, Output } from '@angular/core';
import { Prompt } from 'src/app/interfaces/IAnswerServerConversationPrompts';
import { IManageResourcesResponse } from 'src/app/interfaces/IAnswerServerConversationResponse';
import { AnswerService } from 'src/app/services/answer.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  sessionID: string = "";
  messages: Array<{ username: string; timestamp: string ; text: string; fromUser: boolean }> = [];

  @Output() closeChat = new EventEmitter<void>();
  onCloseButtonClick() {
    this.closeChat.emit();
  }
  showChat = true;
  isMinimized =false;
  newMessage = {username: 'User1', timestamp: new Date(), text: ''};
  constructor(private answerService: AnswerService) { }


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
      addMessage(username:string, text: string, fromUser: boolean) {
    const message = {
      username: username,
      timestamp: new Date().toLocaleTimeString(),
      text: text,
      fromUser: fromUser
    };
    this.messages.push(message);
  }
  sendMessage() {
    const startTime = Date.now(); // Capture start time
    const userMessage = { username: 'User', timestamp: new Date().toLocaleTimeString(), text: this.newMessage.text, fromUser: true };
    this.addMessage("User", this.newMessage.text, true);
    this.newMessage.text = "";

    const messagesToCheck = ['What is your question?', 
                             'Did that answer your question?', 
                             'Message 3']; // Add your messages here

    this.answerService.converse(this.sessionID, userMessage.text).subscribe((response) => {
      let prompts: Prompt[] = response.autnresponse.responsedata.prompts;
      
      prompts.forEach((prompt) => {
        const endTime = Date.now(); // Capture end time
        const duration = (endTime - startTime) / 1000; // Calculate duration in seconds

        if (!messagesToCheck.includes(prompt.prompt)) {
          this.addMessage("Conversation Server", prompt.prompt + "<br><span style='font-size:5px;'>Responded in " +duration + " seconds</span>", false);
        }
        else {
          this.addMessage("Conversation Server", prompt.prompt, false);
        }
      });
    });
  }
  
  
  
  
}