from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "LunaSync API"
    app_env: str = "development"
    database_url: str = "postgresql+psycopg://lunasync:lunasync@localhost:5432/lunasync"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()

