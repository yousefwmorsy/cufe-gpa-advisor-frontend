import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TranscriptService {
  private termsSubject = new BehaviorSubject<any[]>(this.loadTerms());
  terms$ = this.termsSubject.asObservable();

  private loadTerms(): any[] {
    const saved = localStorage.getItem('transcript_terms');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [];
  }

  getTerms(): any[] {
    return this.termsSubject.getValue();
  }

  setTerms(terms: any[]) {
    this.termsSubject.next(terms);
    localStorage.setItem('transcript_terms', JSON.stringify(terms));
  }

  updateTerm(idx: number, term: any) {
    const terms = this.getTerms();
    terms[idx] = term;
    this.setTerms([...terms]);
  }

  updateCourse(termIdx: number, courseIdx: number, course: any) {
    const terms = this.getTerms();
    terms[termIdx].courses[courseIdx] = course;
    this.setTerms([...terms]);
  }

  addTerm(term: any) {
    const terms = this.getTerms();
    terms.push(term);
    this.setTerms([...terms]);
  }

  deleteTerm(idx: number) {
    const terms = this.getTerms();
    terms.splice(idx, 1);
    this.setTerms([...terms]);
  }

  addCourse(termIdx: number, course: any) {
    const terms = this.getTerms();
    terms[termIdx].courses.push(course);
    this.setTerms([...terms]);
  }

  deleteCourse(termIdx: number, courseIdx: number) {
    const terms = this.getTerms();
    terms[termIdx].courses.splice(courseIdx, 1);
    this.setTerms([...terms]);
  }
}
