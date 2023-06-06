import asyncio

import pymongo
from pprint import pprint
from datetime import datetime
from deps import classCollection


def compareTime(time1, time2):
    t1 = time1.split(":")
    t2 = time2.split(":")
    t1[0] = int(t1[0])
    t1[1] = int(t1[1])
    t2[0] = int(t2[0])
    t2[1] = int(t2[1])
    if (t1[0] > t2[0]):
        return 1;
    elif (t1[0] < t2[0]):
        return -1;
    else:
        if (t1[1] > t2[1]):
            return 1
        elif (t1[1] < t2[1]):
            return -1
        else:
            return 0


def getCurrentTimeSlot():
    currTime = datetime.now().strftime('%H:%M')
    print(currTime)
    if compareTime(currTime, '8:00') == 1 and compareTime(currTime, '9:00') == -1:
        return 1
    elif compareTime(currTime, '9:00') == 1 and compareTime(currTime, '10:00') == -1:
        return 2
    elif compareTime(currTime, '10:00') == 1 and compareTime(currTime, '10:30') == -1:
        return 0
    elif compareTime(currTime, '10:30') == 1 and compareTime(currTime, '11:30') == -1:
        return 3
    elif compareTime(currTime, '11:30') == 1 and compareTime(currTime, '12:30') == -1:
        return 4
    elif compareTime(currTime, '12:30') == 1 and compareTime(currTime, '13:30') == -1:
        return 5
    elif compareTime(currTime, '13:30') == 1 and compareTime(currTime, '14:30') == -1:
        return 0
    elif compareTime(currTime, '14:30') == 1 and compareTime(currTime, '15:00') == -1:
        return 6
    elif compareTime(currTime, '15:30') == 1 and compareTime(currTime, '16:30') == -1:
        return 7
    else:
        return 0


async def getCurrentPeriod(branch: str, semester: int, division: str):
    timetable = await classCollection.find_one({"_id": {
        "branch": branch,
        "semester": semester,
        'division': division
    }}, {'timetable'})
    timetable = timetable['timetable']
    day = datetime.today().isoweekday()
    period = getCurrentTimeSlot()

    if period != 0:
        sub = timetable[f'Day_{day}'][f'P_{period}']
        return sub
    else:
        return "None"
