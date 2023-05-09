

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
