import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranscriptService } from '../../transcript.service';
import { Subscription } from 'rxjs';
import { GpaTrendChartComponent } from './gpa-trend-chart.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-insights',
  standalone: true,
  imports: [CommonModule, GpaTrendChartComponent],
  templateUrl: './insights.component.html',
  styleUrl: './insights.component.scss'
})
export class InsightsComponent implements OnInit, OnDestroy {
  cumulativeGPA: number = 0;
  lastTermGPA: number = 0;
  totalCredits: number = 0;
  terms: any[] = [];
  private termsSub?: Subscription;

    bestHalf: any[] = [];
    worstHalf: any[] = [];

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

    // --- Top 5 Best & Worst Subjects Logic ---
    // Gather all courses
    const allCourses: any[] = [];
    for (const term of this.terms) {
      if (Array.isArray(term.courses)) {
        for (const c of term.courses) {
          if (c.credits > 0 && c.grade) {
            allCourses.push(c);
          }
        }
      }
    }

    // Grade mapping (if not already numeric)
    const gradeMap: Record<string, number> = {
      'A+': 4.0, 'A': 4.0, 'A-': 3.7,
      'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7,
      'D+': 1.3, 'D': 1.0, 'F': 0.0
    };
    // Grade precedence for tie-breaking (A+ > A > A- > ...)
    const gradePrecedence = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F'];

    // Sort courses by grade value (desc), then credit hours (desc)
    const coursesWithGrade = allCourses.map(course => {
      let gradeValue = typeof course.gpa === 'number' ? course.gpa : gradeMap[course.grade] ?? 0;
      return {
        ...course,
        gradeValue
      };
    });

    const sorted = [...coursesWithGrade].sort((a, b) => {
      if (b.gradeValue !== a.gradeValue) {
        return b.gradeValue - a.gradeValue;
      }
      // If gradeValue is the same, use gradePrecedence
      const aPrec = gradePrecedence.indexOf(a.grade);
      const bPrec = gradePrecedence.indexOf(b.grade);
      if (aPrec !== bPrec) {
        return aPrec - bPrec;
      }
      // If still tied, use credits
      return b.credits - a.credits;
    });
  const half = Math.ceil(sorted.length / 2);
  this.bestHalf = sorted.slice(0, half);
  this.worstHalf = sorted.slice(half).reverse();
    // --- End Top 5 Logic ---
  }
}
