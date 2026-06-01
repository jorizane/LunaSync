import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HabitSignalStore } from '../../habits/signal-store/habit-signal.store';

@Component({
  selector: 'app-signal-habits',
  imports: [FormsModule],
  templateUrl: './signal-habits.component.html',
})
export class SignalHabitsComponent implements OnInit {
  protected name = '';
  protected habitDate = '';

  constructor(protected readonly signalStore: HabitSignalStore) {}

  ngOnInit(): void {
    this.signalStore.loadHabits();
  }

  protected saveHabit(): void {
    const trimmedName = this.name.trim();
    if (!trimmedName || !this.habitDate) {
      this.signalStore.setValidationError('Bitte Name und Datum ausfuellen.');
      return;
    }

    this.signalStore.createHabit({ name: trimmedName, habit_date: this.habitDate });
    this.name = '';
    this.habitDate = '';
  }
}
