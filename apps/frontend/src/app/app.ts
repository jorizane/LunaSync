import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { HabitActions } from './habits/store/habit.actions';
import { selectErrorMessage, selectHabits, selectIsSaving } from './habits/store/habit.selectors';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly habits$;
  protected readonly isSaving$;
  protected readonly errorMessage$;

  protected name = '';
  protected habitDate = '';

  private readonly store = inject(Store);

  constructor() {
    this.habits$ = this.store.select(selectHabits);
    this.isSaving$ = this.store.select(selectIsSaving);
    this.errorMessage$ = this.store.select(selectErrorMessage);
  }

  ngOnInit(): void {
    this.store.dispatch(HabitActions.loadHabits());
  }

  protected saveHabit(): void {
    const trimmedName = this.name.trim();
    if (!trimmedName || !this.habitDate) {
      this.store.dispatch(HabitActions.createHabitFailure({ errorMessage: 'Bitte Name und Datum ausfuellen.' }));
      return;
    }

    this.store.dispatch(HabitActions.clearError());
    this.store.dispatch(
      HabitActions.createHabit({
        payload: { name: trimmedName, habit_date: this.habitDate },
      }),
    );

    this.name = '';
    this.habitDate = '';
  }
}
