from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    external_api_url: str = "https://api.example.com"
    external_api_key: str = "your_api_key"

    class Config:
        env_file = ".env"


settings = Settings()
