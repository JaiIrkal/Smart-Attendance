import asyncio
from datetime import datetime
import urllib.request as ur
import face_recognition
import pymongo.errors
import numpy as np
from dateutil import tz
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from pymongo.errors import DuplicateKeyError

from Models.AdminModels import AddStudentModel, AddTeacherModel
from Models.StudentModel import StudentBasicDetailModel
from Schemas.Admin import SemData, CreateClassModel
from deps import classCollection, studentsCollection, branchCollection, get_hashed_password, teacherCollection

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
    form.timetable['extra'] = []
    classId = await classCollection.insert_one({
        "_id": {
            "branch": form.branch,
            'semester': form.semester,
            'division': form.division,
        },
        'subjects': form.coresubjects + form.branchelectives,
        'timetable': form.timetable,
        'students': []
    })

    branchCollection.find_one_and_update({
        "id": form.branch
    }, {
        "$push": {
            "semesterwisesubjects.$[i].divlist": form.division
        }
    }, array_filters=[{
        "i.semester": form.semester
    }])

    return "Class Created"


@router.post('/addteacher', status_code=201)
async def addteacher(form: AddTeacherModel):
    try:
        password = f'{form.firstname.lower()[0:4]}{form.dob.astimezone(ind).year}'

        await teacherCollection.insert_one({
            'ID': form.id,
            'firstname': form.firstname,
            'middlename': form.middlename,
            'lastname': form.lastname,
            'dob': f'{form.dob.astimezone(ind).date()}',
            'title': form.title,
            'Branch': form.department,
            'Password': get_hashed_password(password),
            'Classes': []
        })
        return {'Teacher Created'}
    except DuplicateKeyError:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail='USN already exists in database')



@router.post('/addstudent', status_code=201)
async def addStudent(form: AddStudentModel):
    try:
        decoded = ur.urlopen(form.photo)
        img = face_recognition.load_image_file(decoded)
        face_encoding = face_recognition.face_encodings(img, num_jitters=2, model='large')[0].tolist()
        subjectsData = []
        subjects = form.coresubjects + form.branchelectives + form.openelectives
        for subjectIterator in subjects:
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
        password = f'{form.firstname.lower()[0:4]}{form.dob.astimezone(ind).year}'

        result = await studentsCollection.insert_one({
            '_id': form.usn.upper(),
            "firstname": form.firstname,
            "middlename": form.middlename,
            'lastname': form.lastname,
            'dob': f'{form.dob.astimezone(ind).date()}',
            'email': form.email,
            'mobile': form.mobile,
            'parentsemail': form.parentsemail,
            'parentsmobile': form.parentsmobile,
            'academicyear': int(form.academicyear),
            'branch': form.branch,
            'semester': int(form.semester),
            'division': form.division,
            'photo': form.photo,
            'face_encodings': face_encoding,
            'data': semesterdata,
            'Password': get_hashed_password(password)
        })
        await classCollection.find_one_and_update({"_id": {
            "branch": form.branch,
            "semester": int(form.semester),
            'division': form.division
        }}, {
            '$push': {
                'students': form.usn
            }
        })
    except DuplicateKeyError:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail='USN already exists in database')
    except:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="The image uploaded is invalid")

    return {"message": "Student Created"}


class updateTimeTableSubject(BaseModel):
    branch: str
    semester: int
    division: str
    keyid: str | None = None
    subname: str | None = None


@router.put('/updatetimetable')
async def updateTimeTable(updatetimetableSubjectEntry: updateTimeTableSubject):
    updatetimetableSubjectEntrydict = updatetimetableSubjectEntry.dict()

    classCollection.find_one_and_update({
        "_id": {
            "branch": updatetimetableSubjectEntry.branch,
            "semester": updatetimetableSubjectEntry.semester,
            "division": updatetimetableSubjectEntry.division
        }
    }, {
        "$set": {
            f'timetable.{updatetimetableSubjectEntry.keyid}': updatetimetableSubjectEntry.subname
        }
    })

    return {"message": "timetable updated"}


@router.get('/studentdata/{usn}', response_model=StudentBasicDetailModel)
async def getstudentbasicdetails(usn: str):
    student = await studentsCollection.find_one({"_id": usn.upper()})
    student["usn"] = student["_id"]
    dob = student['dob']
    dob = datetime.strptime(dob, '%Y-%m-%d').astimezone(tz=ind)
    student['dob'] = dob
    return student


@router.get('/teacherlist/{branch}', response_model=list)
async def getteacherinbranch(branch: str):
    teacherlist = teacherCollection.find({"Branch": branch}).to_list(100)
    listofteachersinbranch = []
    for teacher in await teacherlist:
        t = {
            "id": teacher['ID'],
            "name": teacher['title'] + ' ' + teacher['firstname'] + " " + teacher['lastname']
        }
        listofteachersinbranch.append(t)

    return listofteachersinbranch


@router.put('/classdata', status_code=status.HTTP_202_ACCEPTED)
async def updateClassData(classData: CreateClassModel):
    subjects = []
    classData.timetable['extra'] = []
    for sub in classData.coresubjects + classData.branchelectives:
        subjects.append({
            'code': sub['code'],
            'ClassDates': [],
            'teacherid': sub.get("teacherid").get("id")
        })
        await teacherCollection.find_one_and_update({"ID": sub.get("teacherid").get("id")},{
            "$push": {
                "Classes": {
                    "Semester": classData.semester,
                    "Division": classData.semester,
                    "Subjects": [sub['code']]
                }
            }
        })
    result = await classCollection.find_one_and_update({
        "_id": {
            'branch': classData.branch,
            'semester': classData.semester,
            'division': classData.division
        }
    }, {
        "$set": {
            'subjects': subjects,
            'timetable': classData.timetable

        }
    })



    return {"message": "Class Data Updated"}


@router.get('/timetable/subjectlist/{branch}/{semester}')
async def subjectlist(branch: str, semester: int):
    subjects = []
    semdata = await branchCollection.find_one({'id': branch,
                                               'semesterwisesubjects': {"$elemMatch": {
                                                   "semester": int(semester)
                                               }}
                                               }, {
                                                  'semesterwisesubjects.$': 1
                                              })

    semdata = semdata['semesterwisesubjects'][0]

    for sub in semdata['coresubjects']:
        s = {
            'code': sub['code'],
            'short': sub['short'],
            'name': sub['name']
        }
        subjects.append(s)

    for sub in semdata['branchelectives']:
        s = {
            'code': sub['code'],
            'short': sub['short'],
            'name': sub['name']
        }
        subjects.append(s)

    for sub in semdata['labs']:
        s = {
            'code': sub['code'],
            'short': sub['short'],
            'name': sub['name']
        }
        subjects.append(s)

    for sub in semdata['openelectives']:
        s = {
            'code': sub['code'],
            'short': f'{sub["short"]}-OE',
            'name': sub['name']
        }
        subjects.append(s)
    return subjects




# async def add():
#     try:
#         await teacherCollection.insert_one({'ID': "teacher001"})
#     except pymongo.errors.DuplicateKeyError as Argument:
#         print("Duplicate Key")
#
# asyncio.run(add())