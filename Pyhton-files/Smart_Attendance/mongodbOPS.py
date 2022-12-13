import pymongo


myclient = pymongo.MongoClient("mongodb+srv://ankit:attendance@cluster0.iofnken.mongodb.net/test")
mydb = myclient["Student_Database"]
mycol = mydb["CSE_5_A"]

allUSN= []

for stud in mycol.find({}):
    allUSN.append( stud.get("USN"))

print(allUSN);

# mycol.find_one_and_update({"USN": "2SD20CS017"},{
#     "$set":{
#         "Mobile":"+916202273766",
#         "Email":"imgreat.ankit@gmail.com"
#     }
# })