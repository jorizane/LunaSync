import { Injectable, computed, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HabitService } from '../habit.service';
import { CreateHabitPayload, Habit } from '../habit.model';
import { HabitSyncService } from '../habit-sync.service';

@Injectable({ providedIn: 'root' })
export class HabitSignalStore {
  private readonly _habits = signal<Habit[]>([]);
  private readonly _isSaving = signal(false);
  private readonly _errorMessage = signal('');

  readonly habits = computed(() => this._habits());
  readonly isSaving = computed(() => this._isSaving());
  readonly errorMessage = computed(() => this._errorMessage());

  constructor(
    private readonly habitService: HabitService,
    private readonly habitSyncService: HabitSyncService,
  ) {
    this.habitSyncService.habitCreated$
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.loadHabits());
  }

  loadHabits(): void {
    this._errorMessage.set('');
    this.habitService.listHabits().subscribe({
      next: (habits) => this._habits.set(habits),
      error: () => this._errorMessage.set('Habits konnten nicht geladen werden. Laeuft das Backend?'),
    });
  }

  createHabit(payload: CreateHabitPayload): void {
    this._errorMessage.set('');
    this._isSaving.set(true);

    this.habitService.createHabit(payload).subscribe({
      next: (habit) => {
        this._habits.update((currentHabits) => [...currentHabits, habit]);
        this._isSaving.set(false);
        this.habitSyncService.notifyHabitCreated();
      },
      error: () => {
        this._errorMessage.set('Speichern fehlgeschlagen. Bitte Backend pruefen.');
        this._isSaving.set(false);
        this.habitSyncService.notifyHabitCreated();
      },
    });
  }

  setValidationError(message: string): void {
    this._errorMessage.set(message);
  }
}
