from flask import Flask, request, redirect, url_for
from flask import render_template, session
import pymongo
import pandas as pd
import os
from flask_uploads import UploadSet, IMAGES, configure_uploads

from flask_wtf import FlaskForm
from flask_wtf.file import FileAllowed, FileRequired
from werkzeug.utils import secure_filename
from wtforms import StringField, SubmitField, SelectField, DateField, FileField, validators
from wtforms_alchemy import PhoneNumberField
from wtforms.validators import DataRequired
import phonenumbers
from encodeFace import faceEncodings

app = Flask(__name__, template_folder="templates")
app.config['SECRET_KEY']="my ssecret key"
app.config['UPLOADED_IMAGES_DEST'] = 'uploads/images'

images = UploadSet('images',IMAGES)
configure_uploads(app, images)


#create a form
class StudentForm(FlaskForm):
    name= StringField('Name of the Student', validators=[DataRequired()])
    USN = StringField('USN',validators=[DataRequired()])
    branch = SelectField('Branch', choices=[("CSE",'CSE'),('ISE','ISE')])
    semester = SelectField('Semester', choices=[(1),(2),(3),(4),(5),(6),(7),(8)])
    division = SelectField("Division", choices=[('A'),('B')])
    DOB = DateField('Date of Birth')
    email = StringField("Email", validators=[ (DataRequired()), (validators.Email("Please enter your email address."))])
    mobile = PhoneNumberField( "Phone Number",validators=[ DataRequired()], region = 'IND')



mongodb_client = pymongo.MongoClient("mongodb+srv://jai:attendance@cluster0.iofnken.mongodb.net/test")
my_db = mongodb_client["Student_Database"]
my_coll = my_db["CSE_5_A"]

classDB = mongodb_client["Class_Database"]
class5A = classDB["CSE_5_A"]


teacher_dict = {

    "Umakant Kulkarni":"CDSS",
    "Rashmi_Athnikar":"SE",
    "Anand_Vaidya":"DBMS",
    "Yashoda_Sambrani":"MEPIP",
    "Vadvi":"DC",
    "Govind":"AOOP",
}

global_password = "a"


def isTeacherValid(name, subject):
    if name in teacher_dict.keys():
        if teacher_dict[name] == subject:
            return True
    else:
        return False

@app.route('/')
def home():
    return render_template("index.html")




#This is for adding a student
assets_dir = os.path.join(os.path.dirname(app.instance_path), 'assets')
@app.route('/addstudent',methods = ['GET','POST'])
def addstudent():
    name = None
    form = StudentForm()
    
    if form.validate_on_submit():
        name=form.name.data
        USN = form.USN.data
        email = form.email.data
        mobile = form.mobile.data
        branch = form.branch.data
        semester = form.semester.data
        division = form.division.data


        # f = request.files['file']
        # f.save(os.path.join("./uploads/", secure_filename(f.filename)))
        # encode= faceEncodings(f.filename)

    return render_template("addStudent.html",form=form)

# This route is for student login
@app.route('/studentlogin', methods = ["GET", "POST"])
def student_login():
    if(request.method == 'POST'):
        usn = request.form['usn']
        passw = request.form['passw']
        session['loggedin'] = True
        session['id'] = usn
        print(usn,passw)
        return redirect( url_for("student_page"))
    return render_template("student_login.html")

#This route is for teacher login
@app.route('/teacherlogin', methods = ["GET", "POST"])
def teacher_login():
    if request.method == "POST":
        return render_template("teacher_login.html")

@app.route('/teacher')
def teacher_page(name, subject):
    valid = isTeacherValid(name, subject)
    if valid:
        conducted = class5A.find_one({})
        classes = conducted.get("Course").get(f"{subject}").get("Classes_conducted")
        print(classes)
        attendData =[]
        studDet = my_coll.find({})
        return render_template("teacher.html", subject=subject , classes = classes, student = studDet, name = conducted.get("Course").get(f"{subject}").get("Course_Instructor"))
    else:
        return "Invalid User"
            

@app.route('/student', methods = ["GET"])
def student_page():
    if(request.method=="GET"):
        usn = session['id']



        return render_template("student.html", usn =usn)

if __name__ == '__main__':
   app.run(debug=True)