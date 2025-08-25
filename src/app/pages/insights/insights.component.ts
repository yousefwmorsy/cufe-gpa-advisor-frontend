import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranscriptService } from '../../transcript.service';
import { Subscription } from 'rxjs';
import { GpaTrendChartComponent } from './gpa-trend-chart.component';

@Component({
  selector: 'app-insights',
  standalone: true,
  imports: [GpaTrendChartComponent],
  templateUrl: './insights.component.html',
  styleUrl: './insights.component.scss'
})
export class InsightsComponent implements OnInit, OnDestroy {
  cumulativeGPA: number = 0;
  lastTermGPA: number = 0;
  totalCredits: number = 0;
  terms: any[] = [];
  private termsSub?: Subscription;

  constructor(private transcriptService: TranscriptService) {}

  ngOnInit() {
    this.termsSub = this.transcriptService.terms$.subscribe(terms => {
      this.terms = terms;
      this.updateInsightsFromTranscript();
    });
  }

  ngOnDestroy() {
    this.termsSub?.unsubscribe();
  }

  updateInsightsFromTranscript() {
    // Sum total credits from all terms
    this.totalCredits = this.terms.reduce((sum, term) => {
      return sum + term.courses.reduce((tSum: number, c: any) => tSum + (c.credits > 0 ? c.credits : 0), 0);
    }, 0);

    // Get cumulative GPA from transcript calculation
    let totalPoints = 0, totalCredits = 0;
    for (const term of this.terms) {
      for (const c of term.courses) {
        if (c.credits > 0) {
          totalPoints += c.gpa * c.credits;
          totalCredits += c.credits;
        }
      }
    }
    this.cumulativeGPA = totalCredits > 0 ? +(totalPoints / totalCredits).toFixed(2) : 0;

    // Get last non-empty term GPA for last term box
    let lastTermWithCourses = null;
    for (let i = this.terms.length - 1; i >= 0; i--) {
      const term = this.terms[i];
      if (Array.isArray(term.courses) && term.courses.some((c: any) => c.credits > 0)) {
        lastTermWithCourses = term;
        break;
      }
    }
    if (lastTermWithCourses) {
      let lastPoints = 0, lastCredits = 0;
      for (const c of lastTermWithCourses.courses) {
        if (c.credits > 0) {
          lastPoints += c.gpa * c.credits;
          lastCredits += c.credits;
        }
      }
      this.lastTermGPA = lastCredits > 0 ? +(lastPoints / lastCredits).toFixed(2) : 0;
    } else {
      this.lastTermGPA = 0;
    }
  }
}
