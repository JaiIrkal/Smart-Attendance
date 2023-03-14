# Manage the Student Database
import pymongo

from classDatabase import getListOfSubjects

myclient = pymongo.MongoClient("mongodb+srv://ankit:attendance@cluster0.iofnken.mongodb.net/test")
mydb = myclient["Student_Database"]

def addstudentToDatabase(usn, name, email, phone, branch, semester, division, encode,DOB ):
    classname = f'{branch}_{semester}_{division}'
    studentdet=mydb[f'{classname}']
    listofSubjects = getListOfSubjects(branch,semester,division)
    studentdet.insert_one({"USN": usn ,
                           "Name": name,
                           "DOB" : DOB,
                           "Face_Encodings":encode,
                           "Email": email,
                           "Mobile": phone
                           })
    for sub in listofSubjects:
        studentdet.find_one_and_update({"USN": usn },{
            "$set":{
                f"{sub}_attendance": [],
            }
        })

    studentLogin = mydb["Student_Logins"]

    studentLogin.insert_one({"USN": usn,
                             "PASSW": DOB,
                             "Class": classname
                             })