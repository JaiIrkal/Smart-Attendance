from flask import Flask, request
from flask import render_template
import pymongo
import pandas as pd

from flask_wtf import FlaskForm
from flask_wtf.file import FileAllowed, FileRequired
from wtforms import StringField, SubmitField, SelectField, DateField, FileField, validators
from wtforms_alchemy import PhoneNumberField
from wtforms.validators import DataRequired
import phonenumbers



#create a form
class StudentForm(FlaskForm):
    name= StringField('Name of the Student', validators=[DataRequired()])
    USN = StringField('Name of the Student',validators=[DataRequired()])
    branch = SelectField('Branch', choices=[("CSE",'CSE'),('ISE','ISE')])
    semester = SelectField('Semester', choices=[(1),(2),(3),(4),(5),(6),(7),(8)])
    division = SelectField("Division", choices=[('A'),('B')])
    DOB = DateField('Date of Birth')
    image  = FileField("Photo", validators=[(FileAllowed(['jpg', 'png'], 'Images only!')),FileRequired()])
    email = StringField("Email", validators=[ (DataRequired()), (validators.Email("Please enter your email address."))])
    mobile = PhoneNumberField( "Phone Number",validators=[ DataRequired()], region = 'IND')
    submit = SubmitField("Submit")


app = Flask(__name__, template_folder="templates")
app.config['SECRET_KEY']="my ssecret key"

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


#This is for adding a student

@app.route('/addstudent',methods = ['GET','POST'])
def addstudent():
    name = None
    form = StudentForm()
    if form.validate_on_submit():
        name=form.name.data
        form.name.data=''
    return render_template("addStudent.html", name=name,form=form)

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
    valid_student = studentIsVaid(usn)
    if valid_student:
        return render_template("student.html", usn=usn.upper())
    else:
        return "Invalid User"

if __name__ == '__main__':
   app.run(debug=True)