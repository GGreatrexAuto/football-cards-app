from pydantic import BaseModel


class Club(BaseModel):
    id: int
    name: str
    league_id: int
    league_name: str


class Nation(BaseModel):
    id: int
    name: str
    country_code: str | None = None


class League(BaseModel):
    id: int
    name: str


class Position(BaseModel):
    code: str
    name: str
