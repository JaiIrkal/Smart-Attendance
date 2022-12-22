import cv2
import os
import face_recognition
from werkzeug.utils import secure_filename

path = 'uploads'

def faceEncodings(addr):
    pic = cv2.imread(f'{path}/{addr}')
    pic = cv2.cvtColor(pic, cv2.COLOR_BGR2RGB)
    encode = face_recognition.face_encodings(pic)[0]
    os.remove(f'./{path}/{addr}')
    return encode

