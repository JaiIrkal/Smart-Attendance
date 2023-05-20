from fastapi import APIRouter, Form, File, UploadFile
from fastapi.openapi.models import Response
from typing import Annotated
from pydantic import BaseModel
from deps import branchCollection
from PIL import Image
import io
import base64

router = APIRouter(tags=['admin'])


@router.get('/branchlist')
async def branchlist():
    branchlist = []
    branchCursor = branchCollection.find({})
    async for b in branchCursor:
        branchlist.append(b['id'])
    return branchlist   


@router.post('/createclass',tags=['Create Class', "admin"],summary='Create a Classroom')
async def createClass():

    return {}

class addStudentModel(BaseModel):
    usn: Annotated[str, Form()]
    firstname: Annotated[str, Form()]
    middlename: Annotated[str, Form()]
    lastname: Annotated[str, Form()]
    branch: Annotated[str, Form()]
    semester: Annotated[str, Form()]
    division: Annotated[str, Form()]
    photo: Annotated[str, Form()]



@router.post('/addstudent')
async def addStudent(request: addStudentModel):

    encoded = request.photo
    enc = encoded.split(',')
    decodeddata = base64.b64decode(enc[1])
    decodestring = io.BytesIO(decodeddata)
    img = Image.open(decodestring)


    return {"message":"upload"}