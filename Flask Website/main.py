from flask import Flask, request, redirect, url_for
from flask import render_template, session
import pymongo
import os
from flask_uploads import UploadSet, IMAGES, configure_uploads
from flask_wtf import FlaskForm
from werkzeug.utils import secure_filename
from werkzeug.datastructures import  FileStorage
from wtforms import StringField, SubmitField, SelectField, DateField, FileField, validators

from wtforms.validators import DataRequired
from encodeFace import faceEncodings
from studentDatabase import addstudentToDatabase

#app configs
app = Flask(__name__, template_folder="templates")
app.config['SECRET_KEY']="my ssecret key"
app.config['UPLOADED_IMAGES_DEST'] = 'uploads/images'

images = UploadSet('images',IMAGES)
configure_uploads(app, images)


#create a form for adding a student
class StudentForm(FlaskForm):
    name= StringField('Name of the Student', validators=[DataRequired()])
    USN = StringField('USN',validators=[DataRequired()])
    branch = SelectField('Branch', choices=[("CSE",'CSE'),('ISE','ISE')])
    semester = SelectField('Semester', choices=[(1),(2),(3),(4),(5),(6),(7),(8)])
    division = SelectField("Division", choices=[('A'),('B')])
    email = StringField("Email", validators=[ (DataRequired()), (validators.Email("Please enter your email address."))])
    mobile = StringField( "Phone Number",validators=[ DataRequired()])

#database connections

mongodb_client = pymongo.MongoClient("mongodb+srv://jai:attendance@cluster0.iofnken.mongodb.net/test")

#student database
studentdb = mongodb_client["Student_Database"]

#teacher database
classdb = mongodb_client["Class_Database"]


#login collection
logins = studentdb["Students"]


teacher_dict = {"Umakant Kulkarni":"CDSS",    "Rashmi_Athnikar":"SE",    "Anand_Vaidya":"DBMS",    "Yashoda_Sambrani":"MEPIP",
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
    studentform = StudentForm()
    if request.method == 'POST' and studentform.is_submitted():
        name=request.form['name']
        USN = studentform.USN.data
        email = studentform.email.data
        mobile = studentform.mobile.data
        branch = studentform.branch.data
        semester = studentform.semester.data
        division = studentform.division.data
        dob = request.form['dob']
        f = request.files['file']
        f.save(os.path.join("./uploads/", secure_filename(f.filename)))
        encode= faceEncodings(f.filename)
        addstudentToDatabase(USN,name,email,mobile,branch,semester,division,encode.tolist(),dob)
        return 'Student Added'
    return render_template("addStudent.html",form=studentform)

# This route is for student login
@app.route('/studentlogin', methods = ["GET", "POST"])
def student_login():
    logintable = studentdb['Student_Logins']
    if(request.method == 'POST'):
        usn = request.form['usn']
        passw = request.form['passw']
        user = logintable.find_one({"USN": f"{usn}"})
        if(usn is not None):
            if(user.get("PASSW") == passw):
                session['loggedin'] = True
                session['id'] = usn
                session['class']= user.get("Class")
        return redirect( url_for("student_page"))
    return render_template("student_login.html")

#This route is for teacher login
@app.route('/teacherlogin', methods = ["GET", "POST"])
def teacher_login():
    if request.method == "POST":
        session['id'] = request.form['tid']
        session['loggedin']= True

    return render_template("teacher_login.html")

@app.route('/teacher/<name>/<subject>')
def teacher_page(name, subject):
    branch = 'CSE'
    sem = 5
    div = 'A'
    students = studentdb[f"{branch}_{sem}_{div}"]
    classDetails = classdb[f"{branch}_{sem}_{div}"]
    classObject = classDetails.find_one({})
    classdates = classObject.get(f"{subject}").get("Classes_conducted")
    studDet = students.find({})
    return render_template("teacher.html", name = name ,subject=subject , classes = classdates, student = studDet, )


@app.route('/student', methods = ["GET"])
def student_page():
    if(request.method=="GET"):
        usn = session['id']
        classname=session['class']
        classDetails = classdb[classname]
        classObject = classDetails.find_one({})
        print(classObject)
        classOfStudent = studentdb[classname]
        studentDetails = classOfStudent.find_one({"USN": usn})
        subjects = classObject.get("Course_Names")
        subdetails = []
        for sub in subjects:
            subdict = {
                "Name": sub,
                "Classes_Conducted": classObject.get(sub).get("Classes_conducted"),
                "Classes_attended": studentDetails.get(f"{sub}_attendance")
            }
            subdetails.append(subdict)
        return render_template("student.html",studentDetails=studentDetails,subjects = subdetails )

if __name__ == '__main__':
   app.run(debug=True)





