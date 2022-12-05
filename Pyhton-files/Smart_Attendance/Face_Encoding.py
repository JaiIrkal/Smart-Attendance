import face_recognition
import cv2
import os
import pymongo


myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["test"]
mycol = mydb["studentDetails"]



path = 'images'
images = []
personNames = []
myList = os.listdir(path)

print(myList)


for cu_img in myList:
    current_Img = cv2.imread(f'{path}/{cu_img}')
    img = current_Img
    name = os.path.splitext(cu_img)[0]
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    encode = face_recognition.face_encodings(img)[0]
    y = mycol.find_one_and_update({"name": name}, {
        "$set": {
            "faceencodings": encode
        }
    })


print(personNames)



