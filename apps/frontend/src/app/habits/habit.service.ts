import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateHabitPayload, Habit } from './habit.model';

@Injectable({ providedIn: 'root' })
export class HabitService {
  private readonly apiBaseUrl = 'http://127.0.0.1:8000/api/habits';

  constructor(private readonly http: HttpClient) {}

  listHabits(): Observable<Habit[]> {
    return this.http.get<Habit[]>(this.apiBaseUrl);
  }

  createHabit(payload: CreateHabitPayload): Observable<Habit> {
    return this.http.post<Habit>(this.apiBaseUrl, payload);
  }
}
