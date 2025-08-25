import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'gpa-trend-chart',
  templateUrl: './gpa-trend-chart.component.html',
  styleUrls: ['./gpa-trend-chart.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class GpaTrendChartComponent {
  @Input() terms: any[] = [];
  hoverIdx: number | null = null;

  get chartData() {
    // Use the same GPA calculation as transcript page for each term
    return this.terms.map(term => {
      let totalPoints = 0, totalCredits = 0;
      for (const c of term.courses) {
        if (c.credits > 0) {
          totalPoints += c.gpa * c.credits;
          totalCredits += c.credits;
        }
      }
      const gpa = totalCredits > 0 ? +(totalPoints / totalCredits).toFixed(2) : 0;
      return {
        name: `${term.name} ${term.year || ''}`.trim(),
        gpa
      };
    });
  }

  getPolylinePoints(): string {
    return this.chartData.map((d, i) => `${40 + i * 60},${180 - d.gpa * 40}`).join(' ');
  }
}
