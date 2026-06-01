import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { HabitService } from '../habit.service';
import { HabitActions } from './habit.actions';

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
  (actions$ = inject(Actions), habitService = inject(HabitService)) =>
    actions$.pipe(
      ofType(HabitActions.createHabit),
      switchMap(({ payload }) =>
        habitService.createHabit(payload).pipe(
          map((habit) => HabitActions.createHabitSuccess({ habit })),
          catchError(() => of(HabitActions.createHabitFailure({ errorMessage: 'Speichern fehlgeschlagen. Bitte Backend pruefen.' }))),
        ),
      ),
    ),
  { functional: true },
);
