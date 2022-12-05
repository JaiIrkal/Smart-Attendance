import cv2
import face_recognition
import numpy
import os


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


def faceEncodings(images):
    encodeList = []
    for img in images:
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        encode = face_recognition.face_encodings(img)[0]
        encodeList.append(encode)
    return encodeList

encodeList = faceEncodings(images);

print(encodeList)