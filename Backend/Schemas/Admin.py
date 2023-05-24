from pydantic import BaseModel
from typing import Annotated
from fastapi import Form

class SemData(BaseModel):
    semester: int
    divlist: list[str]
    noofcoresubjects: int
    noofbranchelectives: int
    noofopenelectives: int
    nooflabs:int
    coresubjects: list
    branchelectives: list
    openelectives: list
    labs: list
    coresubjects: list

class CreateClassModel(BaseModel):
    branch: Annotated[str, Form()]
    academicyear: Annotated[int, Form()]
    semester: Annotated[str, Form()]
    division: Annotated[str, Form()]
    subjects: Annotated[list[str], Form()]
    timetable:Annotated[dict, Form()]



