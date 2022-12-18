import smtplib
import pymongo
from twilio.rest import Client
from email.message import EmailMessage


account_sid = 'ACee9209e9f050daf64e7866b49d8e2a78'
auth_token = '514cc260b9638663d4ef701440b5921a'


def sendMail(absent, course, today):
    s = smtplib.SMTP('smtp.gmail.com', 587)
    s.starttls()
    s.login("ankit6202273766@gmail.com", "kpdtkxyzupafsyac")
    client = Client(account_sid, auth_token)
    myclient = pymongo.MongoClient("mongodb+srv://ankit:attendance@cluster0.iofnken.mongodb.net/test")
    mydb = myclient["Student_Database"]
    mycol = mydb["CSE_5_A"]

    for USN in absent:
        msg = EmailMessage()
        msg['From'] = 'ankit6202273766@gmail.com'
        msg['subject'] = "Absent in class"
        student = mycol.find_one({"USN":USN})
        name = student.get("Name")
        mail=student.get("Email")
        phone = student.get("Mobile")
        msg['To']= mail;
        message = f"Dear parent, your ward {name} was absent for {course} class on {today}."
        msg.set_content(message)
        # client.messages.create(
        #     from_='whatsapp:+14155238886',
        #     body=message,
        #     to=f'whatsapp:{phone}'
        # )
        s.send_message(msg)
        #
        # s.sendmail("ankit6202273766+sender@gmail.com", mail, message)
    s.quit()



sendMail(['2SD20CS014','2SD20CS017'], "CDSS", "18/12/2022")