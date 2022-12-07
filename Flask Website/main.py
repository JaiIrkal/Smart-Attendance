from flask import Flask
from flask import render_template
import pymongo
app = Flask(__name__, template_folder="templates")

mongodb_client = pymongo.MongoClient("mongodb+srv://jai:attendance@cluster0.iofnken.mongodb.net/test")
my_db = mongodb_client["Student_Database"]
my_coll = my_db["CSE_5_A"]

teacher_dict = {

    "Umakant Kulkarni":"Compiler Design",
    "Rashmi_Athnikar":"Software_Engineering",
    "Anand_Vaidya":"Database_Management_System",
    "Yashoda_Sambrani":"Management",
    "Vadvi":"Digital_Communication",
    "Govind":"Advanced_OOPs",
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

#This route is for student login
# @app.route('/studentlogin', methods = ["GET", "POST"])
# def student_login():

#     if request.method == "POST":
#         usn = request.form.get()
#     return render_template("student_login.html")

#This route is for teacher login
# @app.route('/teacherlogin', methods = ["GET", "POST"])
# def teacher_login():

#     if request.method == "POST":
#         name = request.form.get()
#     return render_template("student_login.html")

@app.route('/teacher/<name>/<subject>')
def teacher_page(name, subject):
    valid = isTeacherValid(name, subject)
    if valid:
        student_attendance = my_coll.find({});
        return render_template("teacher.html",name=name, subject=subject, result=student_attendance)
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