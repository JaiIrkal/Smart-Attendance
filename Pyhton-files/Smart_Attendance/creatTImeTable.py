import pymongo
import numpy

myclient = pymongo.MongoClient("mongodb+srv://ankit:attendance@cluster0.iofnken.mongodb.net/test")
mydb = myclient["timetable"]
mycol = mydb["CSE_5_A"]

#
# the days of the week are stored as int
# 1 is Monday, 2 is Tuesday, 3 is WEdnesday, 4 is THursday, 5 is Friday, 6 is Saturday, 7 is SUnday

mycol.insert_one({
    'Day' :1 , "Classes" : [{

            "Subject_Name": "CDSS",
            "From": "8:00",
            "To": "9:00"
        },{

            "Subject_Name":"MEPIP",
            "From":"9:00",
            "To":"10:00"
        },{

            "Subject_Name": "DBMS",
            "From": "10:30",
            "To": "11:30"
        },{

            "Subject_Name": "DC",
            "From": "11:30",
            "To": "12:30"
        },{

            "Subject_Name": "AOOP",
            "From": "12:30",
            "To": "13:30"
        }
    ]
})

mycol.insert_one({
    "Day": 2,"Classes":[{

            "Subject_Name": "SE",
            "From": "8:00",
            "To":"9:00"
        },{

            "Subject_Name":"CDSS",
            "From": "9:00",
            "To":"10:00"
        },{

            "Subject_Name":"DC",
            "From": "10:30",
            "To" : "11:30"
        },{

            "Subject_Name":"MEPIP",
            "From":"11:30",
            "To":"12:30"

    }]
})

mycol.insert_one({
    "Day": 3,"Classes":[{

            "Subject_Name": "DC",
            "From": "8:00",
            "To":"9:00"
        },{

            "Subject_Name":"DBMS",
            "From": "9:00",
            "To":"10:00"
        },{

            "Subject_Name":"MEPIP",
            "From": "10:30",
            "To" : "11:30"
    },{

            "Subject_Name":"SE",
            "From":"11:30",
            "To":"12:30"
        }
    ]
})

mycol.insert_one({
    "Day": 4,"Classes":[{

            "Subject_Name": "CDSS",
            "From": "8:00",
            "To":"9:00"
        },{

            "Subject_Name":"SE",
            "From": "9:00",
            "To":"10:00"
        },{

            "Subject_Name":"DBMS",
            "From": "10:30",
            "To" : "11:30"
        },{

            "Subject_Name":"DC",
            "From":"11:30",
            "To":"12:30"

    }]
})

mycol.insert_one({
    "Day": 5,"Classes":[{

            "Subject_Name": "AOOP",
            "From": "8:00",
            "To":"9:00"
    },{

            "Subject_Name":"DBMS",
            "From": "9:00",
            "To":"10:00"

    }]
})

mycol.insert_one({
    "Day" : 6, "Classes":[
        {
            "Subject_Name":"MEPIP",
            "From":"8:00",
            "To":"9:00"
        },{
            "Subject_Name": "AOOP",
            "From": "9:00",
            "To": "10:00"
        }
    ]
})


print("Time Table added for CSE 5 A")