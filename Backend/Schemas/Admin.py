from pydantic import BaseModel

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
    branch: str
    semester: int
    division: str


