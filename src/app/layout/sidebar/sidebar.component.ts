import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

interface NavItem {
  label: string;
  key: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class SidebarComponent {
  @Output() closeSidebar = new EventEmitter<void>();
  navItems: NavItem[] = [
    { label: 'Home', key: 'home', route: '/home' },
    { label: 'Manage Grades', key: 'transcript', route: '/transcript' },
    { label: 'GPA Insights', key: 'insights', route: '/insights' },
    { label: 'GPA Simulation', key: 'simulation', route: '/simulation' },
    { label: 'AI Advisor', key: 'advisor', route: '/advisor' }
  ];

  currentPage: string = 'home';

  constructor(private router: Router) {}

  goToPage(item: NavItem): void {
    this.currentPage = item.key;
    this.router.navigate([item.route]);
  }
}
