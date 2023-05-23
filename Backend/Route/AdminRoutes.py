from datetime import datetime
from dateutil import tz
from fastapi import APIRouter, Form, File, UploadFile
from fastapi.openapi.models import Response
from typing import Annotated
from pydantic import BaseModel

from Models.StudentModel import AddStudentModel, StudentBasicDetailModel
from Schemas.Admin import SemData, CreateClassModel

from deps import branchCollection, classCollection, studentsCollection, branchCollection
from PIL import Image
import io
import base64

ind = tz.gettz('Asia/Kolkata')

router = APIRouter(prefix='/admin',
                   tags=['admin'])


@router.get('/branchlist')
async def branchlist():
    branchlist = []
    branchCursor = branchCollection.find({})
    async for b in branchCursor:
        branchlist.append(b['id'])
    return branchlist

@router.get('/semdata/{branch}/{semester}', response_model=SemData)
async def getsemdata(branch, semester):
    print(branch)
    print(semester)

    branchCursor = await branchCollection.find_one({'id': branch,
                                                    'semesterwisesubjects': {"$elemMatch": {
                                                        "semester" : int(semester)
                                                    }}
                                                   },{
        'semesterwisesubjects.$': 1
    })

    if not branchCursor:
        return None

    return branchCursor['semesterwisesubjects'][0]


@router.post('/createclass', tags=['Create Class', "admin"], summary='Create a Classroom')
async def createclass(request: CreateClassModel):
    classId = await classCollection.insert_one({
        "_id":{"branch": request.branch,
         'semester': request.semester,
         'division': request.division}
    })

    branchCollection.find_one_and_update({
        "id": request.branch
    },{
        "$push":{
            "semesterwisesubjects.$[i].divlist": request.division
        }
    }, array_filters=[{
        "i.semester": request.semester
    }])
    return "Class Created"



@router.post('/addstudent')
async def addStudent(form: AddStudentModel):
    encoded = form.photo
    enc = encoded.split(',')
    decodeddata = base64.b64decode(enc[1])
    decodestring = io.BytesIO(decodeddata)
    img = Image.open(decodestring)

    # result = await classCollection.insert_one({
    #     "usn": form.usn,
    #     "firstname": form.firstname,
    #     "middlename": form.middlename,
    #     'lastname': form.lastname,
    #     'branch': form.branch,
    #     'dob': form.dob.astimezone(ind).date()
    # })



    return {"message": "upload"}


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


