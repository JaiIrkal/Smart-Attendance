import os
import cv2
import face_recognition
import pymongo
from pprint import pprint
from datetime import datetime




myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["Student_Database"]
mycol = mydb["CSE_5_A"]

sub1 = "CDSS"

path = 'images'
images = []

myList = os.listdir(path)
img = cv2.imread(f'{path}/Amrit.jpg')
current_Img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

encode = face_recognition.face_encodings(img)[0]

print(encode)

# mycol.insert_one({"Name": "Ankit Kumar", "USN": "2SD20CS017", "DOB": "03-05-2001", "Face_Encodings": encode.tolist(), f'{sub1}_attendance': [] })

mycol.insert_one({"Name": "Amrit Kumar", "USN": "2SD20CS014", "DOB": "03-05-2001", "Face_Encodings": encode.tolist(), f'{sub1}_attendance': [] })