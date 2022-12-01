import beanie
import motor.motor_asyncio
import numpy
from beanie import Document
from pydantic import Field
import asyncio

class Student(Document):
    name : str = Field(max_length=50)
    face_encodings : numpy.ndarray = Field()



async def add_student():
    client= motor.motor_asyncio.AsyncIOMotorClient("mongodb://localhost:27017")

    await beanie.init_beanie(client.studentDetails, document_models=[Student])

    stud1 = Student(name = "ankit", face_encodings = [0.5] )
    stud2 = Student(name="amrit", face_encodings=[0.4])
    stud3 = Student(name="baibhav", face_encodings=[0.9])



    stud1.insert()
    stud2.insert()
    stud3.insert()

asyncio.run(add_student())
