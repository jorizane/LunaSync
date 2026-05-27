from datetime import date

from pydantic import BaseModel


class CompleteHabitRequest(BaseModel):
    completed_on: date

