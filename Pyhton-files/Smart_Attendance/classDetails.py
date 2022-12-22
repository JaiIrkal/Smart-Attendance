import pymongo


myclient = pymongo.MongoClient("mongodb+srv://ankit:attendance@cluster0.iofnken.mongodb.net/test")
mydb = myclient["Class_Database"]
mycol = mydb["CSE_5_A"]



mycol.find_one_and_update({},{
    "$set":{
        "SE.Classes_conducted": ['1/12/2022','2/12/2022','3/12/2022','4/12/2022','5/12/2022','6/12/2022','7/12/2022','8/12/2022','9/12/2022','10/12/2022','11/12/2022','12/12/2022']
    },
})

