from pydantic import BaseModel


class Club(BaseModel):
    id: str
    name: str


class Nation(BaseModel):
    id: str
    name: str


class League(BaseModel):
    id: str
    name: str
