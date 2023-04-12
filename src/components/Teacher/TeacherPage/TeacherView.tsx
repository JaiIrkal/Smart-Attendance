import { ClassAttendanceTable } from "./TeacherAttendanceVIew/ClassAttendanceTable"
import { TeacherDetails } from "./TeacherDetails/TeacherDetails"

const TeacherView: React.FC = () => {

    return (
        <div>
            <TeacherDetails />
            <ClassAttendanceTable />
        </div>
    )
}

export default TeacherView;