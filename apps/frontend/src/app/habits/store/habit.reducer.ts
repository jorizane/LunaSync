import { createFeature, createReducer, on } from '@ngrx/store';
import { Habit } from '../habit.model';
import { HabitActions } from './habit.actions';

export interface HabitState {
  habits: Habit[];
  isLoading: boolean;
  isSaving: boolean;
  errorMessage: string;
}

const initialState: HabitState = {
  habits: [],
  isLoading: false,
  isSaving: false,
  errorMessage: '',
};

export const habitsFeature = createFeature({
  name: 'habits',
  reducer: createReducer(
    initialState,
    on(HabitActions.loadHabits, (state) => ({ ...state, isLoading: true, errorMessage: '' })),
    on(HabitActions.loadHabitsSuccess, (state, { habits }) => ({ ...state, habits, isLoading: false })),
    on(HabitActions.loadHabitsFailure, (state, { errorMessage }) => ({ ...state, isLoading: false, errorMessage })),
    on(HabitActions.createHabit, (state) => ({ ...state, isSaving: true, errorMessage: '' })),
    on(HabitActions.createHabitSuccess, (state, { habit }) => ({
      ...state,
      habits: [...state.habits, habit],
      isSaving: false,
    })),
    on(HabitActions.createHabitFailure, (state, { errorMessage }) => ({ ...state, isSaving: false, errorMessage })),
    on(HabitActions.clearError, (state) => ({ ...state, errorMessage: '' })),
  ),
});
