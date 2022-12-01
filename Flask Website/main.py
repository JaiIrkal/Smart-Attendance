from flask import Flask
from flask import render_template, request
app = Flask(__name__, template_folder="templates")

teacher_dict = {

    "Umakant_Kulkarni":"Compiler_Design",
    "Rashmi_Athnikar":"Software_Engineering",
    "Anand_Vaidya":"Database_Management_System",
    "Yashoda_Sambrani":"Management",
    "Vadvi":"Digital_Communication",
    "Govind":"Advanced_OOPs"
}

usn_list = ["2sd20cs043", "2sd20cs014", "2sd20cs017"]
global_password = "a"

@app.route('/')
def home():
    return render_template("index.html")

#This route is for student login
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
    return render_template("student_login.html")

@app.route('/teacher/<name>/<subject>')
def teacher_page(name, subject):

    if name in teacher_dict.keys() and subject in teacher_dict.values():
        if teacher_dict[name] is subject:
            return render_template("teacher.html")
            

@app.route('/student/<usn>')
def student_page(usn, password):
    return render_template("student.html", usn=usn, password=password)

if __name__ == '__main__':
   app.run(debug=True)