
from datetime import datetime
import urllib.request as ur
import face_recognition

from dateutil import tz
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from Models.AdminModels import AddStudentModel
from Models.StudentModel import StudentBasicDetailModel
from Schemas.Admin import SemData, CreateClassModel
from deps import classCollection, studentsCollection, branchCollection

ind = tz.gettz('Asia/Kolkata')

router = APIRouter(prefix='/admin',
                   tags=['admin'])


@router.get('/branchlist', description='Get the list of branches')
async def getbranchList():
    branchlist = []
    branchCursor = branchCollection.find({})
    async for b in branchCursor:
        branchlist.append(b['id'])
    return branchlist


@router.get('/divlist/{branch}/{semester}', response_model=list[str],
            description='Get the list of divisions of particular semester in given Branch')
async def getdivlist(branch: str, semester: int):
    divlist = []
    divCursor = await branchCollection.find_one({
        "id": branch,
        'semesterwisesubjects': {"$elemMatch": {
            "semester": semester
        }}
    }, {
        'semesterwisesubjects.$': 1
    })
    return divCursor['semesterwisesubjects'][0]["divlist"]


@router.get('/semdata/{branch}/{semester}', response_model=SemData,
            description='Get the data of the semester for a branch')
async def getsemdata(branch, semester):
    print(branch)
    print(semester)

    branchCursor = await branchCollection.find_one({'id': branch,
                                                    'semesterwisesubjects': {"$elemMatch": {
                                                        "semester": int(semester)
                                                    }}
                                                    }, {
                                                       'semesterwisesubjects.$': 1
                                                   })

    if not branchCursor:
        return None

    return branchCursor['semesterwisesubjects'][0]


@router.post('/createclass', tags=['Create Class', "admin"], summary='Create a Classroom')
async def createclass(form: CreateClassModel):

    print(form.subjects)

    print(form.timetable)

    # classId = await classCollection.insert_one({
    #     "_id": {
    #             "branch": form.branch,
    #             'academicyear' : form.batch,
    #             'semester': form.semester,
    #             'division': form.division,
    #
    #     },
    #     'subjects': form.subjects,
    #     'timetable': form.timetable
    # })
    #
    # branchCollection.find_one_and_update({
    #     "id": form.branch
    # }, {
    #     "$push": {
    #         "semesterwisesubjects.$[i].divlist": form.division
    #     }
    # }, array_filters=[{
    #     "i.semester": form.semester
    # }])


    return "Class Created"


@router.post('/addstudent', status_code=201)
async def addStudent(form: AddStudentModel):
    try:
        data = []
        encoded = form.photo
        decoded = ur.urlopen(form.photo)
        img = face_recognition.load_image_file(decoded)
        face_encoding = face_recognition.face_encodings(img, num_jitters=2, model='large')[0].tolist()

        subjectsData = []

        for subjectIterator in form.subjects:
            subjectsData.append({
                "subject_code": subjectIterator,
                "isdetained": False,
                "attendance": []
            })
        semesterdata = [{
            "semester": int(form.semester),
            "division": form.division,
            'subjects': subjectsData
        }]

        result = await studentsCollection.insert_one({
            '_id': form.usn,
            "firstname": form.firstname,
            "middlename": form.middlename,
            'lastname': form.lastname,
            'dob': form.dob.astimezone(ind).date(),
            'email': form.email,
            'mobile': form.mobile,
            'parentsemail': form.parentsemail,
            'parentsmobile': form.parentsmobile,
            'academicyear': form.academicyear,
            'branch': form.branch,
            'semester': form.semester,
            'division': form.division,
            'photo': form.photo,
            'face_encodings': face_encoding,
            'data': data,
        })
    except:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE,detail="The image uploaded is invalid")

    return {"message": "Student Created"}



class updateTimeTableSubject(BaseModel):
    branch: str
    semester: int
    division: str
    keyid: str | None = None
    subname: str | None = None


@router.put('/updatetimetable')
async def getTimeTable(updatetimetableSubjectEntry: updateTimeTableSubject):
    updatetimetableSubjectEntrydict = updatetimetableSubjectEntry.dict()
    print(updatetimetableSubjectEntry)

    classCollection.find_one_and_update({
        "branch": updatetimetableSubjectEntry.branch,
        "semester": updatetimetableSubjectEntry.semester,
        "division": updatetimetableSubjectEntry.division
    }, {
        "$set": {
            f'timetable.{updatetimetableSubjectEntry.keyid}': updatetimetableSubjectEntry.subname
        }
    })

    return {"message": "timetable updated"}


@router.get('/studentdata/{usn}', response_model=StudentBasicDetailModel)
async def getstudentbasicdetails(usn: str):
    student = await studentsCollection.find_one({"_id": {"usn": usn.upper()}})
    student["usn"] = student["_id"]["usn"]
    dob = student['dob']
    dob = datetime.strptime(dob, '%Y-%m-%d').astimezone(tz=ind)
    student['dob'] = dob
    return student


@router.get('/test')
async def test() -> str:
    result = await studentsCollection.insert_one({
        'USN': 'fda',
        "key": "hello",
        'name': 'ankit'
    })
    print(result)
    return "success"
