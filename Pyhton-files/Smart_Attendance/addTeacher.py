# manage the teacher database
import pymongo

myclient = pymongo.MongoClient("mongodb+srv://ankit:attendance@cluster0.iofnken.mongodb.net/test")
mydb = myclient["Staff_Database"]


mycol = mydb['Teachers']

mycol.insert_one({"UserId": 100,
                  "Password":"passw",
                  "Designation": "Dr.",
                  "Name": "Umakant Kulkarni",
                  "Classes": ['CSE_5_A'],
                  "Email": None,
                  "Mobile": None,
                  })

# admin = mydb['Admins']
# admin.insert_one({
#     "UserId": 100,
#     "Password": "passw"
# })
