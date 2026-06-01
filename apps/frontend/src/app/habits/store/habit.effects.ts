import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { HabitService } from '../habit.service';
import { HabitActions } from './habit.actions';
import { HabitSyncService } from '../habit-sync.service';

export const loadHabitsEffect = createEffect(
  (actions$ = inject(Actions), habitService = inject(HabitService)) =>
    actions$.pipe(
      ofType(HabitActions.loadHabits),
      switchMap(() =>
        habitService.listHabits().pipe(
          map((habits) => HabitActions.loadHabitsSuccess({ habits })),
          catchError(() => of(HabitActions.loadHabitsFailure({ errorMessage: 'Habits konnten nicht geladen werden. Laeuft das Backend?' }))),
        ),
      ),
    ),
  { functional: true },
);

export const createHabitEffect = createEffect(
  (actions$ = inject(Actions), habitService = inject(HabitService), habitSyncService = inject(HabitSyncService)) =>
    actions$.pipe(
      ofType(HabitActions.createHabit),
      switchMap(({ payload }) =>
        habitService.createHabit(payload).pipe(
          tap(() => habitSyncService.notifyHabitCreated()),
          map((habit) => HabitActions.createHabitSuccess({ habit })),
          catchError(() => of(HabitActions.createHabitFailure({ errorMessage: 'Speichern fehlgeschlagen. Bitte Backend pruefen.' }))),
        ),
      ),
    ),
  { functional: true },
);


export const syncLoadHabitsEffect = createEffect(
  (habitSyncService = inject(HabitSyncService)) =>
    habitSyncService.habitCreated$.pipe(map(() => HabitActions.loadHabits())),
  { functional: true },
);
