from __future__ import annotations

from datetime import date, datetime
from typing import TYPE_CHECKING
from uuid import uuid4

from sqlalchemy import Date, DateTime, ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.shared.date_utils import get_current_utc_datetime

if TYPE_CHECKING:
    from app.modules.habits.models.habit import Habit


class HabitCompletion(Base):
    __tablename__ = "habit_completions"
    __table_args__ = (UniqueConstraint("habit_id", "completed_on", name="uq_habit_completion_day"),)

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    habit_id: Mapped[str] = mapped_column(ForeignKey("habits.id"), nullable=False)
    completed_on: Mapped[date] = mapped_column(Date, nullable=False)
    completed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=get_current_utc_datetime,
        nullable=False,
    )

    habit: Mapped[Habit] = relationship(back_populates="completions")
