import os
from datetime import datetime

import cv2
import face_recognition
import numpy as np
import pymongo
num = 0
myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["Student_Database"]
mycol = mydb["CSE_5_A"]

present = []
usn= []
encodeListKnown=[]

for a in mycol.find({}):
    usn.append(a.get("USN"));
    encodeListKnown.append(np.array(a.get("Face_Encodings")))

cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    faces = cv2.resize(frame, (0, 0), None, 0.25, 0.25)
    faces = cv2.cvtColor(faces, cv2.COLOR_BGR2RGB)

    facesCurrentFrame = face_recognition.face_locations(faces)
    encodesCurrentFrame = face_recognition.face_encodings(
        faces, facesCurrentFrame)

    for encodeFace, faceLoc in zip(encodesCurrentFrame, facesCurrentFrame):
        matches = face_recognition.compare_faces(encodeListKnown, encodeFace)
        faceDis = face_recognition.face_distance(encodeListKnown, encodeFace)
        # print(faceDis)
        matchIndex = np.argmin(faceDis)

        if matches[matchIndex]:
            name = usn[matchIndex].upper()
            # print(name)
            y1, x2, y2, x1 = faceLoc
            y1, x2, y2, x1 = y1 * 4, x2 * 4, y2 * 4, x1 * 4
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.rectangle(frame, (x1, y2 - 35), (x2, y2),
                          (0, 255, 0), cv2.FILLED)
            cv2.putText(frame, name, (x1 + 6, y2 - 6),
                        cv2.FONT_HERSHEY_COMPLEX, 1, (255, 255, 255), 2)
            if name not in present:
                present.append(name)

    cv2.imshow('Webcam', frame)
    if cv2.waitKey(1) == 13:
        break

cap.release()
cv2.destroyAllWindows()

print(present);

#mark attendance
for student in present :
    print(student);
    stud = mycol.find_one_and_update({"USN":student},{
        "$push":{
            "CDSS_attendance": datetime.now().strftime('%d/%m/%Y')
        }
    })

    # mark = stud.get("CDSS_attendance")
    # mark.append( datetime.now().strftime('%d/%m/%Y'))
    # mycol.find_one_and_update({"USN": student},{
    #     "$set":{
    #         "CDSS_attendance": mark
    #     }
    # })


