def studententity(student) -> dict:

    return {
        "Name": str(student["firstname"]) +" "+ student['middlename'] +" "+ student['lastname'],
        "USN": str(student["_id"]),
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
