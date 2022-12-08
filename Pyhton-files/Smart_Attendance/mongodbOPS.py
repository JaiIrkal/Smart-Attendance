import pymongo


myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["timetable"]
mycol = mydb["CSE_5_A"]
