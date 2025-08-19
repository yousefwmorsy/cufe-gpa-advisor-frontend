import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { TranscriptComponent } from './pages/transcript/transcript.component';
import { InsightsComponent } from './pages/insights/insights.component';
import { SimulationComponent } from './pages/simulation/simulation.component';
import { AdvisorComponent } from './pages/advisor/advisor.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'transcript', component: TranscriptComponent },
  { path: 'insights', component: InsightsComponent },
  { path: 'simulation', component: SimulationComponent },
  { path: 'advisor', component: AdvisorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
