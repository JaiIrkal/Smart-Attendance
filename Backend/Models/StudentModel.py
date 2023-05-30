from typing import Annotated
from datetime import datetime
from fastapi import Form
from pydantic import BaseModel


class Student(BaseModel):
    usn: str
    firstname: str
    middlename: str
    lastname:str
    batch: str
    branch: str
    semester: int
    division: str
    dob: str
    email: str
    mobile: str
    parentsmobile:str
    parentsemail: str
    data: list
    timetable: dict





class StudentBasicDetailModel(BaseModel):
    usn: str
    firstname: str
    middlename: str
    lastname:str
    dob: datetime
    mobile: str
    email: str
    parentsmobile : str
    parentsemail:str
