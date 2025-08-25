import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'gpa-trend-chart',
  templateUrl: './gpa-trend-chart.component.html',
  styleUrls: ['./gpa-trend-chart.component.scss'],
  standalone: true,
  imports: [CommonModule, BaseChartDirective]
})
export class GpaTrendChartComponent implements OnChanges {
  @Input() terms: any[] = [];

  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'GPA',
        fill: false,
  borderColor: '#8a4a4b',
  backgroundColor: '#8a4a4b',
  pointBackgroundColor: '#8a4a4b',
        pointBorderColor: '#fff',
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0,
      }
    ]
  };

  lineChartLabels: string[] = [];

  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false // legend removed
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value}`;
          }
        }
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'GPA'
        },
        ticks: {
          stepSize: 1
        }
      },
      x: {
        title: {
          display: true,
          text: 'Term'
        }
      }
    }
  };

  ngOnChanges(): void {
    if (Array.isArray(this.terms) && this.terms.length) {
      this.lineChartLabels = this.terms.map((t: any) => t.name);
      this.lineChartData.labels = this.lineChartLabels;
      if (Array.isArray(this.lineChartData.datasets) && this.lineChartData.datasets[0]) {
        const gpaData = this.terms.map((t: any) => {
          let totalPoints = 0, totalCredits = 0;
          for (const c of t.courses) {
            if (c.credits > 0) {
              totalPoints += c.gpa * c.credits;
              totalCredits += c.credits;
            }
          }
          return totalCredits > 0 ? +(totalPoints / totalCredits).toFixed(2) : 0;
        });
        this.lineChartData.datasets[0].data = gpaData;
        // Dynamically set y-axis min/max
        const minGPA = Math.min(...gpaData);
        if (this.lineChartOptions.scales && this.lineChartOptions.scales['y']) {
          this.lineChartOptions.scales['y'].min = Math.floor(minGPA);
          this.lineChartOptions.scales['y'].max = 4;
        }
      }
    } else {
      this.lineChartLabels = [];
      this.lineChartData.labels = [];
      if (Array.isArray(this.lineChartData.datasets) && this.lineChartData.datasets[0]) {
        this.lineChartData.datasets[0].data = [];
        if (this.lineChartOptions.scales && this.lineChartOptions.scales['y']) {
          this.lineChartOptions.scales['y'].min = 0;
          this.lineChartOptions.scales['y'].max = 4;
        }
      }
    }
  }
}
