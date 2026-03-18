import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {
  responses = [
    { keyword: 'hello', reply: 'Hello! How can I help you today?' },
    { keyword: 'help', reply: 'Sure! I can help with analytics.' },
    { keyword: 'pricing', reply: 'Our pricing starts at Rs999 per month.' },
    { keyword: 'features', reply: 'We provide analytics dashboards and chatbot.' },
    { keyword: 'support', reply: 'You can mail support@gmail.com.' },
    { keyword: 'dashboard', reply: 'The dashboard shows analytics.' },
    { keyword: 'users', reply: 'We have 1000 users.' },
    { keyword: 'analytics', reply: 'the systematic process of analyzing, interpreting, and communicating meaningful patterns' },
    { keyword: 'conversion', reply: 'Conversion rate measures successful interactions.' },
    { keyword: 'bye', reply: 'Goodbye!' }
  ];

  getResponse(message: string) {
    const text = message.toLowerCase();
    const matchResponse = this.responses.find(r => text.includes(r.keyword));
    const reply = matchResponse ? matchResponse.reply : "Sorry, I didn't understand that";
    // return reply;
    return of(reply).pipe(delay(1500));
  }
}
