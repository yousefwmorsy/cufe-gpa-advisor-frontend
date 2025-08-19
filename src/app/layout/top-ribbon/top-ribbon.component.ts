import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-top-ribbon',
  templateUrl: './top-ribbon.component.html',
  styleUrls: ['./top-ribbon.component.scss']
})
export class TopRibbonComponent {
  pageTitle = '';
  private titles: { [key: string]: string } = {
    '/home': 'Home',
    '/transcript': 'Manage Grades (Transcript)',
    '/insights': 'GPA Insights',
    '/simulation': 'GPA Simulation',
    '/advisor': 'AI Advisor'
  };

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects.split('?')[0];
        this.pageTitle = this.titles[url] || 'GPA Advisor';
      }
    });
  }
}
