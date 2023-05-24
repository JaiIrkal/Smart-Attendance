def studententity(student) -> dict:

    return {
        "Name": str(student["firstname"]),
        "USN": str(student["_id"]["usn"]),
        "Batch": int(student["Batch"]),
        "Branch": str(student["Branch"]),
        "Semester": student["Semester"],
        "Division": student["Division"],
        "Email": student["email"],
        "Mobile": student['mobile'],
        "DOB": student["dob"],
        "Data": student["Data"],
        "photo": student["photo"],
        "parentsemail": student["parentsemail"],
        "parentsmobile":student["parentsmobile"],
        "TimeTable": student["TimeTable"]
    }
