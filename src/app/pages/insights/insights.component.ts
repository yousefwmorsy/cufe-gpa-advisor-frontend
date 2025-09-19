import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranscriptService } from '../../transcript.service';
import { Subscription } from 'rxjs';
import { GpaTrendChartComponent } from './gpa-trend-chart.component';
import { CommonModule } from '@angular/common';
import { GpaCalculatorService } from '../../gpa-calculator.service';

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

  constructor(
    private transcriptService: TranscriptService,
    private gpaCalculator: GpaCalculatorService
  ) {}

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
    // Sum total completed credits from all terms (exclude UNKNOWN grade)
    this.totalCredits = this.terms.reduce((sum, term) => {
      if (!Array.isArray(term.courses)) return sum;
      return sum + term.courses.reduce((tSum: number, c: any) => {
        return tSum + (c.credits > 0 && c.grade !== 'UNKNOWN' ? c.credits : 0);
      }, 0);
    }, 0);

    // Use GPA calculator service for cumulative GPA
    this.cumulativeGPA = this.gpaCalculator.calculateCumulativeGPA(this.terms);

    // Get last non-empty term GPA for last term box
    let lastTermWithCourses = null;
    for (let i = this.terms.length - 1; i >= 0; i--) {
      const term = this.terms[i];
      if (Array.isArray(term.courses) && term.courses.some((c: any) => c.credits > 0 && c.grade !== 'UNKNOWN')) {
        lastTermWithCourses = term;
        break;
      }
    }
    if (lastTermWithCourses) {
      this.lastTermGPA = this.gpaCalculator.calculateTermGPA(lastTermWithCourses);
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

    // Grade mapping and precedence for tie-breaking
    const gradeMap: Record<string, number> = {
      'A+': 4.0, 'A': 4.0, 'A-': 3.7,
      'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7,
      'D+': 1.3, 'D': 1.0, 'F': 0.0
    };
    const gradePrecedence = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F'];

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
      const aPrec = gradePrecedence.indexOf(a.grade);
      const bPrec = gradePrecedence.indexOf(b.grade);
      if (aPrec !== bPrec) {
        return aPrec - bPrec;
      }
      return b.credits - a.credits;
    });
    const half = Math.ceil(sorted.length / 2);
    this.bestHalf = sorted.slice(0, half);
    this.worstHalf = sorted.slice(half).reverse();
    // --- End Top 5 Logic ---
  }
}
