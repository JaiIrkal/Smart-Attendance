import smtplib
import pymongo


s.login("ankit6202273766@gmail.com","kpdtkxyzupafsyac")
def sendMail(absent, course, today):
    s = smtplib.SMTP('smtp.gmail.com', 587)
    s.starttls()
    s.login("ankit6202273766@gmail.com", "kpdtkxyzupafsyac")
    myclient = pymongo.MongoClient("mongodb+srv://ankit:attendance@cluster0.iofnken.mongodb.net/test")
    mydb = myclient["Student_Database"]
    mycol = mydb["CSE_5_A"]
    for USN in absent:
        student = mycol.find_one({"USN":USN})
        name = student.get("Name")
        mail=student.get("Email")
        phone = student.get("Mobile")
        message = f"Dear parent, your ward {name} was absent for {course} class on {today}."
        s.sendmail("ankit6202273766+sender@gmail.com", mail, message)
    s.quit()
