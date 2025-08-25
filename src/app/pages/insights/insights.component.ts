import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranscriptService } from '../../transcript.service';
import { Subscription } from 'rxjs';
import { GpaTrendChartComponent } from './gpa-trend-chart.component';

@Component({
  selector: 'app-insights',
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

    // Get last term GPA from last term box
    if (this.terms.length > 0) {
      const lastTerm = this.terms[this.terms.length - 1];
      let lastPoints = 0, lastCredits = 0;
      for (const c of lastTerm.courses) {
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
