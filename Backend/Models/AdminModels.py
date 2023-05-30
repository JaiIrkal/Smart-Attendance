
from pydantic import BaseModel
from typing import Annotated
from fastapi import Form
from datetime import datetime





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
    coresubjects: Annotated[list[str], Form()]
    branchelectives: Annotated[list[str], Form()]
    openelectives: Annotated[list[str], Form()]
    academicyear: Annotated[str, Form()]
    parentsmobile: Annotated[str, Form()]
    parentsemail: Annotated[str, Form()]


class AddTeacherModel(BaseModel):
    id : Annotated[str, Form()]
    firstname: Annotated[str, Form()]
    middlename: Annotated[str, Form()]
    lastname: Annotated[str, Form()]
    dob: datetime = None
    designation: Annotated[str, Form()]
    department: Annotated[str, Form()]
    mobile: Annotated[str, Form()]
    email: Annotated[str, Form()]