from pydantic import BaseModel


class Club(BaseModel):
    id: int
    name: str
    league_id: int


class Nation(BaseModel):
    id: int
    name: str


class League(BaseModel):
    id: int
    name: str


class Position(BaseModel):
    code: str
    name: str
