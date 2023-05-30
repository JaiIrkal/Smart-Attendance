from fastapi import APIRouter
from deps import classCollection, studentsCollection
from Schemas.Student import studententity

router = APIRouter(prefix='/student',
    tags=['Student Routes'])


def getClassConducted(subjectCode, semDetails) -> dict[str]:
    if semDetails:
        for sub in semDetails["subjects"]:
            if subjectCode == sub["code"]:
                return {"ClassDates": sub["ClassDates"]}
    return {"ClassDates": None}


@router.get("/{USN}")
async def detailsOfStudent(USN):
    student = await studentsCollection.find_one({"_id": USN.upper()})
    student["TimeTable"] = {}
    classList = []
    for i, sem in enumerate(student["data"]):
        classDetails = await classCollection.find_one({"_id": {
            "branch": student["branch"],
            "academicyear": int(student['academicyear']),
            "semester": int(sem["Semester"]),
            "division": sem["Division"]
        }
        },
            {"subjects", "timetable"})
        if classDetails:
            student["TimeTable"] = classDetails["timetable"]
            for j, subject in enumerate(sem["Subjects"]):
                subjectData = getClassConducted(subject["Code"], classDetails)
                subject["ClassesConducted"] = subjectData["ClassDates"]

    return studententity(student)
