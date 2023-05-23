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


class AddStudentModel(BaseModel):
    usn: Annotated[str, Form()]
    firstname: Annotated[str, Form()]
    middlename: Annotated[str, Form()]
    lastname: Annotated[str, Form()]
    branch: Annotated[str, Form()]
    dob: datetime = None
    semester: Annotated[str, Form()]
    division: Annotated[str, Form()]
    photo: Annotated[str, Form()]
    mobile: Annotated[str, Form()]
    email: Annotated[str, Form()]
    parentmobile: Annotated[str, Form()]
    parentemail: Annotated[str, Form()]


class StudentBasicDetailModel(BaseModel):
    usn: str
    firstname: str
    middlename: str
    lastname:str
    dob: str
    mobile: str
    email: str
    parentsmobile : str
    parentsemail:str
