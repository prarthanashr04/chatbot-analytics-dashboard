import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from './chatbot-service';
import { trigger, transition, style, animate } from '@angular/animations';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

@Component({
  selector: 'app-chatbot',
  imports: [FormsModule],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.scss',
  animations: [
    trigger('messageAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(8px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})

export class Chatbot {
  messages: Message[] = [];
  messageText: string = '';
  botIsTyping: boolean = false;
  speechRec: any;
  micState: boolean = false;
  @ViewChild('chatScrollBox') chatScrollBox!: ElementRef;
  @ViewChild('chatInput') chatInput!: ElementRef;
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
    setTimeout(() => this.scrollToBottom());
    this.chatbotService.getResponse(message).subscribe(reply => {
      console.log('reply:', reply);
      this.botIsTyping = false;
      this.messages.push({
        text: reply,
        sender: 'bot'
      });
      this.cdr.detectChanges();
      setTimeout(() => this.scrollToBottom());
    });
  }

  scrollToBottom() {
    try {
      const container = this.chatScrollBox.nativeElement;
      container.scrollTop = container.scrollHeight;
    } catch (err) {
      console.error('Scroll error', err);
    }
  }

  openMic() {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition not supported in this browser');
      return;
    }
    this.speechRec = new SpeechRecognition();
    this.speechRec.lang = 'en-US';
    this.speechRec.interimResults = false;
    this.micState = true;
    this.speechRec.start();
    this.speechRec.onresult = (event: any) => {
      console.log('event:', event);
      const voiceText = event.results[0][0].transcript;
      this.messageText = voiceText;
      this.speechRec.stop();
      console.log('voiceText:', voiceText);
      this.micState = false;
      this.cdr.detectChanges();
      setTimeout(() => {
        this.chatInput.nativeElement.focus();
      });
    };
    this.speechRec.onerror = () => {
      this.micState = false;
    };
    this.speechRec.onend = () => {
      this.micState = false;
    };
  }
}
