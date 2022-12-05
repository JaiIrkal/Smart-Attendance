import pymongo
from pprint import pprint
from datetime import datetime




myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["timetable"]
mycol = mydb["CSE_5_A"]


today = datetime.today().isoweekday()
print(today)





x = mycol.find_one({"Day": 9})
i=1
a = x.get("Classes")
# a.append({"Subject_3": {
#     "Subject_Name": "TEst",
#     "From": "10:30",
#     "To": "11:30"
#
# }})

# mycol.find_one_and_update({"Day":7},{
#     "$set": {
#     "Classes":a
# }
# } )

# print(a)

for b in a:
    c = b.get("Subject_"+str(i));
    i=i+1
    start = b.get("From")
    end = b.get("To")
    if(start == "9:00"):
        print(c)
        print(start,end)












