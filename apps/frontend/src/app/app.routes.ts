import { Routes } from '@angular/router';
import { NgrxHabitsComponent } from './views/ngrx-habits/ngrx-habits.component';
import { SignalHabitsComponent } from './views/signal-habits/signal-habits.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'ngrx' },
  { path: 'ngrx', component: NgrxHabitsComponent },
  { path: 'signals', component: SignalHabitsComponent },
];
