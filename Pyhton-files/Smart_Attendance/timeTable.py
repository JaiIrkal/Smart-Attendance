import pymongo
from pprint import pprint
from datetime import datetime

myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["timetable"]



def compareTime(time1, time2):
    t1 = time1.split(":")
    t2 = time2.split(":")
    t1[0] = int(t1[0])
    t1[1]=int(t1[1])
    t2[0]=int(t2[0])
    t2[1]=int(t2[1])
    if(t1[0] > t2[0]):
        return 1;
    elif(t1[0]<t2[0]):
        return -1;
    else:
        if(t1[1] > t2[1]):
            return 1
        elif(t1[1] < t2[1]):
            return -1
        else:
            return 0




def getCurrentPeriod(className):
    mycol = mydb[f'{className}']
    day = datetime.today().isoweekday()
    currTime = datetime.now().strftime('%H:%M')
    # currTime = "9:00"
    dayschedule = mycol.find_one({"Day": day})
    classes = dayschedule.get("Classes")
    for sub in classes:
        subName = sub.get("Subject_Name")
        startTime = sub.get("From")
        endTime = sub.get("To")
        if((compareTime(currTime, startTime)==1 and compareTime(currTime,endTime)==-1)or compareTime(currTime,startTime)==0):
            return subName

    print("No class scheduled right now!!")


print( getCurrentPeriod("CSE_5_A"))
#
# today = datetime.today().isoweekday()
# currTim=datetime.now().strftime('%H:%M')
# print(currTim)
# print(today)
#
# time = "18:57"
# print(compareTime(currTim,time))













