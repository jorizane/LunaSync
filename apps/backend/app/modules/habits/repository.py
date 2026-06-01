from datetime import date, datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.habits.models import Habit, HabitCompletion


class HabitRepository:
    def __init__(self, database_session: Session) -> None:
        self.database_session = database_session

    def list_active_habits(self) -> list[Habit]:
        statement = select(Habit).where(Habit.archived_at.is_(None)).order_by(Habit.created_at)
        return list(self.database_session.scalars(statement))

    def get_habit_by_id(self, habit_id: str) -> Habit | None:
        return self.database_session.get(Habit, habit_id)

    def create_habit(self, name: str, habit_date: date) -> Habit:
        habit = Habit(name=name, habit_date=habit_date)
        self.database_session.add(habit)
        self.database_session.commit()
        self.database_session.refresh(habit)
        return habit

    def update_habit_name(self, habit: Habit, name: str) -> Habit:
        habit.name = name
        self.database_session.commit()
        self.database_session.refresh(habit)
        return habit

    def archive_habit(self, habit: Habit, archived_at: datetime) -> Habit:
        habit.archived_at = archived_at
        self.database_session.commit()
        self.database_session.refresh(habit)
        return habit

    def get_completion(self, habit_id: str, completed_on: date) -> HabitCompletion | None:
        statement = select(HabitCompletion).where(
            HabitCompletion.habit_id == habit_id,
            HabitCompletion.completed_on == completed_on,
        )
        return self.database_session.scalars(statement).first()

    def list_completions_for_habit(self, habit_id: str) -> list[HabitCompletion]:
        statement = (
            select(HabitCompletion)
            .where(HabitCompletion.habit_id == habit_id)
            .order_by(HabitCompletion.completed_on.desc())
        )
        return list(self.database_session.scalars(statement))

    def create_completion(self, habit_id: str, completed_on: date) -> HabitCompletion:
        completion = HabitCompletion(habit_id=habit_id, completed_on=completed_on)
        self.database_session.add(completion)
        self.database_session.commit()
        self.database_session.refresh(completion)
        return completion

