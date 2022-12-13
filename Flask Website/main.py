from flask import Flask, request
from flask import render_template
import pymongo
import pandas as pd

import uuid
import logging
from flask_sessionstore import Session
from flask_session_captcha import FlaskSessionCaptcha
from pymongo import MongoClient


app = Flask(__name__, template_folder="templates")

mongodb_client = pymongo.MongoClient("mongodb+srv://jai:attendance@cluster0.iofnken.mongodb.net/test")
my_db = mongodb_client["Student_Database"]
my_coll = my_db["CSE_5_A"]

classDB = mongodb_client["Class_Database"]
class5A = classDB["CSE_5_A"]

mongoClient = MongoClient('localhost', 27017)


app.config["SECRET_KEY"] = uuid.uuid4()
app.config['CAPTCHA_ENABLE'] = True

# Set 5 as character length in captcha
app.config['CAPTCHA_LENGTH'] = 5

# Set the captcha height and width
app.config['CAPTCHA_WIDTH'] = 160
app.config['CAPTCHA_HEIGHT'] = 60
app.config['SESSION_MONGODB'] = mongoClient
app.config['SESSION_TYPE'] = 'mongodb'

# Enables server session
Session(app)

# Initialize FlaskSessionCaptcha
captcha = FlaskSessionCaptcha(app)



data_list = []
for data in my_coll.find({}, {"_id":0, "Face_Encodings":0, "CDSS_attendance":0}):
    data_list.append(data)

student_table = pd.DataFrame(data_list)



teacher_dict = {

    "Umakant Kulkarni":"CDSS",
    "Rashmi_Athnikar":"SE",
    "Anand_Vaidya":"DBMS",
    "Yashoda_Sambrani":"MEPIP",
    "Vadvi":"DC",
    "Govind":"AOOP",
    "a":"b"
}

usn_list = ["2sd20cs043", "2sd20cs014", "2sd20cs017"]
global_password = "a"

#Function to check validity of student logged in
def studentIsVaid(usn):
    if usn in usn_list:
        return True
    return False

#Function to check validity of teacher logged in
def isTeacherValid(name, subject):
    if name in teacher_dict.keys():
        if teacher_dict[name] == subject:
            return True
    else:
        return False

@app.route('/')
def home():
    return render_template("index.html")

# This route is for student login
@app.route('/studentlogin', methods = ["GET", "POST"])
def student_login():
    if request.method == "POST":
        usn = request.form.get()
    return render_template("student_login.html")

#This route is for teacher login
@app.route('/teacherlogin', methods = ["GET", "POST"])
def teacher_login():

    if request.method == "POST":
        name = request.form.get()
    return render_template("teacher_login.html")

@app.route('/teacher/<name>/<subject>')
def teacher_page(name, subject):
    valid = isTeacherValid(name, subject)
    # print(student_table.head())
    # result = student_table.to_html()
    if valid:
        conducted = class5A.find_one({})
        classes = conducted.get("Course").get(f"{subject}").get("Classes_conducted")
        print(classes)
        attendData =[]
        studDet = my_coll.find({})
        return render_template("teacher.html", subject=subject , classes = classes, student = studDet, name = conducted.get("Course").get(f"{subject}").get("Course_Instructor"))
    else:
        return "Invalid User"
            

@app.route('/student/<usn>')
def student_page(usn):
    if request.method == "POST":
        if captcha.validate():
            return "success"
        else:
            return "fail"

    valid_student = studentIsVaid(usn)
    if valid_student:
        return render_template("student.html", usn=usn.upper())
    else:
        return "Invalid User"

if __name__ == '__main__':
   app.run(debug=True)