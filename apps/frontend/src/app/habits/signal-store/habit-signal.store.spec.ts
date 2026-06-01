import { TestBed } from '@angular/core/testing';
import { NEVER, of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { HabitService } from '../habit.service';
import { HabitSyncService } from '../habit-sync.service';
import { HabitSignalStore } from './habit-signal.store';

describe('HabitSignalStore', () => {
  let store: HabitSignalStore;

  const habitService = {
    listHabits: vi.fn(),
    createHabit: vi.fn(),
  } as unknown as HabitService;

  const habitSyncService = {
    habitCreated$: NEVER,
    notifyHabitCreated: vi.fn(),
  } as unknown as HabitSyncService;

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        HabitSignalStore,
        { provide: HabitService, useValue: habitService },
        { provide: HabitSyncService, useValue: habitSyncService },
      ],
    });

    store = TestBed.inject(HabitSignalStore);
  });

  it('loads habits successfully', () => {
    const habits = [
      { id: '1', name: 'Run', habit_date: '2026-06-02', created_at: '2026-06-02T00:00:00Z', archived_at: null },
    ];
    vi.mocked(habitService.listHabits).mockReturnValue(of(habits));

    store.loadHabits();

    expect(store.habits()).toEqual(habits);
    expect(store.errorMessage()).toBe('');
  });

  it('sets error message when loading fails', () => {
    vi.mocked(habitService.listHabits).mockReturnValue(throwError(() => new Error('fail')));

    store.loadHabits();

    expect(store.errorMessage()).toBe('Habits konnten nicht geladen werden. Laeuft das Backend?');
  });

  it('creates a habit and appends to state', () => {
    const created = {
      id: '2',
      name: 'Read',
      habit_date: '2026-06-03',
      created_at: '2026-06-02T10:00:00Z',
      archived_at: null,
    };
    vi.mocked(habitService.createHabit).mockReturnValue(of(created));

    store.createHabit({ name: 'Read', habit_date: '2026-06-03' });

    expect(store.habits()).toContainEqual(created);
    expect(store.isSaving()).toBe(false);
    expect(vi.mocked(habitSyncService.notifyHabitCreated)).toHaveBeenCalled();
  });

  it('sets error message when create fails', () => {
    vi.mocked(habitService.createHabit).mockReturnValue(throwError(() => new Error('fail')));

    store.createHabit({ name: 'Read', habit_date: '2026-06-03' });

    expect(store.errorMessage()).toBe('Speichern fehlgeschlagen. Bitte Backend pruefen.');
    expect(store.isSaving()).toBe(false);
  });

  it('sets validation error explicitly', () => {
    store.setValidationError('Bitte Name und Datum ausfuellen.');

    expect(store.errorMessage()).toBe('Bitte Name und Datum ausfuellen.');
  });
});
