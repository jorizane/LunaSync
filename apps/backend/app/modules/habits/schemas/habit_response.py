from datetime import date, datetime

from pydantic import BaseModel, ConfigDict


class HabitResponse(BaseModel):
    id: str
    name: str
    habit_date: date
    created_at: datetime
    archived_at: datetime | None

    model_config = ConfigDict(from_attributes=True)

