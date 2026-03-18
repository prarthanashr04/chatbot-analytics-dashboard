import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from './chatbot-service';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

@Component({
  selector: 'app-chatbot',
  imports: [FormsModule],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.scss',
})

export class Chatbot {
  messages: Message[] = [];
  messageText: string = '';
  botIsTyping: boolean = false;

  constructor(private chatbotService: ChatbotService, private cdr: ChangeDetectorRef) { }

  sendUserMessage() {
    if (!this.messageText.trim()) return;
    const message = this.messageText;
    this.messages.push({
      text: message,
      sender: 'user'
    });
    this.messageText = '';
    this.botIsTyping = true;
    this.chatbotService.getResponse(message).subscribe(reply => {
      console.log('reply:', reply);
      this.botIsTyping = false;
      this.messages.push({
        text: reply,
        sender: 'bot'
      });
      this.cdr.detectChanges();
    });
  }
}
