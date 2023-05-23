def studententity(student) -> dict:

    return {
        "Name": str(student["Name"]),
        "USN": str(student["_id"]["usn"]),
        "Batch": int(student["Batch"]),
        "Branch": str(student["Branch"]),
        "Semester": student["Semester"],
        "Division": student["Division"],
        "Email": student["Email"],
        "Mobile": student['Mobile'],
        "DOB": student["DOB"],
        "Data": student["Data"],
        "photo": student["photo"],
        "parentsemail": student["parentemail"],
        "parentsmobile":student["parentmobile"],
        "TimeTable": student["TimeTable"]
    }
