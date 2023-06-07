import smtplib
from email.message import EmailMessage

from deps import studentsCollection

account_sid = 'ACee9209e9f050daf64e7866b49d8e2a78'
auth_token = '514cc260b9638663d4ef701440b5921a'

async def senddetainmail(detainlist, course):
    s = smtplib.SMTP('smtp.gmail.com', 587)
    s.starttls()
    s.login("ankit6202273766@gmail.com", "yhbovakaoavuqqip")
    # client = Client(account_sid, auth_token)
    for USN in detainlist:
        msg = EmailMessage()
        msg['From'] = 'ankit6202273766@gmail.com'
        msg['subject'] = "Absent in class"
        student = await studentsCollection.find_one({"_id": USN}, {'firstname', 'email'})
        name = student["firstname"]
        mail = student["email"]
        msg['To'] = mail
        message = f"You have been detained in {course}"
        msg.set_content(message)
        s.send_message(msg)

    s.quit()


async def sendMail(absent, course, today):
    s = smtplib.SMTP('smtp.gmail.com', 587)
    s.starttls()
    s.login("ankit6202273766@gmail.com", "yhbovakaoavuqqip")
    # client = Client(account_sid, auth_token)
    for USN in absent:
        msg = EmailMessage()
        msg['From'] = 'ankit6202273766@gmail.com'
        msg['subject'] = "Absent in class"
        student = await studentsCollection.find_one({"_id": USN}, {'firstname', 'email'})
        name = student["firstname"]
        mail = student["email"]
        print(mail)
        msg['To'] = mail
        message = f"Dear parent, your ward {name} was absent for {course} class on {today}."
        msg.set_content(message)

        s.send_message(msg)

    s.quit()

async def sendextraclass(absent, course, day, time):
    s = smtplib.SMTP('smtp.gmail.com', 587)
    s.starttls()
    s.login("ankit6202273766@gmail.com", "yhbovakaoavuqqip")
    # client = Client(account_sid, auth_token)
    for USN in absent:
        msg = EmailMessage()
        msg['From'] = 'ankit6202273766@gmail.com'
        msg['subject'] = "Absent in class"
        student = await studentsCollection.find_one({"_id": USN}, {'firstname', 'email'})
        name = student["firstname"]
        mail = student["email"]
        print(mail)
        msg['To'] = mail
        message = f"Dear student, extra class for {course} scheduled on  {day} at {time}"
        msg.set_content(message)

        s.send_message(msg)

    s.quit()

async def sendwarningMail(absent, course):
    s = smtplib.SMTP('smtp.gmail.com', 587)
    s.starttls()
    s.login("ankit6202273766@gmail.com", "yhbovakaoavuqqip")
    # client = Client(account_sid, auth_token)
    for USN in absent:
        msg = EmailMessage()
        msg['From'] = 'ankit6202273766@gmail.com'
        msg['subject'] = "Low Attendance"
        student = await studentsCollection.find_one({"_id": USN}, {'firstname', 'email'})
        name = student["firstname"]
        mail = student["email"]
        print(mail)
        msg['To'] = mail
        message = f"Dear {name}, you have low attendance in {course}. " \
                  f"You are requested to attend subsequent classes to be eligible for Exam." \
                  f"You are required to maintain 75% attendance."
        msg.set_content(message)
        s.send_message(msg)

    s.quit()
