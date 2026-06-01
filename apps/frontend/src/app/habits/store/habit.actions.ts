import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CreateHabitPayload, Habit } from '../habit.model';

export const HabitActions = createActionGroup({
  source: 'Habits',
  events: {
    'Load Habits': emptyProps(),
    'Load Habits Success': props<{ habits: Habit[] }>(),
    'Load Habits Failure': props<{ errorMessage: string }>(),
    'Create Habit': props<{ payload: CreateHabitPayload }>(),
    'Create Habit Success': props<{ habit: Habit }>(),
    'Create Habit Failure': props<{ errorMessage: string }>(),
    'Clear Error': emptyProps(),
  },
});
