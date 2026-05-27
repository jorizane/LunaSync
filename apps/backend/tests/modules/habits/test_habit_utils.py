from app.modules.habits.utils import normalize_habit_name


def test_normalizes_extra_spaces_from_habit_name() -> None:
    assert normalize_habit_name("  Drink   water  ") == "Drink water"

