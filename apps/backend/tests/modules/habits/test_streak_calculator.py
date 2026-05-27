from datetime import date

from app.modules.habits.service import calculate_current_streak


def test_calculates_current_streak_for_consecutive_days() -> None:
    today = date(2026, 5, 27)
    completed_dates = {
        date(2026, 5, 25),
        date(2026, 5, 26),
        date(2026, 5, 27),
    }

    assert calculate_current_streak(completed_dates, today) == 3


def test_returns_zero_when_today_is_not_completed() -> None:
    today = date(2026, 5, 27)
    completed_dates = {date(2026, 5, 26)}

    assert calculate_current_streak(completed_dates, today) == 0

