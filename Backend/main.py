from datetime import datetime
from typing import Annotated, List, Dict, Any, Set
from bson.json_util import dumps, loads
import motor.motor_asyncio
from fastapi import FastAPI, Cookie, Header
from fastapi import status, HTTPException, Depends, Request, Response
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from jose import jwt, JWTError
from passlib.context import CryptContext
from pydantic import BaseModel
from pydantic.datetime_parse import timedelta
from starlette.middleware.cors import CORSMiddleware
from Models import StudentModel

from Schemas.Student import studententity

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins="*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = "b4d889fab58423d225c3f77edf0d51f678f04db624dec04ff4f3f19651b26b1e"

REFRESH_SECRET_KEY = "b4d889fab58423d225c3f77edf0d51f678f04db624dec04ff4f3f19651b26b1e"

ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_MINUTES = 7 * 24 * 60

ACADEMIC_YEAR = "2022-2023"

password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth_2_scheme = OAuth2PasswordBearer(tokenUrl="login")

mongodb_client = motor.motor_asyncio.AsyncIOMotorClient(
    "mongodb+srv://ankit:attendance@cluster0.iofnken.mongodb.net/test")

# this database conatains the attendance data
attendancedb = mongodb_client.Attendance_Database

# this database contains details about the classes


# this points to the collection of Students in the Database
studentsCollection = attendancedb["Students"]

# this points to the collection of Teachers in the database
teacherCollection = attendancedb["Teachers"]

# this points to the collection of classes in current academic year
classCollection = attendancedb["Class_Collection"]

adminCollection = attendancedb["Admins"]


@app.get('/')
def home():
    return {"message": "API is working"}


class Token(BaseModel):
    access_token: str
    token_type: str


def get_hashed_password(password: str) -> str:
    return password_context.hash(password)


def verify_password(password: str, hashed_pass: str) -> bool:
    return password_context.verify(password, hashed_pass)


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta is not None:
        expires_delta = datetime.utcnow() + expires_delta
    else:
        expires_delta = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expires_delta})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, ALGORITHM)
    return encoded_jwt


def create_refresh_token(data: dict, expires_delta: timedelta = None) -> str:
    to_encode = data.copy()
    if expires_delta is not None:
        expires_delta = datetime.utcnow() + expires_delta
    else:
        expires_delta = datetime.utcnow() + timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expires_delta})
    encoded_jwt = jwt.encode(to_encode, REFRESH_SECRET_KEY, ALGORITHM)
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth_2_scheme)):
    credential_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                         detail="could not validate cred", headers={"WWW-Authenticate": "Bearer"})
    payload = jwt.decode(token, options={"verify_sub": False}, key=REFRESH_SECRET_KEY, algorithms=[ALGORITHM])

    if not payload:
        raise credential_exception
    else:
        return payload["sub"]


@app.get('/refresh')
async def login_for_access_token(request: Request, response: Response):
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    refresh_token_expires = timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES)

    refresh_token: str = request.cookies.get('refresh_token')

    user = await get_current_user(refresh_token)

    access_token = create_access_token(data={"sub": user}, expires_delta=access_token_expires)
    refresh_token = create_refresh_token(data={"sub": user}, expires_delta=refresh_token_expires)

    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True)
    return {"userid": user.get("userid"), "role": user.get("role"), "access_token": access_token}


@app.get('/logout')
async def logout(response: Response):
    response.set_cookie(key="refresh_token", value="")
    return {"message": "Logged Out Successfully"}


async def authenticate_teacher(uid: str, password: str):
    user = await teacherCollection.find_one({"ID": uid}, {"ID", "Password"})

    if not user:
        return False
    if not verify_password(password, user.get("Password")):
        return False

    teacher = {
        "userid": user["ID"],
        "role": "teacher"
    }
    return teacher


async def authenticate_student(usn: str, password: str):
    user = await studentsCollection.find_one({"USN": usn.upper()}, {'USN', "Password"})

    if not user:
        return False
    if not verify_password(password, user.get("Password")):
        return False

    student = {
        "userid": user["USN"],
        "role": "student"
    }
    return student


async def authenticate_admin(userid: str, password: str):
    user = await adminCollection.find_one({"UserID": userid}, {'UserID', 'Password'})
    print(user)
    if not user:
        return False
    if not verify_password(password, user.get("Password")):
        return False

    admin = {
        "userid": user["UserID"],
        "role": "admin"
    }
    return admin


class UserModel(BaseModel):
    userid: str | None = None
    password: str | None = None
    role: str


@app.post('/login', response_model=Token)
async def login(login_info: UserModel, response: Response):
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    refresh_token_expires = timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES)
    if login_info.role.lower() == "student":
        student_user = await authenticate_student(login_info.userid, login_info.password)
        if not student_user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password",
                                headers={"WWW-Authenticate": "Bearer"})
        access_token = create_access_token(data={"sub": student_user}, expires_delta=access_token_expires)
        refresh_token = create_refresh_token(data={"sub": student_user}, expires_delta=refresh_token_expires)
        response.set_cookie(key="refresh_token", value=refresh_token, httponly=True)
        return {"access_token": access_token, "token_type": "bearer"}
    elif login_info.role.lower() == "teacher":
        teacher_user = await authenticate_teacher(login_info.userid, login_info.password)
        if not teacher_user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password",
                                headers={"WWW-Authenticate": "Bearer"})
        access_token = create_access_token(data={"sub": teacher_user}, expires_delta=access_token_expires)
        refresh_token = create_refresh_token(data={"sub": teacher_user}, expires_delta=refresh_token_expires)
        response.set_cookie(key="refresh_token", value=refresh_token, httponly=True)
        return {"access_token": access_token, "token_type": "bearer"}
    elif login_info.role.lower() == 'admin':
        admin_user = await authenticate_admin(login_info.userid, login_info.password)
        if not admin_user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password",
                                headers={"WWW-Authenticate": "Bearer"})
        access_token = create_access_token(data={"sub": admin_user}, expires_delta=access_token_expires)
        refresh_token = create_refresh_token(data={"sub": admin_user}, expires_delta=refresh_token_expires)
        response.set_cookie(key="refresh_token", value=refresh_token, httponly=True)
        return {"access_token": access_token, "token_type": "bearer"}
    else:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password",
                            headers={"WWW-Authenticate": "Bearer"})


@app.get("/students/all")
async def listofstudents():
    list = []
    students = studentsCollection.find({}).to_list(1000)
    for student in await students:
        studentDetails = {"Name": student["Name"],
                          "id": student["USN"],
                          "Branch": student["Branch"],
                          "Semester": student["Semester"],
                          "Division": student["Division"],
                          "Batch": student["Batch"]
                          }
        list.append(studentDetails)

    return list


def getClassConducted(subjectCode, semDetails) -> dict[str]:
    if semDetails:
        for sub in semDetails["Subjects"]:
            if subjectCode == sub["Code"]:
                return {"ClassDates": sub["ClassDates"],
                        "Name": sub["Name"]}
    return {"ClassDates": None, "Name": None}


@app.get("/student/{USN}", response_model=StudentModel.Student)
async def detailsOfStudent(USN):
    student = await studentsCollection.find_one({"USN": USN.upper()})
    classList = []
    for i, sem in enumerate(student["Data"]):
        classDetails = await classCollection.find_one({"Batch": student["Batch"],
                                                       "Branch": student["Branch"],
                                                       "Semester": sem["Semester"],
                                                       "Division": sem["Division"]},
                                                      {"Subjects", "TimeTable"})

        for j, subject in enumerate(sem["Subjects"]):
            subjectData = getClassConducted(subject["Code"], classDetails)
            subject["Name"] = subjectData["Name"]
            subject["ClassesConducted"] = subjectData["ClassDates"]

    return studententity(student)


def getsubjectData(subjectCode: str, classData: list):
    for sub in classData:
        if sub["Code"] == subjectCode:
            return sub
    return None


def getSubjectAttendance(subject:str, Data: list):
    Data = Data[0]
    Data = Data["Subjects"]
    for sub in Data:
        if subject==sub['Code']:
            return {"Attendance":sub["Attendance"],
                    "Detain": sub["Detain"]
                    }

    return None


@app.get("/teacher/{teacher_id}")
async def teacher(teacher_id):
    classesData = []
    teacher = await teacherCollection.find_one({"ID": teacher_id})
    for classTaught in teacher["Classes"]:
        classData = await classCollection.find_one({"Branch": teacher["Branch"],
                                                    "Semester": int(classTaught["Semester"]),
                                                    "Division": classTaught["Division"],
                                                    "Batch": classTaught["Batch"]
                                                    })
        listofSubject = []
        for subject in classTaught["Subjects"]:
            subjectData = getsubjectData(subject, classData["Subjects"])
            listofStudent = []
            for student in classData["Students"]:
                studentData = await studentsCollection.find_one({"USN": student,
                                                                 },
                                                                {"USN": 1,
                                                                 "Name": 1,
                                                                 "Data": {"$elemMatch":
                                                                              {"Semester":
                                                                                   int(classTaught["Semester"])
                                                                               }}
                                                                 }
                                       )
                subjectAttendanceData= getSubjectAttendance(subject, studentData["Data"])
                studentAttendanceData = {
                    "USN": studentData["USN"],
                    "Name": studentData["Name"],
                    "Detain": subjectAttendanceData["Detain"],
                    "Attendance": subjectAttendanceData["Attendance"]
                }
                # print(studentAttendanceData)
                listofStudent.append(studentAttendanceData)
    #
            subjectAttendanceData = {
                "Subject": subjectData["Code"],
                "Classes_conducted": subjectData["ClassDates"],
                "StudentsAttendance": listofStudent

            }
            listofSubject.append(subjectAttendanceData)
    #
        classData = {
            "Branch": teacher["Branch"],
            "Semester": classTaught["Semester"],
            "Division": classTaught["Division"],
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

    for element in classlist:
        className = f"{element['Branch']}_{element['Semester']}_{element['Division']}"
        listofclasses.append(className)

    return listofclasses


@app.get('/timetable/{ClassID}')
async def getTimeTable(ClassID):
    temp = ClassID.split("_")
    classDetails = await classCollection.find_one({"Branch": temp[0], "Semester": int(temp[1]), "Division": temp[2]})
    timetable = classDetails['TimeTable']
    return timetable


class updateTimeTableSubject(BaseModel):
    keyid: str | None = None
    subname: str | None = None


@app.put('/updatetimetable/{ClassID}')
async def getTimeTable(ClassID: str, updatetimetableSubjectEntry: updateTimeTableSubject):
    updatetimetableSubjectEntrydict = updatetimetableSubjectEntry.dict()
    print(ClassID)
    print(updatetimetableSubjectEntrydict)

    return {"message": "timetable updated"}


@app.post("/sendwarning")
def sendwarning():
    return {"message": "Post Successful"}


class DetainListModel(BaseModel):
    className: str
    subjectName: str
    listofStudents: List


@app.post('/detainStudents')
async def detainstudents(req: DetainListModel):
    request = req.dict()
    print(request)

    return {"message": "Student detained Successfully"}

# pwd = get_hashed_password("ankit1234")
# print(pwd)

# token = jwt.encode({
#   "sub": {
#     "USN": "2SD20CS017",
#     "Role": "student"
#   },
#   "exp": 1683026494
# }, SECRET_KEY, ALGORITHM)
# payload = jwt.decode(token,options={"verify_sub": False } ,key=SECRET_KEY, algorithms=[ALGORITHM])
# print(payload)
