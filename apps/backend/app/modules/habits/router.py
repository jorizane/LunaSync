from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_database_session
from app.modules.habits.repository import HabitRepository
from app.modules.habits.schemas import (
    CompleteHabitRequest,
    CreateHabitRequest,
    HabitCompletionResponse,
    HabitResponse,
    TodayHabitResponse,
    UpdateHabitRequest,
)
from app.modules.habits.service import HabitService
from app.shared.date_utils import get_current_utc_date

router = APIRouter(prefix="/habits", tags=["habits"])
DatabaseSession = Annotated[Session, Depends(get_database_session)]


def get_habit_service(database_session: DatabaseSession) -> HabitService:
    habit_repository = HabitRepository(database_session)
    return HabitService(habit_repository)


HabitServiceDependency = Annotated[HabitService, Depends(get_habit_service)]


@router.get("", response_model=list[HabitResponse])
def list_habits(habit_service: HabitServiceDependency):
    return habit_service.list_active_habits()


@router.post("", response_model=HabitResponse, status_code=201)
def create_habit(request: CreateHabitRequest, habit_service: HabitServiceDependency):
    return habit_service.create_habit(request.name)


@router.get("/today", response_model=list[TodayHabitResponse])
def list_today_habits(habit_service: HabitServiceDependency):
    return habit_service.list_today_habits(get_current_utc_date())


@router.put("/{habit_id}", response_model=HabitResponse)
def update_habit(
    habit_id: str,
    request: UpdateHabitRequest,
    habit_service: HabitServiceDependency,
):
    return habit_service.update_habit(habit_id, request.name)


@router.delete("/{habit_id}", response_model=HabitResponse)
def archive_habit(habit_id: str, habit_service: HabitServiceDependency):
    return habit_service.archive_habit(habit_id)


@router.post("/{habit_id}/completions", response_model=HabitCompletionResponse, status_code=201)
def complete_habit(
    habit_id: str,
    request: CompleteHabitRequest,
    habit_service: HabitServiceDependency,
):
    return habit_service.complete_habit(habit_id, request.completed_on)
