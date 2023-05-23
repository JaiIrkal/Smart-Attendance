

from fastapi import APIRouter, Form, File, UploadFile
import pywhatkit


router = APIRouter(

    tags=['teacher'])

@router.get('/sendmessage')
async def sendmessage():
    pywhatkit.sendwhatmsg("+918105323958",
                          "Geeks For Geeks!",
                          21, 40)

    return {"message": "message sent"}
