import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Inject } from '@angular/core';

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
  @Input() isCollapsed: boolean = false;
  @Output() closeSidebar = new EventEmitter<void>();
  navItems: NavItem[] = [
    { label: 'Home', key: 'home', route: '/home' },
    { label: 'Manage Grades', key: 'transcript', route: '/transcript' },
    { label: 'GPA Insights', key: 'insights', route: '/insights' },
    { label: 'GPA Simulation', key: 'simulation', route: '/simulation' },
    { label: 'AI Advisor', key: 'advisor', route: '/advisor' }
  ];

  constructor(@Inject(Router) private router: Router) {}

  getCurrentRouteKey(): string {
    const currentRoute = this.router.url;
    const found = this.navItems.find(item => currentRoute.startsWith(item.route));
    return found ? found.key : '';
  }

  goToPage(item: NavItem): void {
    this.router.navigate([item.route]);
  }

  closeSidebarClicked(): void {
    this.closeSidebar.emit();
  }

  trackByNavItem(index: number, item: NavItem) {
    return item.key;
  }
}
