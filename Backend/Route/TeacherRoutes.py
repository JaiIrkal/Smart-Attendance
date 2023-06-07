from pydantic import BaseModel
from starlette import status

from deps import teacherCollection, classCollection, studentsCollection
from fastapi import APIRouter, Form, File, UploadFile
import pywhatkit

from mailing import sendwarningMail, sendextraclass
from Models.TeacherModel import StudentListModel

router = APIRouter(prefix='/teacher',
                   tags=['teacher'])


def getsubjectData(subjectCode: str, classData: list):
    for sub in classData:
        if sub["code"] == subjectCode:
            return sub
    return None


def getSubjectAttendance(subject: str, Data: list):
    Data = Data[0]
    Data = Data["subjects"]
    for sub in Data:
        if subject == sub['subject_code']:
            return {"Attendance": sub["attendance"],
                    "Detain": sub["isdetained"]
                    }
    return None


def getClassConducted(subjectCode, semDetails) -> dict[str]:
    if semDetails:
        for sub in semDetails["subjects"]:
            if subjectCode == sub["subject_code"]:
                return {"ClassDates": sub["ClassDates"]}
    return {"ClassDates": None}


@router.get("/{teacher_id}")
async def teacher(teacher_id):
    classesData = []
    teacher = await teacherCollection.find_one({"ID": teacher_id})
    for classTaught in teacher["Classes"]:
        classData = await classCollection.find_one({"_id": {"branch": teacher["Branch"],
                                                            "semester": int(classTaught["Semester"]),
                                                            "division": classTaught["Division"]}})

        listofSubject = []
        for subject in classTaught["Subjects"]:
            subjectData = getsubjectData(subject, classData["subjects"])
            listofStudent = []
            for student in classData["students"]:
                studentData = await studentsCollection.find_one({
                    "_id": student.upper()
                },
                    {"_id": 1, "firstname": 1,
                     "data": {"$elemMatch":
                                  {"semester":
                                       int(classTaught["Semester"])
                                   }}
                     }
                )
                print(student, studentData)
                subjectAttendanceData = getSubjectAttendance(subject, studentData["data"])
                studentAttendanceData = {
                    "USN": studentData["_id"],
                    "Name": studentData["firstname"],
                    "Detain": subjectAttendanceData["Detain"],
                    "Attendance": subjectAttendanceData["Attendance"]
                }
                listofStudent.append(studentAttendanceData)

            subjectAttendanceData = {
                "Subject": subjectData["code"],
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
        "Name": teacher["title"] + " " + teacher['firstname'] + ' ' + teacher['middlename'] + ' ' + teacher['lastname'],
        'Email': teacher['email'],
        'Mobile': teacher['mobile'],
        "Classes": classesData,
    }
    return teacherData


@router.post('/sendwarning', status_code=status.HTTP_200_OK)
async def sendwarning(req: StudentListModel):
    await sendwarningMail(req.listofStudents, req.subjectName)
    return {"message": "Warning sent to students"}


class ScheduleClassModel(BaseModel):
    branch: str
    semester: int
    division: str
    sub: str
    day: int
    period: int


@router.post('/schedule', status_code=status.HTTP_200_OK)
async def scheduleclass(req: ScheduleClassModel):
    day = ''
    time = ''

    await classCollection.find_one_and_update({"_id": {"branch": req.branch,
                                                       "semester": req.semester,
                                                       "division": req.division}}, {
                                                  "$push": {
                                                      'timetable.extra': {
                                                          'key': f'Day_{req.day}.P_{req.period}',
                                                          'sub': req.sub
                                                      }
                                                  }
                                              })
    c = await classCollection.find_one({"_id": {"branch": req.branch,
                                                "semester": req.semester,
                                                "division": req.division}}, {'students'})
    if req.day == 1:
        day = 'Monday'
    elif req.day == 2:
        day = 'Tuesday'
    elif req.day == 3:
        day = 'Wednesday'
    elif req.day == 4:
        day = 'Thursday'
    elif req.day == 5:
        day = 'Friday'
    elif req.day == 6:
        day = 'Saturday'

    if req.period == 1:
        time = '8:00'
    elif req.period == 2:
        time = '9:00'
    elif req.period == 3:
        time = '10:30'
    elif req.period == 4:
        time = '11:30'
    elif req.period == 5:
        time = '12:30'
    elif req.period == 6:
        time = '14:30'
    elif req.period == 7:
        time = '15:30'

    await sendextraclass(c['students'], req.sub, day=day, time=time)
