def studententity(student) -> dict:

    return {
        "Name": str(student["firstname"]),
        "USN": str(student["_id"]),
        "Batch": int(student["academicyear"]),
        "Branch": str(student["branch"]),
        "Semester": student["semester"],
        "Division": student["division"],
        "Email": student["email"],
        "Mobile": student['mobile'],
        "DOB": student["dob"],
        "Data": student["data"],
        "photo": student["photo"],
        "parentsemail": student["parentsemail"],
        "parentsmobile": student["parentsmobile"],
        "TimeTable": student["TimeTable"]
    }
