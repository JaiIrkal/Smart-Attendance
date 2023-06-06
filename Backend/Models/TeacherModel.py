from typing import List

from pydantic import BaseModel


class StudentListModel(BaseModel):
    subjectName: str
    listofStudents: List
