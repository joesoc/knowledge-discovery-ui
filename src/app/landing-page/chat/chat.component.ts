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
  sessionID: string | undefined;
  messages: Array<{ username: string; timestamp: string ; text: string; fromUser: boolean }> = [];

  @Output() closeChat = new EventEmitter<void>();
  onCloseButtonClick() {
    this.closeChat.emit();
  }
  showChat = true;
  newMessage = {username: 'User1', timestamp: new Date(), text: ''};
  constructor(private answerService: AnswerService) { }

  ngOnInit(): void {
    this.initializeChatbot();
  }
  initializeChatbot(): void {
    // Replace 'variables' with any required session variables
        this.answerService.getSessionID().subscribe((response: IManageResourcesResponse) => {
          this.sessionID = response.autnresponse.responsedata.result.managed_resources.id;
          console.log('Session ID: ' + this.sessionID);
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
    // Assuming this method is triggered when the user sends a message
    // First, add the user's message
    const userMessage = { ...this.newMessage, fromUser: true, timestamp: new Date().toLocaleTimeString() };
    this.messages.push(userMessage);
    
    // Reset newMessage
    this.newMessage = { username: 'User', timestamp: new Date(), text: '' };
  
    // Simulate a bot response
    setTimeout(() => {
      const botMessage = {
        username: 'Bot',
        timestamp: new Date().toLocaleTimeString(), // Convert the timestamp to a Date object
        text: 'This is a simulated response from the bot.',
        fromUser: false // Indicating this message is from the bot
      };
      this.messages.push(botMessage);
    }, 1000); // Delay the bot response by 1 second for effect
  }
  
  
  
}