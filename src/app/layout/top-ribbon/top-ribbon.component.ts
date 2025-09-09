import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-top-ribbon',
  templateUrl: './top-ribbon.component.html',
  styleUrls: ['./top-ribbon.component.scss']
  ,imports: [CommonModule]
})
export class TopRibbonComponent {
  pageTitle = '';
  showBurgerMenu = false;
  @Output() burgerMenuClicked = new EventEmitter<void>();
  private titles: { [key: string]: string } = {
    '/home': 'Home',
    '/transcript': 'Manage Grades (Transcript)',
    '/insights': 'GPA Insights',
    '/simulation': 'GPA Simulation',
    '/advisor': 'AI Advisor'
  };

  constructor(@Inject(Router) private router: Router) {
  this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects.split('?')[0];
        this.pageTitle = this.titles[url] || 'GPA Advisor';
      }
    });
    // Show burger menu on mobile only
    this.showBurgerMenu = window.innerWidth <= 768;
    window.addEventListener('resize', () => {
      this.showBurgerMenu = window.innerWidth <= 768;
    });
  }

  burgerMenuClick() {
    this.burgerMenuClicked.emit();
  }
  }
