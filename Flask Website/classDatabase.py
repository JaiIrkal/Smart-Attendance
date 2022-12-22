# manage the class Database
import pymongo



myclient = pymongo.MongoClient("mongodb+srv://ankit:attendance@cluster0.iofnken.mongodb.net/test")
classdb = myclient["Class_Database"]


def getClassesDates(course, branch, sem, div):
    className = f'{branch}_{sem}_{div}'
    classdetails = classdb[className]
    a = classdetails.find_one({})
    return a.get(course).get("Classes_conducted")


# returns the list of subjects for particular class
def getListOfSubjects(branch,sem,div):
    className = f'{branch}_{sem}_{div}'
    classdetails = classdb[className]
    a = classdetails.find_one({})
    return a.get("Course_Names")


