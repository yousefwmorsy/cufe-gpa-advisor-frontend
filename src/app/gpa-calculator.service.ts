import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GpaCalculatorService {
  // Grade mapping for GPA calculation
  public readonly gradeMap: Record<string, number> = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'F': 0.0
  };

  // Calculate GPA for a single term
  calculateTermGPA(term: any): number {
    if (!term || !Array.isArray(term.courses)) return 0;
    let totalPoints = 0, totalCredits = 0;
    for (const c of term.courses) {
      if (c.credits > 0 &&  !["IC", "W", "FW", 'UNKNOWN'].includes(c.grade)) {
        const gpa = typeof c.gpa === 'number' ? c.gpa : this.gradeMap[c.grade] ?? 0;
        totalPoints += gpa * c.credits;
        totalCredits += c.credits;
      }
    }
    return totalCredits > 0 ? +(totalPoints / totalCredits).toFixed(2) : 0;
  }

  // Calculate cumulative GPA for all terms
  calculateCumulativeGPA(terms: any[]): number {
    let totalPoints = 0, totalCredits = 0;
    for (const term of terms) {
      if (!Array.isArray(term.courses)) continue;
      for (const c of term.courses) {
        if (c.credits > 0 &&  !["IC", "W", "FW", 'UNKNOWN'].includes(c.grade)) {
          const gpa = typeof c.gpa === 'number' ? c.gpa : this.gradeMap[c.grade] ?? 0;
          totalPoints += gpa * c.credits;
          totalCredits += c.credits;
        }
      }
    }
    return totalCredits > 0 ? +(totalPoints / totalCredits).toFixed(2) : 0;
  }

  // Optionally: calculate all term GPAs as an array
  calculateAllTermGPAs(terms: any[]): number[] {
    return terms.map(term => this.calculateTermGPA(term));
  }
}