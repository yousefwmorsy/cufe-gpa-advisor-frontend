
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { TopRibbonComponent } from './layout/top-ribbon/top-ribbon.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, SidebarComponent, TopRibbonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'gpa-advisor-frontend';
  showSidebar = window.innerWidth >= 768;
  isMobile = window.innerWidth < 768;
  isDesktop = window.innerWidth >= 768;

  constructor() {
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 768;
      this.isDesktop = window.innerWidth >= 768;
      if (this.isMobile) {
        this.showSidebar = false;
      } else {
        this.showSidebar = true;
      }
    });
  }
}
