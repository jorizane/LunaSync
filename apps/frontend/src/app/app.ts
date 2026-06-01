import { Component } from '@angular/core';
import { NgrxHabitsComponent } from './views/ngrx-habits/ngrx-habits.component';
import { SignalHabitsComponent } from './views/signal-habits/signal-habits.component';

@Component({
  selector: 'app-root',
  imports: [NgrxHabitsComponent, SignalHabitsComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
