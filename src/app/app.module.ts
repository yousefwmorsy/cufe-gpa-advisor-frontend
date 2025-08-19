import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { TopRibbonComponent } from './layout/top-ribbon/top-ribbon.component';
import { HomeComponent } from './pages/home/home.component';
import { TranscriptComponent } from './pages/transcript/transcript.component';
import { InsightsComponent } from './pages/insights/insights.component';
import { SimulationComponent } from './pages/simulation/simulation.component';
import { AdvisorComponent } from './pages/advisor/advisor.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    TopRibbonComponent,
    HomeComponent,
    TranscriptComponent,
    InsightsComponent,
    SimulationComponent,
    AdvisorComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule,
    HttpClientModule,
    FormsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
