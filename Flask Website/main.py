import json
import os
import urllib.request

import pymongo
from encodeFace import faceEncodings
from flask import Flask, redirect, render_template, request, session, url_for
from flask_uploads import IMAGES, UploadSet, configure_uploads
from flask_wtf import FlaskForm
from studentDatabase import addstudentToDatabase
from werkzeug.utils import secure_filename
from wtforms import (DateField, FileField, SelectField, StringField,
                     SubmitField, validators)
from wtforms.validators import DataRequired
from wtforms_alchemy import PhoneNumberField

#app configs
app = Flask(__name__, template_folder="templates")
app.config['SECRET_KEY']="my secret key"
app.config['UPLOADED_IMAGES_DEST'] = 'uploads/images'

images = UploadSet('images',IMAGES)
configure_uploads(app, images)


API_BASE_URL = "http://127.0.0.1:8000"

import dummydata

#create a form for adding a student
class StudentForm(FlaskForm):
    name= StringField('Name of the Student', validators=[DataRequired()])
    USN = StringField('USN',validators=[DataRequired()])
    branch = SelectField('Branch', choices=[("CSE",'CSE'),('ISE','ISE'),('ECE', 'ECE'),('EEE','EEE'),('ME','ME'),('CE','CE')])
    semester = SelectField('Semester', choices=[(1),(2),(3),(4),(5),(6),(7),(8)])
    division = SelectField("Division", choices=[('A'),('B')])
    email = StringField("Email", validators=[ (DataRequired()), (validators.Email("Please enter your email address."))])
    mobile = StringField( "Phone Number",validators=[ DataRequired()])

#database connections
#
# mongodb_client = pymongo.MongoClient("mongodb+srv://jai:attendance@cluster0.iofnken.mongodb.net/test")
#
# #student database
# studentdb = mongodb_client["Student_Database"]
#
# #teacher database
# classdb = mongodb_client["Class_Database"]
#
# teacherdb = mongodb_client["Staff_Database"]
#
#
# #login collection
# logins = studentdb["Students"]


teacher_dict = {"Umakant Kulkarni":"CDSS",    "Rashmi_Athnikar":"SE",    "Anand_Vaidya":"DBMS",    "Yashoda_Sambrani":"MEPIP",
    "Vadvi":"DC",
    "Govind":"AOOP",
}

global_password = "a"



@app.route('/adminLogin')
def admin():
    return render_template("admin.html")


@app.route('/')
def home():
    return render_template("index.html")


#This is for adding a student
assets_dir = os.path.join(os.path.dirname(app.instance_path), 'assets')
# @app.route('/addstudent',methods = ['GET','POST'])
# def addstudent():
#     name = None
#     studentform = StudentForm()
#     if request.method == 'POST' and studentform.is_submitted():
#         name=request.form['name']
#         USN = studentform.USN.data
#         email = studentform.email.data
#         mobile = studentform.mobile.data
#         branch = studentform.branch.data
#         semester = studentform.semester.data
#         division = studentform.division.data
#         dob = request.form['dob']
#         f = request.files['file']
#         f.save(os.path.join("./uploads/", secure_filename(f.filename)))
#         encode= faceEncodings(f.filename)
#         addstudentToDatabase(USN,name,email,mobile,branch,semester,division,encode.tolist(),dob)
#         return 'Student Added'
#     return render_template("addStudent.html",form=studentform)

# This route is for student login
@app.route('/studentlogin', methods = ["GET", "POST"])
def student_login():
    # logintable = studentdb['Student_Logins']
    if(request.method == 'POST'):

                return redirect( url_for("student_page"))
    return render_template("student_login.html")

#This route is for teacher login
@app.route('/teacherlogin', methods = ["GET", "POST"])
def teacher_login():

    # teachercol = teacherdb["Teachers"]
    if request.method == "POST":

                return redirect( url_for("teacher_page"))
    return render_template("teacher_login.html")

@app.route('/teacher',methods = ["GET"])
def teacher_page():

    # ID = "teacher001"
    # url = f"{API_BASE_URL}/teacher/{ID}"
    # response = urllib.request.urlopen(url)
    # response = dummydata.teacherData
    # Data = json.loads(response.read())
    return render_template("teacher.html", Data = dummydata.teacherData )



@app.route('/student', methods = ["GET"])
def student_page():
    if(request.method=="GET"):
        # usn = '2SD20CS017'
        # url = f"{API_BASE_URL}/student/{usn}"
        # response = urllib.request.urlopen(url
        # response = dummydata.studentData
        # studentDetails = json.loads(response.read())
        return render_template("student.html",studentDetails=dummydata.studentData )


if __name__ == '__main__':
   app.run(debug=True)





