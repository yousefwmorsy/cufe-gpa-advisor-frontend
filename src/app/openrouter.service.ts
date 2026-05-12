import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OpenRouterMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

@Injectable({ providedIn: 'root' })
export class OpenRouterService {
    private apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
    private model = 'arcee-ai/trinity-large-thinking:free'; // You can change to another free model
    constructor(private http: HttpClient) { }

    sendMessage(apiKey: string, messages: OpenRouterMessage[]): Observable<any> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        });
        const body = {
            model: this.model,
            messages: messages,
        };
        return this.http.post(this.apiUrl, body, { headers });
    }
}
