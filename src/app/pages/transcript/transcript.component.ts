import { Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranscriptService } from '../../transcript.service';

@Component({
  selector: 'app-transcript',
  templateUrl: './transcript.component.html',
  styleUrls: ['./transcript.component.scss'],
  standalone: true,
  imports: [FormsModule]
})
export class TranscriptComponent implements OnInit {
  addCourse(course: any) {
    const termIdx = this.selectedTermIdx;
    this.transcriptService.addCourse(termIdx, course);
    this.terms = this.transcriptService.getTerms();
  }

  deleteCourse(courseIdx: number) {
    const termIdx = this.selectedTermIdx;
    this.transcriptService.deleteCourse(termIdx, courseIdx);
    this.terms = this.transcriptService.getTerms();
  }
  showTextPopup = false;
  transcriptText = '';

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
  terms: any[] = [];

  selectedTermIdx = 0;
  pdfUrl: SafeResourceUrl | null = null;
  editTerms: boolean = false;

  constructor(private sanitizer: DomSanitizer, private transcriptService: TranscriptService) {}

  ngOnInit() {
  this.terms = this.transcriptService.getTerms();
  }

  confirmTranscriptText() {
    this.showTextPopup = false;
    try {
      const data = this.parseTranscriptText(this.transcriptText);
      this.terms = Object.entries(data).map(([termKey, courses]) => {
        const match = termKey.match(/^(\w+)-(\d{4})$/);
        let name = termKey, year = '';
        if (match) {
          name = match[1];
          year = match[2];
        }
        return {
          name,
          year,
          courses: (courses as any[]).map((c: any) => ({
            name: c.course_title,
            credits: c.hours,
            grade: c.grade,
            gpa: this.gradeToGpaMap[c.grade] || 0
          }))
        };
      });
      this.transcriptService.setTerms(this.terms);
      this.selectedTermIdx = 0;
    } catch (err) {
      console.error('Error parsing transcript:', err);
    }
  }

  // Parses transcript text using regex, matching backend logic
  parseTranscriptText(text: string): Record<string, any[]> {
    const semesters: Record<string, any[]> = {};
    const semesterPattern = /(Fall|Spring|Summer|Winter)-\d{4}/;
    const lines = text.split(/\r?\n/);
    let currentSemester: string | null = null;
    for (let line of lines) {
      line = line.trim();
      // Check for semester header
      const match = semesterPattern.exec(line);
      if (match) {
        currentSemester = match[0];
        semesters[currentSemester] = [];
        continue;
      }
      // Skip empty lines and non-course lines
      if (!line || !currentSemester) {
        continue;
      }
      // Try to match a course row (Course No, Title, Grade, Hours, Quality Points)
      const courseRow = line.match(/^([\w]+)\s+([A-Za-z0-9,\-\s]+)\s+([A-Za-z\+\-]+)\s+(\d+)\s+([\d\.]+)/);
      if (courseRow) {
        const courseTitle = courseRow[2].trim();
        const grade = courseRow[3].trim();
        const hours = parseInt(courseRow[4], 10);
        if (grade !== "UNKNOWN") {
          semesters[currentSemester].push({
            course_title: courseTitle,
            grade: grade,
            hours: hours,
          });
        }
      }
    }
    return semesters;
  }

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

  onCreditsChange(course: any): void {
    if (course.credits < 0) {
      course.credits = 0;
    }
    // Persist course change
    const termIdx = this.selectedTermIdx;
    const courseIdx = this.terms[termIdx].courses.indexOf(course);
    if (termIdx > -1 && courseIdx > -1) {
      this.transcriptService.updateCourse(termIdx, courseIdx, course);
      this.terms = this.transcriptService.getTerms();
    }
  }

  onGradeChange(course: any): void {
    course.gpa = this.gradeToGpaMap[course.grade] || 0;
    if (["IC", "W", "FW"].includes(course.grade)) {
      course.credits = 0;
    } else if (course.credits < 0) {
      course.credits = 0;
    }
    // Persist course change
    const termIdx = this.selectedTermIdx;
    const courseIdx = this.terms[termIdx].courses.indexOf(course);
    if (termIdx > -1 && courseIdx > -1) {
      this.transcriptService.updateCourse(termIdx, courseIdx, course);
      this.terms = this.transcriptService.getTerms();
    }
  }

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
    this.transcriptService.addTerm({
      name: `Term ${newTermIdx}`,
      year: '',
      courses: []
    });
    this.terms = this.transcriptService.getTerms();
    this.selectedTermIdx = this.terms.length - 1;
  }

  deleteTerm(idx: number) {
    this.transcriptService.deleteTerm(idx);
    this.terms = this.transcriptService.getTerms();
    if (this.selectedTermIdx >= this.terms.length) {
      this.selectedTermIdx = this.terms.length - 1;
    }
  }
}
