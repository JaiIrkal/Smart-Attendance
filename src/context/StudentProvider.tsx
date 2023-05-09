import { createContext, useState } from "react";


export type SubjectAttendanceData = {
    Code: string
    Name: string
    ClassesConducted: Array<string>
    Attendance: Array<number>
}

export type SemesterData = {
    Semester: number
    Division: String
    Subjects: Array<SubjectAttendanceData>
}


export type StudentData = {
    Name: string
    USN: string
    Semester: string
    Division: string
    Branch: string
    DOB: string
    Email: string
    Mobile: string
    Data: Array<SemesterData>
}

type StudentDataContextType = {
    studentData: StudentData | null;
    setStudentData: React.Dispatch<React.SetStateAction<StudentData | null>>

}

const StudentContext = createContext({} as StudentDataContextType);

export const StudentProvider = ({ children }: { children: React.ReactNode }) => {
    const [studentData, setStudentData] = useState<StudentData | null>(null);


    return (
        <StudentContext.Provider value={{ studentData, setStudentData }}>
            {children}
        </StudentContext.Provider>
    )
}

export default StudentContext;