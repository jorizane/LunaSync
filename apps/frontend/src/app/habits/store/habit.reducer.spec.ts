import { habitsFeature } from './habit.reducer';
import { HabitActions } from './habit.actions';

describe('habits reducer', () => {
  it('sets habits on load success', () => {
    const habits = [{ id: '1', name: 'Run', habit_date: '2026-06-01', created_at: '2026-06-01T00:00:00Z', archived_at: null }];
    const nextState = habitsFeature.reducer(undefined, HabitActions.loadHabitsSuccess({ habits }));

    expect(nextState.habits).toEqual(habits);
    expect(nextState.isLoading).toBe(false);
  });

  it('appends habit on create success', () => {
    const initialState = habitsFeature.reducer(undefined, HabitActions.loadHabitsSuccess({ habits: [] }));
    const habit = { id: '2', name: 'Read', habit_date: '2026-06-02', created_at: '2026-06-01T10:00:00Z', archived_at: null };
    const nextState = habitsFeature.reducer(initialState, HabitActions.createHabitSuccess({ habit }));

    expect(nextState.habits).toEqual([habit]);
    expect(nextState.isSaving).toBe(false);
  });
});
