from datetime import date, timedelta

from fastapi import HTTPException, status

from app.modules.habits.models import Habit, HabitCompletion
from app.modules.habits.repository import HabitRepository
from app.modules.habits.schemas import TodayHabitResponse
from app.modules.habits.utils import normalize_habit_name
from app.shared.date_utils import get_current_utc_datetime


class HabitService:
    def __init__(self, habit_repository: HabitRepository) -> None:
        self.habit_repository = habit_repository

    def list_active_habits(self) -> list[Habit]:
        return self.habit_repository.list_active_habits()

    def list_today_habits(self, today: date) -> list[TodayHabitResponse]:
        habits = self.habit_repository.list_active_habits()
        return [self._build_today_habit_response(habit, today) for habit in habits]

    def create_habit(self, name: str, habit_date: date) -> Habit:
        normalized_name = normalize_habit_name(name)
        if not normalized_name:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Habit name must not be empty.",
            )

        return self.habit_repository.create_habit(normalized_name, habit_date)

    def update_habit(self, habit_id: str, name: str) -> Habit:
        habit = self._get_active_habit_or_raise(habit_id)
        normalized_name = normalize_habit_name(name)
        if not normalized_name:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Habit name must not be empty.",
            )

        return self.habit_repository.update_habit_name(habit, normalized_name)

    def archive_habit(self, habit_id: str) -> Habit:
        habit = self._get_active_habit_or_raise(habit_id)
        return self.habit_repository.archive_habit(habit, get_current_utc_datetime())

    def complete_habit(self, habit_id: str, completed_on: date) -> HabitCompletion:
        self._get_active_habit_or_raise(habit_id)

        existing_completion = self.habit_repository.get_completion(habit_id, completed_on)
        if existing_completion is not None:
            return existing_completion

        return self.habit_repository.create_completion(habit_id, completed_on)

    def _get_active_habit_or_raise(self, habit_id: str) -> Habit:
        habit = self.habit_repository.get_habit_by_id(habit_id)
        if habit is None or habit.archived_at is not None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Habit not found.")

        return habit

    def _build_today_habit_response(self, habit: Habit, today: date) -> TodayHabitResponse:
        completed_dates = self._get_completed_dates(habit.id)
        return TodayHabitResponse(
            id=habit.id,
            name=habit.name,
            is_completed=today in completed_dates,
            current_streak=calculate_current_streak(completed_dates, today),
        )

    def _get_completed_dates(self, habit_id: str) -> set[date]:
        completions = self.habit_repository.list_completions_for_habit(habit_id)
        return {completion.completed_on for completion in completions}


def calculate_current_streak(completed_dates: set[date], today: date) -> int:
    current_day = today
    streak = 0

    while current_day in completed_dates:
        streak += 1
        current_day -= timedelta(days=1)

    return streak

