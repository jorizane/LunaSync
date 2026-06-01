import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Habit {
  id: string;
  name: string;
  habit_date: string;
  created_at: string;
  archived_at: string | null;
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly habits = signal<Habit[]>([]);
  protected readonly isSaving = signal(false);
  protected readonly errorMessage = signal('');

  protected name = '';
  protected habitDate = '';

  private readonly apiBaseUrl = 'http://127.0.0.1:8000/api/habits';

  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.loadHabits();
  }

  protected saveHabit(): void {
    const trimmedName = this.name.trim();
    if (!trimmedName || !this.habitDate) {
      this.errorMessage.set('Bitte Name und Datum ausfuellen.');
      return;
    }

    this.errorMessage.set('');
    this.isSaving.set(true);

    this.http.post<Habit>(this.apiBaseUrl, { name: trimmedName, habit_date: this.habitDate }).subscribe({
      next: (createdHabit) => {
        this.habits.update((currentHabits) => [...currentHabits, createdHabit]);
        this.name = '';
        this.habitDate = '';
        this.isSaving.set(false);
      },
      error: () => {
        this.errorMessage.set('Speichern fehlgeschlagen. Bitte Backend pruefen.');
        this.isSaving.set(false);
      }
    });
  }

  private loadHabits(): void {
    this.http.get<Habit[]>(this.apiBaseUrl).subscribe({
      next: (habits) => this.habits.set(habits),
      error: () => this.errorMessage.set('Habits konnten nicht geladen werden. Läuft das Backend?')
    });
  }
}
