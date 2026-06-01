import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { HabitService } from './habit.service';

describe('HabitService', () => {
  let service: HabitService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HabitService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(HabitService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('loads habits', () => {
    const mockHabits = [{ id: '1', name: 'Run', habit_date: '2026-06-01', created_at: '2026-06-01T00:00:00Z', archived_at: null }];

    service.listHabits().subscribe((habits) => {
      expect(habits).toEqual(mockHabits);
    });

    const req = httpMock.expectOne('http://127.0.0.1:8000/api/habits');
    expect(req.request.method).toBe('GET');
    req.flush(mockHabits);
  });

  it('creates a habit', () => {
    const payload = { name: 'Read', habit_date: '2026-06-02' };
    const created = { id: '2', ...payload, created_at: '2026-06-01T10:00:00Z', archived_at: null };

    service.createHabit(payload).subscribe((habit) => {
      expect(habit).toEqual(created);
    });

    const req = httpMock.expectOne('http://127.0.0.1:8000/api/habits');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(created);
  });
});
