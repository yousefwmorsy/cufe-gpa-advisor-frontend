import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranscriptService } from '../../transcript.service';
import { GpaCalculatorService } from '../../gpa-calculator.service';

@Component({
  selector: 'app-simulation',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './simulation.component.html',
  styleUrl: './simulation.component.scss'
})
export class SimulationComponent implements OnInit {
  private _targetGPA: number = 4.0;
  get targetGPA(): number {
    return this._targetGPA;
  }
  set targetGPA(value: number) {
    this._targetGPA = value;
    this.updateSimulation();
  }
  numTerms: number = 1;
  terms: any[] = [];
  selectedTermIdx: number = 0;
  possible: boolean = true;
  simulatedGPA: number = 0;
  editTerms: boolean = false;
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
    { label: 'FW', value: 'FW' },
    { label: 'UNK', value: 'UNKNOWN' }
  ];
  // Use gradeMap from GpaCalculatorService for mapping

  constructor(
    private transcriptService: TranscriptService,
    public gpaCalculator: GpaCalculatorService
  ) {}

  ngOnInit() {
    // Start with current transcript terms
    this.terms = this.transcriptService.getTerms().map(term => ({
      ...term,
      courses: term.courses.map((c: any) => ({ ...c }))
    }));
    this.addSimulationTerms();
    this.updateSimulation();
  }
  
  addSimulationTerms() {
    // Find how many transcript terms there are
    const transcriptTerms = this.transcriptService.getTerms().length;
    // Separate transcript and sim terms
    let transcript = this.terms.slice(0, transcriptTerms);
    let simTerms = this.terms.slice(transcriptTerms);
    // Adjust simTerms to match numTerms
    if (simTerms.length < this.numTerms) {
      for (let i = simTerms.length; i < this.numTerms; i++) {
        simTerms.push({
          name: `Sim Term ${i + 1}`,
          year: '',
          courses: []
        });
      }
    } else if (simTerms.length > this.numTerms) {
      simTerms = simTerms.slice(0, this.numTerms);
    }
    // Update terms
    this.terms = [...transcript, ...simTerms];
  }

  onInputChange() {
    this.addSimulationTerms();
    this.updateSimulation();
  }

  selectTerm(idx: number) {
    this.selectedTermIdx = idx;
  }

  addCourse(course: any) {
    this.terms[this.selectedTermIdx].courses.push({ ...course });
    this.updateSimulation();
  }

  deleteCourse(courseIdx: number) {
    this.terms[this.selectedTermIdx].courses.splice(courseIdx, 1);
    this.updateSimulation();
  }

  saveScenario() {
    const scenario = {
      targetGPA: this.targetGPA,
      numTerms: this.numTerms,
      terms: this.terms
    };
    const blob = new Blob([JSON.stringify(scenario, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gpa-scenario.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  loadScenario(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          const scenario = JSON.parse(e.target.result);
          this.targetGPA = scenario.targetGPA ?? this.targetGPA;
          this.numTerms = scenario.numTerms ?? this.numTerms;
          this.terms = scenario.terms ?? this.terms;
          this.updateSimulation();
        } catch (err) {
          alert('Invalid scenario file.');
        }
      };
      reader.readAsText(file);
    }
  }

  onCreditsChange(course: any): void {
    if (course.credits < 0) {
      course.credits = 0;
    }
    this.updateSimulation();
  }

  onGradeChange(course: any): void {
    course.gpa = this.gpaCalculator['gradeMap'][course.grade] || 0;
    if (["IC", "W", "FW"].includes(course.grade)) {
      course.credits = 0;
    } else if (course.credits < 0) {
      course.credits = 0;
    }
    this.updateSimulation();
  }

  updateSimulation() {
    // Calculate simulated GPA using the service
    this.simulatedGPA = this.gpaCalculator.calculateCumulativeGPA(this.terms);
    this.possible = this.simulatedGPA >= this.targetGPA;
  }

  get currentTermGPA(): number {
    const term = this.terms[this.selectedTermIdx];
    return this.gpaCalculator.calculateTermGPA(term);
  }
}
