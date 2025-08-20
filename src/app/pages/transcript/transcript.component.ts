@Component({
  selector: 'app-transcript',
  templateUrl: './transcript.component.html',
  styleUrls: ['./transcript.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class TranscriptComponent {
  // ...existing code...
  get currentTermGPA(): number {
    const courses = this.terms[this.selectedTermIdx]?.courses || [];
    let totalPoints = 0, totalCredits = 0;
    for (const c of courses) {
      if (c.credits > 0) {
        totalPoints += c.gpa * c.credits;
        totalCredits += c.credits;
      }
    }
    return totalCredits > 0 ? +(totalPoints / totalCredits).toFixed(2) : 0;
  }

  get cumulativeGPA(): number {
    let totalPoints = 0, totalCredits = 0;
    for (const term of this.terms) {
      for (const c of term.courses) {
        if (c.credits > 0) {
          totalPoints += c.gpa * c.credits;
          totalCredits += c.credits;
        }
      }
    }
    return totalCredits > 0 ? +(totalPoints / totalCredits).toFixed(2) : 0;
  }
  // ...existing code...
  onCreditsChange(course: any): void {
    if (course.credits < 0) {
      course.credits = 0;
    }
  }
  editTerms = false;
  pdfUrl: SafeResourceUrl | null = null;

  gradeOptions = [
    { label: 'A+', value: 'A+' },
    { label: 'A', value: 'A' },
    { label: 'A-', value: 'A-' },
    { label: 'B+', value: 'B+' },
    { label: 'B', value: 'B' },
    { label: 'B-', value: 'B-' },
    { label: 'C+', value: 'C+' },
    { label: 'C', value: 'C' },
    { label: 'C-', value: 'C-' },
    { label: 'D+', value: 'D+' },
    { label: 'D', value: 'D' },
    { label: 'F', value: 'F' },
    { label: 'IC', value: 'IC' },
    { label: 'W', value: 'W' },
    { label: 'FW', value: 'FW' }
  ];

  gradeToGpaMap: { [key: string]: number } = {
    'A+': 4.00,
    'A': 4.00,
    'A-': 3.70,
    'B+': 3.30,
    'B': 3.00,
    'B-': 2.70,
    'C+': 2.30,
    'C': 2.00,
    'C-': 1.70,
    'D+': 1.30,
    'D': 1.00,
    'F': 0.00,
    'IC': 0.00,
    'W': 0.00,
    'FW': 0.00
  };
  terms = [
    {
      name: 'Spring',
      year: '2025',
      courses: [
        { name: 'Linear Algebra', credits: 3, grade: 'A-', gpa: 3.70 },
        { name: 'Chemistry', credits: 3, grade: 'B', gpa: 3.00 }
      ]
    }
  ];

  onGradeChange(course: any): void {
    course.gpa = this.gradeToGpaMap[course.grade] || 0;
    if (["IC", "W", "FW"].includes(course.grade)) {
      course.credits = 0;
    } else if (course.credits < 0) {
      course.credits = 0;
    }
  }



  selectedTermIdx = 0;

  constructor(private sanitizer: DomSanitizer) {}


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const url = URL.createObjectURL(file);
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
  }

  selectTerm(idx: number) {
    this.selectedTermIdx = idx;
  }

  addTerm() {
    const newTermIdx = this.terms.length + 1;
    this.terms.push({
      name: `Term ${newTermIdx}`,
      year: '',
      courses: []
    });
    this.selectedTermIdx = this.terms.length - 1;
  }

  deleteTerm(idx: number) {
    this.terms.splice(idx, 1);
    if (this.selectedTermIdx >= this.terms.length) {
      this.selectedTermIdx = this.terms.length - 1;
    }
  }
}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
