from datetime import date

from pydantic import BaseModel, Field


class CreateHabitRequest(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    habit_date: date
