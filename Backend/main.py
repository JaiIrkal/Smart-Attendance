from fastapi import FastAPI
import pymongo
import json

from pydantic import BaseModel, Field, EmailStr
from bson import ObjectId
from typing import Optional, List
import motor.motor_asyncio

ACADEMIC_YEAR = "2022-2023"

app = FastAPI()

mongodb_client = motor.motor_asyncio.AsyncIOMotorClient("mongodb+srv://ankit:attendance@cluster0.iofnken.mongodb.net/test")
#this database conatains the attendance data
attendancedb = mongodb_client.Attendance_Database

# this database contains details about the classes
ClassDb  = mongodb_client.Class_Database

#this database contains details about the timetable of classes
TimeTableDb = mongodb_client.timetable

#this points to the collection of Students in the Database
studentsCollection = attendancedb["Students"]

#this points to the collection of Teachers in the database
teacherCollection = attendancedb["Teachers"]

#this points to the collection of classes in current academic year
classCollection = ClassDb[ACADEMIC_YEAR]



@app.get("/student/{USN}")
async def detailsOfStudent(USN):
    student = await studentsCollection.find_one({"USN" : USN})
    className = f'{student["Branch"]}_{student["Sem"]}_{student["Div"]}'

    # this line finds the record for the class of the student
    classDetails = await classCollection.find_one({"Branch_abbr":f'{student["Branch"]}', "Semester":int(f'{student["Sem"]}'),"Division" : f'{student["Div"]}'})
    courses = classDetails["Courses_available"]

    AttendanceDetails = []
    for course in courses:
        attendance= {
            "Subject_Name" : classDetails[f"{course}"]["Course_abbrv"],
            "Classes_conducted": classDetails[f"{course}"]["Classes_conducted"],
            "Attendance": student[f"Sem_{student['Sem']}"][f"{course}_attendance"]
        }
        AttendanceDetails.append(attendance)

    studentDetails = {"Name": student["Name"],
                      "USN": student["USN"],
                    "Class": className,
                    "AttendanceData": AttendanceDetails
                      }
    return studentDetails


@app.get("/teacher/{teacher_id}")
async def teacher(teacher_id):

    classesData = []
    teacher = await teacherCollection.find_one({"ID": teacher_id})
    branch = teacher["Branch"]
    for classTaught in teacher["Classes"]:
        Semester  = classTaught["Semester"]
        Division = classTaught["Division"]
        classData = await classCollection.find_one({"Branch": branch, "Semester": Semester, "Division": Division})
        listofSubject = []
        for subject in classTaught["Course"]:

            subjectData = classData[f"{subject}"]
            listofStudent = []
            for student in classData["Students"]:
                studentData = await studentsCollection.find_one({"USN": student})

                studentAttendanceData= {
                    "USN": student,
                    "Name": studentData["Name"],
                    "Attendance": studentData[f"Sem_{Semester}"][f"{subject}_attendance"]
                }
                listofStudent.append(studentAttendanceData)

            subjectAttendanceData = {
                "Course": subjectData["Course_abbrv"],
                "Classes_conducted": subjectData["Classes_conducted"],
                "StudentsAttendance": listofStudent

            }
            listofSubject.append(subjectAttendanceData)

        classData = {
            "Name": f"{branch}_{Semester}_{Division}",
            "Attendance": listofSubject
        }
        classesData.append(classData)

    teacherData = {
        "Name": teacher["Name"],
        "Classes": classesData,
    }

    return teacherData


