from typing import Annotated
from datetime import datetime
from fastapi import Form
from pydantic import BaseModel


class Student(BaseModel):
    USN: str
    Name: str
    Batch: str
    Branch: str
    Semester: int
    Division: str
    DOB: str
    Email: str
    Mobile: str
    Data: list
    TimeTable: dict





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
