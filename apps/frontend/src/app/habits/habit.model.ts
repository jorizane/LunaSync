export interface Habit {
  id: string;
  name: string;
  habit_date: string;
  created_at: string;
  archived_at: string | null;
}

export interface CreateHabitPayload {
  name: string;
  habit_date: string;
}
