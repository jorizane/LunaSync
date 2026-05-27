from datetime import date, datetime

from pydantic import BaseModel, ConfigDict


class HabitCompletionResponse(BaseModel):
    id: str
    habit_id: str
    completed_on: date
    completed_at: datetime

    model_config = ConfigDict(from_attributes=True)

