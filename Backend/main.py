from typing import List

from fastapi import FastAPI
from pydantic import BaseModel, Field, EmailStr
import motor.motor_asyncio
from starlette.middleware.cors import CORSMiddleware

ACADEMIC_YEAR = "2022-2023"

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

mongodb_client = motor.motor_asyncio.AsyncIOMotorClient(
    "mongodb+srv://ankit:attendance@cluster0.iofnken.mongodb.net/test")
# this database conatains the attendance data
attendancedb = mongodb_client.Attendance_Database

# this database contains details about the classes
ClassDb = mongodb_client.Class_Database


# this points to the collection of Students in the Database
studentsCollection = attendancedb["Students"]

# this points to the collection of Teachers in the database
teacherCollection = attendancedb["Teachers"]

# this points to the collection of classes in current academic year
classCollection = ClassDb[ACADEMIC_YEAR]


@app.get('/')
def home():
    return {"message": "API is working"}

@app.get("/student/{USN}")
async def detailsOfStudent(USN):
    student = await studentsCollection.find_one({"USN": USN})
    className = f'{student["Branch"]}_{student["Sem"]}_{student["Div"]}'
    # this line finds the record for the class of the student
    classDetails = await classCollection.find_one(
        {"Branch": f'{student["Branch"]}', "Semester": int(f'{student["Sem"]}'), "Division": f'{student["Div"]}'})
    courses = classDetails["Courses_available"]
    AttendanceDetails = []
    for course in courses:
        attendance = {
            "Subject_Name": classDetails[f"{course}"]["Course_abbrv"],
            "Classes_conducted": classDetails[f"{course}"]["Classes_conducted"],
            "Attendance": student[f"Sem_{student['Sem']}"][f"{course}_attendance"]
        }
        AttendanceDetails.append(attendance)
    studentDetails = {"Name": student["Name"],
                      "USN": student["USN"],
                      "Class": className,
                      "Branch": student["Branch"],
                      "Semester": student["Sem"],
                      "Division": student["Div"],
                      "AttendanceData": AttendanceDetails
                      }
    return studentDetails


@app.get("/teacher/{teacher_id}")
async def teacher(teacher_id):
    classesData = []
    teacher = await teacherCollection.find_one({"ID": teacher_id})
    branch = teacher["Branch"]
    for classTaught in teacher["Classes"]:
        Semester = classTaught["Semester"]
        Division = classTaught["Division"]
        classData = await classCollection.find_one({"Branch": branch, "Semester": Semester, "Division": Division})
        listofSubject = []
        for subject in classTaught["Course"]:

            subjectData = classData[f"{subject}"]
            listofStudent = []
            for student in classData["Students"]:
                studentData = await studentsCollection.find_one({"USN": student})

                studentAttendanceData = {
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


@app.get('/listofclass')
async def getlistofClasses():
    listofclasses = []
    classlist = await classCollection.find({}).to_list(1000)

    for  element in classlist:
        className = f"{element['Branch']}_{element['Semester']}_{element['Division']}"
        listofclasses.append(className)

    return listofclasses


@app.get('/timetable/{ClassID}')
async def getTimeTable(ClassID):

    temp = ClassID.split("_");
    classDetails = await classCollection.find_one({"Branch": temp[0],"Semester":int(temp[1]),"Division":temp[2]})
    timetable = classDetails['TimeTable']
    return timetable

@app.post('/updatetimetable/{ClassID}')
async def getTimeTable(ClassID):

        return {"message": "timetable updated"}
@app.post("/sendwarning")
def sendWarning():

    return {"message": "Post Successful"}