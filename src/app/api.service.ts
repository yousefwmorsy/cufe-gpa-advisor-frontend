import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:8000'; // Adjust if backend runs elsewhere

  constructor(private http: HttpClient) {}

  uploadTranscript(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/upload-transcript`, formData);
  }

  calculateGpa(courses: any[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/calculate-gpa`, { courses });
  }

  simulateGpa(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/simulate`, data);
  }

  getInsights(transcript: any[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/insights`, { transcript });
  }

  advisor(context: string, transcript: any[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/advisor`, { context, transcript });
  }
}
