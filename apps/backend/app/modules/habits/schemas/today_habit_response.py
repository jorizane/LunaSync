from pydantic import BaseModel


class TodayHabitResponse(BaseModel):
    id: str
    name: str
    is_completed: bool
    current_streak: int

