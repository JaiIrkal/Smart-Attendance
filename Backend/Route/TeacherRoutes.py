
from deps import teacherCollection, classCollection, studentsCollection
from fastapi import APIRouter, Form, File, UploadFile
import pywhatkit


router = APIRouter(
    tags=['teacher'])

def getsubjectData(subjectCode: str, classData: list):
    for sub in classData:
        if sub["code"] == subjectCode:
            return sub
    return None


def getSubjectAttendance(subject: str, Data: list):
    Data = Data[0]
    Data = Data["Subjects"]
    for sub in Data:
        if subject == sub['Code']:
            return {"Attendance": sub["Attendance"],
                    "Detain": sub["Detain"]
                    }
    return None

def getClassConducted(subjectCode, semDetails) -> dict[str]:
    if semDetails:
        for sub in semDetails["subjects"]:
            if subjectCode == sub["code"]:
                return {"ClassDates": sub["ClassDates"]}
    return {"ClassDates": None}


@router.get("/teacher/{teacher_id}")
async def teacher(teacher_id):
    classesData = []
    teacher = await teacherCollection.find_one({"ID": teacher_id})
    for classTaught in teacher["Classes"]:
        classData = await classCollection.find_one({"_id":{"branch": teacher["Branch"],
                                                     "semester": int(classTaught["Semester"]),
                                                     "division": classTaught["Division"],
                                                     }
                                                    }   )
        listofSubject = []
        for subject in classTaught["Subjects"]:
            subjectData = getsubjectData(subject, classData["subjects"])
            listofStudent = []
            for student in classData["students"]:
                studentData = await studentsCollection.find_one({
                    "_id":{"usn": student}
                },
{"_id.usn": 1,
                                                                 "firstname": 1,
                                                                 "Data": {"$elemMatch":
                                                                              {"Semester":
                                                                                   int(classTaught["Semester"])
                                                                               }}
                                                                 }
                                                                )
                subjectAttendanceData = getSubjectAttendance(subject, studentData["Data"])
                studentAttendanceData = {
                    "USN": studentData["_id"]["usn"],
                    "Name": studentData["firstname"],
                    "Detain": subjectAttendanceData["Detain"],
                    "Attendance": subjectAttendanceData["Attendance"]
                }
                # print(studentAttendanceData)
                listofStudent.append(studentAttendanceData)
            #
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
        "Name": teacher["Name"],
        "Classes": classesData,
    }
    return teacherData


@router.get('/sendmessage')
async def sendmessage():
    pywhatkit.sendwhatmsg("+918105323958",
                          "Geeks For Geeks!",
                          21, 40)

    return {"message": "message sent"}
