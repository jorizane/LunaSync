# LunaSync Backend

FastAPI backend for LunaSync.

## Development

Install the backend dependencies from `apps/backend`:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
```

Run the API from `apps/backend` (uses local SQLite by default):

```bash
uvicorn app.main:app --reload
```

Available starter endpoints:

- `GET /health`
- `GET /api/habits`
- `POST /api/habits`
- `GET /api/habits/today`
- `PUT /api/habits/{habit_id}`
- `DELETE /api/habits/{habit_id}`
- `POST /api/habits/{habit_id}/completions`

The first API module is `habits`. It is split into small files for models, schemas,
repository access, service logic, routing, and utilities.

Use PostgreSQL instead (optional):

```bash
cp .env.example .env
# set DATABASE_URL to postgresql+psycopg://lunasync:lunasync@localhost:5432/lunasync
cd ../..
docker compose up -d database
cd apps/backend
```
