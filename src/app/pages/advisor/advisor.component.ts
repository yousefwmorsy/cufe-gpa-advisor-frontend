
import { Component } from '@angular/core';
import { OpenRouterService, OpenRouterMessage } from '../../openrouter.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import DOMPurify from 'dompurify';


@Component({
  selector: 'app-advisor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './advisor.component.html',
  styleUrl: './advisor.component.scss'
})

export class AdvisorComponent {
  messages: OpenRouterMessage[] = [];
  input = '';
  loading = false;
  hasStarted = false;
  apiToken = '';
  tokenSaved = false;
  transcriptAvailable = false;

  private tokenStorageKey = 'openrouter_token';
  private transcriptStorageKey = 'transcript_terms';

  constructor(private openRouter: OpenRouterService, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    const savedToken = localStorage.getItem(this.tokenStorageKey);
    if (savedToken) {
      this.apiToken = savedToken;
      this.tokenSaved = true;
    }
    this.transcriptAvailable = this.getTranscriptSnapshot().length > 0;
  }

  saveToken() {
    if (!this.apiToken.trim()) return;
    localStorage.setItem(this.tokenStorageKey, this.apiToken.trim());
    this.tokenSaved = true;
  }

  clearToken() {
    localStorage.removeItem(this.tokenStorageKey);
    this.apiToken = '';
    this.tokenSaved = false;
  }

  startAdvisor() {
    if (this.loading || !this.apiToken.trim()) return;
    const transcript = this.getTranscriptSnapshot();
    const systemPrompt = this.buildInitialPrompt(transcript);
    this.messages = [{ role: 'system', content: systemPrompt }];
    this.loading = true;
    this.requestCompletion(true);
  }

  send() {
    if (!this.input.trim() || !this.hasStarted) return;
    this.messages.push({ role: 'user', content: this.input });
    this.input = '';
    this.loading = true;
    this.requestCompletion(false);
  }

  private requestCompletion(isStart: boolean, retryOnce = true) {
    this.openRouter.sendMessage(this.apiToken, this.messages).subscribe({
      next: (res) => {
        const content = res?.choices?.[0]?.message?.content || res?.choices?.[0]?.text || '';
        if (!content && retryOnce) {
          this.messages.push({
            role: 'system',
            content: 'Return the final answer in the content field only. Do not omit content.'
          });
          this.requestCompletion(isStart, false);
          return;
        }

        this.messages.push({ role: 'assistant', content: content || 'No response.' });
        this.loading = false;
        if (isStart) {
          this.hasStarted = true;
        }
      },
      error: () => {
        this.messages.push({ role: 'assistant', content: 'Error: Unable to get response.' });
        this.loading = false;
      }
    });
  }

  private getTranscriptSnapshot(): any[] {
    const raw = localStorage.getItem(this.transcriptStorageKey);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private buildInitialPrompt(transcript: any[]): string {
    const transcriptText = transcript.length
      ? JSON.stringify(transcript, null, 2)
      : 'No transcript data found in local storage.';
    return [
      'You are a GPA advisor. Provide a concise analysis of the student\'s transcript,',
      'highlight strengths/risks, and give 3-5 actionable recommendations.',
      'Keep the tone supportive and practical. Use bullet points when helpful.',
      'Transcript data:',
      transcriptText
    ].join('\n');
  }

  renderMarkdown(content: string): SafeHtml {
    const rawHtml = marked.parse(content || '', {
      breaks: true,
      gfm: true
    }) as string;
    const sanitized = DOMPurify.sanitize(rawHtml);
    return this.sanitizer.bypassSecurityTrustHtml(sanitized);
  }
}
