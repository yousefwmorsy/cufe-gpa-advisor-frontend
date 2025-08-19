
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { TopRibbonComponent } from './layout/top-ribbon/top-ribbon.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, TopRibbonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'gpa-advisor-frontend';
}
