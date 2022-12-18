import cv2
import face_recognition
import numpy
import os

from werkzeug.utils import secure_filename

path = 'images'
images = []
personNames = []

# myList = os.listdir(path)
# print(myList)
# for cu_img in myList:
#     current_Img = cv2.imread(f'{path}/{cu_img}')
#     images.append(current_Img)
#     personNames.append(os.path.splitext(cu_img)[0])
# print(personNames)


def faceEncodings(img):
    img.save( os.path.join("./temp/", secure_filename(img.filename)))
    img  = cv2.imread(f'./temp/{img.filename}')
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    encode = face_recognition.face_encodings(img)[0]
    os.remove(f'./temp/{img.filename}')
    return encode

encodeList = faceEncodings(images);

print(encodeList)