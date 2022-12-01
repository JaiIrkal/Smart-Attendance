import pymongo

myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["attendance"]

mycol = mydb["studentDetails"]

mydict = { "name" : "ankit", "usn" : "17" }

x = mycol.insert_one(mydict)
print(x)
print(x.inserted_id)