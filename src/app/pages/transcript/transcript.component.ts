import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-transcript',
  templateUrl: './transcript.component.html',
  styleUrls: ['./transcript.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class TranscriptComponent {
  editTerms = false;
  pdfUrl: SafeResourceUrl | null = null;

  terms = [
    {
      name: 'Fall',
      year: '2024',
      courses: [
        { name: 'Calculus I', credits: 3, grade: 'A' },
        { name: 'Physics I', credits: 4, grade: 'B+' }
      ]
    },
    {
      name: 'Spring',
      year: '2025',
      courses: [
        { name: 'Linear Algebra', credits: 3, grade: 'A-' },
        { name: 'Chemistry', credits: 3, grade: 'B' }
      ]
    }
  ];
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
