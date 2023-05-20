def studententity(student) -> dict:


    return {
        "Name": str(student["Name"]),
        "USN": str(student["USN"]),
        "Batch": int(student["Batch"]),
        "Branch": str(student["Branch"]),
        "Semester": student["Semester"],
        "Division": student["Division"],
        "Email": student["Email"],
        "Mobile": student['Mobile'],
        "DOB": student["DOB"],
        "Data": student["Data"],
        "TimeTable": student["TimeTable"]
    }
