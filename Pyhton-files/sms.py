import pymongo 
from pymongo import MongoClient
from twilio.rest import Client


client = MongoClient("mongodb://localhost:27017/")

mydb = client['Student']

information = mydb.studentinformation

record = [{
    'firstname':'Amrit',
    'lastname':'Singh',
    'department':'cse',
    'usn':'2SD20CS014',
    'contact':'7717720441'
},
{
    'firstname':'Ankit',
    'lastname':'Kumar',
    'department':'cse',
    'usn':'2SD20CS017',
    'contact':'6202273766'
}
]

# information.insert_many(record)

# for record in information.find():
#     print(record)


# for record in information.find({'firstname':'Ankit'}):
#     print(record)

contact_array = []
i = 0
for record in information.find({}, {'_id':0,'usn':1,'contact': 1}):
    for k, v in record.items():
        if k == 'contact':
            contact_array.append(v)


for j in range(len(contact_array)):
    print(contact_array[j])



# print(list(information.find({}, {'_id':0,'usn': 1, 'contact': 1})))


# list(information.find({}, {'_id':0,'firstname': 1, 'contact': 1}))

#twilio
account_sid = ''
auth_token = ''

client = Client(account_sid,auth_token)

for k in range(len(contact_array)):
    message = client.messages.create(from_= '',body = '' , to = contact_array[k])


