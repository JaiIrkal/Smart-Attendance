import motor.motor_asyncio

mongodb_client = motor.motor_asyncio.AsyncIOMotorClient(
    "mongodb+srv://ankit:attendance@cluster0.iofnken.mongodb.net/test")

# this database conatains the attendance data
attendancedb = mongodb_client.Attendance_Database


# this points to the collection of Students in the Database
studentsCollection = attendancedb["Students"]

# this points to the collection of Teachers in the database
teacherCollection = attendancedb["Teachers"]

# this points to the collection of classes in current academic year
classCollection = attendancedb["Class_Collection"]

adminCollection = attendancedb["Admins"]

branchCollection = attendancedb["Data"]