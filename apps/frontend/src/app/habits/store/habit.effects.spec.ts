import { TestBed } from '@angular/core/testing';
import { Action } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { vi } from 'vitest';

import { HabitService } from '../habit.service';
import { HabitActions } from './habit.actions';
import { createHabitEffect, loadHabitsEffect } from './habit.effects';

describe('habit effects', () => {
  let actions$: Observable<Action>;
  const habitService = {
    listHabits: vi.fn(),
    createHabit: vi.fn(),
  } as unknown as HabitService;

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        provideMockActions(() => actions$),
        { provide: HabitService, useValue: habitService },
      ],
    });
  });

  it('loadHabitsEffect emits success', async () => {
    const habits = [{ id: '1', name: 'Run', habit_date: '2026-06-01', created_at: '2026-06-01T00:00:00Z', archived_at: null }];
    actions$ = of(HabitActions.loadHabits());
    vi.mocked(habitService.listHabits).mockReturnValue(of(habits));

    const action = await firstValueFrom(TestBed.runInInjectionContext(() => loadHabitsEffect()));
    expect(action).toEqual(HabitActions.loadHabitsSuccess({ habits }));
  });

  it('loadHabitsEffect emits failure', async () => {
    actions$ = of(HabitActions.loadHabits());
    vi.mocked(habitService.listHabits).mockReturnValue(throwError(() => new Error('fail')));

    const action = await firstValueFrom(TestBed.runInInjectionContext(() => loadHabitsEffect()));
    expect(action).toEqual(
      HabitActions.loadHabitsFailure({ errorMessage: 'Habits konnten nicht geladen werden. Laeuft das Backend?' }),
    );
  });

  it('createHabitEffect emits success', async () => {
    const payload = { name: 'Read', habit_date: '2026-06-02' };
    const habit = { id: '2', ...payload, created_at: '2026-06-01T10:00:00Z', archived_at: null };
    actions$ = of(HabitActions.createHabit({ payload }));
    vi.mocked(habitService.createHabit).mockReturnValue(of(habit));

    const action = await firstValueFrom(TestBed.runInInjectionContext(() => createHabitEffect()));
    expect(action).toEqual(HabitActions.createHabitSuccess({ habit }));
  });

  it('createHabitEffect emits failure', async () => {
    const payload = { name: 'Read', habit_date: '2026-06-02' };
    actions$ = of(HabitActions.createHabit({ payload }));
    vi.mocked(habitService.createHabit).mockReturnValue(throwError(() => new Error('fail')));

    const action = await firstValueFrom(TestBed.runInInjectionContext(() => createHabitEffect()));
    expect(action).toEqual(
      HabitActions.createHabitFailure({ errorMessage: 'Speichern fehlgeschlagen. Bitte Backend pruefen.' }),
    );
  });
});
