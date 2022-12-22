import pymongo


myclient = pymongo.MongoClient("mongodb+srv://ankit:attendance@cluster0.iofnken.mongodb.net/test")
mydb = myclient["Class_Database"]
mycol = mydb["CSE_5_A"]

mycol.insert_one({
    "Semester" : 5,
    "Division" : "A",
    "Branch": "Computer Science & Engineering",
    "Branch_abbr" : "CSE",
    "Course_count": 6,
    "Subject_1":{ "Course_Code":"18UHUC500","Course_abbrv": "MEPIP", "Course_Name": "Management, Entrepreneurship and IPR", "Course_Instructor":" Prof. Yashodha S","Classes_conducted": [] },
    "Subject_2":{"Course_Code":"18UCSC500","Course_abbrv": "DC", "Course_Name": "Data Communication", "Course_Instructor":"Prof. J.V. Vadavi","Classes_conducted": []},
    "Subject_3":{"Course_Code":"18UHUC501","Course_abbrv": "DBMS", "Course_Name": "Database Management Systems","Course_Instructor":"Prof. Anand Vaidya", "Classes_conducted": []},
    "Subject_4":{"Course_Code":"18UHUC502","Course_abbrv": "CDSS", "Course_Name": "Compiler Design","Course_Instructor":"Dr. U.P. Kulkarni", "Classes_conducted": []},
    "Subject_5":{"Course_Code":"18UHUC503","Course_abbrv": "SE", "Course_Name": "Software Engineering","Course_Instructor":"Prof. Rashmi P", "Classes_conducted": []},
    "Subject_6":{"Course_Code":"18UHUC504","Course_abbrv": "AOOP", "Course_Name": "Advanced Object Oriented Programming","Course_Instructor":"Prof. Govind N", "Classes_conducted": []}
})

