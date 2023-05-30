import motor.motor_asyncio
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext

SECRET_KEY = "b4d889fab58423d225c3f77edf0d51f678f04db624dec04ff4f3f19651b26b1e"

REFRESH_SECRET_KEY = "b4d889fab58423d225c3f77edf0d51f678f04db624dec04ff4f3f19651b26b1e"

ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_MINUTES = 7 * 24 * 60

password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth_2_scheme = OAuth2PasswordBearer(tokenUrl="login")

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

def get_hashed_password(password: str) -> str:
    return password_context.hash(password)


def verify_password(password: str, hashed_pass: str) -> bool:
    return password_context.verify(password, hashed_pass)

