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

from Route import AdminRoutes, TeacherRoutes, StudentRoutes

app = FastAPI()

app.include_router(AdminRoutes.router)
app.include_router(TeacherRoutes.router)

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

# this points to the collection of Students in the Database
studentsCollection = attendancedb["Students"]

# this points to the collection of Teachers in the database
teacherCollection = attendancedb["Teachers"]

# this points to the collection of classes in current academic year
classCollection = attendancedb["Class_Collection"]

adminCollection = attendancedb["Admins"]

branchCollection = attendancedb["Branch"]


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
    user = await studentsCollection.find_one({"_id": {"usn": usn.upper()}}, {'_id.usn', "Password"})

    if not user:
        return False
    if not verify_password(password, user.get("Password")):
        return False

    student = {
        "userid": user["_id"]["usn"],
        "role": "student"
    }
    return student


async def authenticate_admin(userid: str, password: str):
    user = await adminCollection.find_one({"UserID": userid}, {'UserID', 'Password'})
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
        studentDetails = {"id": student["_id"],
                          "Name": student["firstname"] + ' ' + student['middlename'] + ' ' +student['lastname'],
                          "Branch": student["branch"],
                          "Semester": student["semester"],
                          "Division": student["division"],
                          "Batch": student["batch"]
                          }
        list.append(studentDetails)
    return list


@app.get("/student/{USN}")
async def detailsOfStudent(USN):
    student = await studentsCollection.find_one({"_id": {"usn": USN.upper()}})
    classList = []
    for i, sem in enumerate(student["Data"]):
        classDetails = await classCollection.find_one({"_id": {
            "branch": student["Branch"],
            "semester": sem["Semester"],
            "division": sem["Division"]}},
            {"subjects", "timetable"})
        print(classDetails)
        if classDetails:
            student["TimeTable"] = classDetails["timetable"]
            for j, subject in enumerate(sem["Subjects"]):
                subjectData = getClassConducted(subject["Code"], classDetails)
                subject["ClassesConducted"] = subjectData["ClassDates"]

    return studententity(student)


@app.get('/listofclass')
async def getlistofClasses():
    listofclasses = []
    classlist = await classCollection.find({}).to_list(0)

    for element in classlist:
        className = f"{element['Branch']}_{element['Semester']}_{element['Division']}"
        listofclasses.append(className)

    return listofclasses


@app.get('/timetable/{branch}/{semester}/{division}')
async def getTimeTable(branch: str, semester: int, division: str):
    classDetails = await classCollection.find_one({
        "_id": {
            "branch": branch,
            "semester": semester,
            "division": division,
        }
    })
    timetable = classDetails['timetable']
    return timetable


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
