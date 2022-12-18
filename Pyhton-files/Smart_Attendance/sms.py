import pymongo 
from pymongo import MongoClient
from twilio.rest import Client
import os


# information.insert_many(record)

# for record in information.find():
#     print(record)


# for record in information.find({'firstname':'Ankit'}):
#     print(record)


# print(list(information.find({}, {'_id':0,'usn': 1, 'contact': 1})))


# list(information.find({}, {'_id':0,'firstname': 1, 'contact': 1}))

#twilio
from twilio.rest import Client

account_sid = 'ACee9209e9f050daf64e7866b49d8e2a78'
auth_token = '514cc260b9638663d4ef701440b5921a'
client = Client(account_sid, auth_token)

message = client.messages.create(
    from_='whatsapp:+14155238886',
    body='Hello! ',
    to='whatsapp:+916202273766'
)



print(message.sid)


