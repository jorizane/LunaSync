from datetime import datetime

from pydantic import BaseModel, ConfigDict


class HabitResponse(BaseModel):
    id: str
    name: str
    created_at: datetime
    archived_at: datetime | None

    model_config = ConfigDict(from_attributes=True)

