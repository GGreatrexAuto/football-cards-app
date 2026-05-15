from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    football_data_api_url: str = "https://api.football-data.org/v4"
    football_data_api_key: str = ""
    football_data_competitions: str = "PL,PD,BL1,SA,FL1"

    class Config:
        env_file = ".env"


settings = Settings()
