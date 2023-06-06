import asyncio
import os
from datetime import datetime
import cv2
import face_recognition
import numpy as np
import pymongo
from deps import classCollection, studentsCollection
import mailing

from timeTable import getCurrentPeriod


async def markAttendance():
    branch = "CSE"
    semester = 5
    division = "A"
    subjectlist = []

    # result = await classCollection.find_one({"_id": {
    #     "branch": branch,
    #     "semester": semester,
    #     'division': division
    # }}, {'subjects'})

    # for count, subject in enumerate(result['subjects']):
    #     subjectlist.append(subject['code'])

    # i = 0;
    #
    # while (True):
    #     i = int(input())
    #     if i < 0 and i > (len(subjectlist) - 1):
    #         continue
    #     else:
    #         break

    subject = await getCurrentPeriod(branch=branch, semester=semester, division=division)
    print(subject)
    if subject != "None":
        all = []
        present = []
        absent = []
        encodeListKnown = []

        classEntity = await classCollection.find_one({"_id": {
            "branch": branch, "semester": semester, "division": division}
        })

        students = classEntity['students']

        for usn in students:
            student = await studentsCollection.find_one({'_id': usn}, {'_id', 'face_encodings'})
            all.append(student['_id'])
            encodeListKnown.append(student['face_encodings'])

        cap = cv2.VideoCapture(0)

        while True:
            ret, frame = cap.read()
            faces = cv2.resize(frame, (0, 0), None, 0.25, 0.25)
            faces = cv2.cvtColor(faces, cv2.COLOR_BGR2RGB)

            facesCurrentFrame = face_recognition.face_locations(faces)
            encodesCurrentFrame = face_recognition.face_encodings(faces, facesCurrentFrame)

            for encodeFace, faceLoc in zip(encodesCurrentFrame, facesCurrentFrame):
                matches = face_recognition.compare_faces(encodeListKnown, encodeFace)
                faceDis = face_recognition.face_distance(encodeListKnown, encodeFace)
                matchIndex = np.argmin(faceDis)
                print(faceDis)
                if faceDis[matchIndex] < 0.4 and matches[matchIndex]:
                    name = all[matchIndex].upper()
                    y1, x2, y2, x1 = faceLoc
                    y1, x2, y2, x1 = y1 * 4, x2 * 4, y2 * 4, x1 * 4
                    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                    cv2.rectangle(frame, (x1, y2 - 35), (x2, y2),
                                  (0, 255, 0), cv2.FILLED)
                    cv2.putText(frame, name, (x1 + 6, y2 - 6),
                                cv2.FONT_HERSHEY_COMPLEX, 1, (255, 255, 255), 2)
                    if name not in present:
                        present.append(name)
                        print(present)

            cv2.imshow('Webcam', frame)
            if cv2.waitKey(1) == 13:
                break

        cap.release()
        cv2.destroyAllWindows()

        # print(present);

        # get today date in format (DD/MM/YYYY)
        today = datetime.today().strftime("%d/%m/%Y")

        print(present)

        a = await classCollection.find_one_and_update({"_id": {
            "branch": branch,
            "semester": semester,
            'division': division
        }}, {
            "$push": {
                "subjects.$[i].ClassDates": today
            }
        }, array_filters=[{
            'i.code': subject
        }])

        for student in present:
            await studentsCollection.find_one_and_update({"_id": student}, {
                "$push": {
                    "data.$[i].subjects.$[j].attendance": 1
                }
            }, array_filters=[{
                'i.semester': semester
            }, {
                'j.subject_code': subject
            }])

        for student in all:
            if student not in present:
                absent.append(student)
                await studentsCollection.find_one_and_update({"_id": student}, {
                    "$push": {
                        "data.$[i].subjects.$[j].attendance": 0
                    }
                }, array_filters=[{
                    'i.semester': semester
                }, {
                    'j.subject_code': subject
                }])

        await mailing.sendMail(absent, subject, today)


asyncio.run(markAttendance())
