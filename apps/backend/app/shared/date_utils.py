from datetime import UTC, date, datetime


def get_current_utc_datetime() -> datetime:
    return datetime.now(UTC)


def get_current_utc_date() -> date:
    return get_current_utc_datetime().date()

