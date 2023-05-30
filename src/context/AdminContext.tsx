
import MenuItem from "@mui/material/MenuItem/MenuItem";
import { createContext, useState } from "react"


export const semList = (num: any) => {
    let semOptions = [];
    for (let i = 1; i <= num; i++) {
        semOptions.push(<MenuItem value={i} key={i}>{i}</MenuItem>)
    }
    return semOptions;
};

export type TypeSubjectData = {
    code: string
    short: string
    name: string
}

export type TypeSemData = {
    semester: number
    divlist: string[]
    noofcoresubjects: number
    nooflabs: number
    noofbranchelectives: number
    noofopenelectives: number
    coresubjects: TypeSubjectData[]
    branchelectives: TypeSubjectData[]
    openelectives: TypeSubjectData[]
    labs: number
    subjects: TypeSubjectData[]
}



type AdminDataContextType = {
    branchList: string[];
    setBranchList: React.Dispatch<React.SetStateAction<string[]>>;
    semList: string[];
    semData: TypeSemData | null;
    setSemData: React.Dispatch<React.SetStateAction<TypeSemData | null>>;
    subjectIndex: Map<string, string> | null;
    setSubjectIndex: React.Dispatch<React.SetStateAction<Map<string, string> | null>>;
    subjectList: string[];
    setSubjectList: React.Dispatch<React.SetStateAction<string[]>>;
}

const AdminContext = createContext({} as AdminDataContextType);



export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
    const [subjectIndex, setSubjectIndex] = useState<Map<string, string> | null>(null);
    const [subjectList, setSubjectList] = useState<string[]>([''])
    const [branchList, setBranchList] = useState<string[]>([])
    const [semData, setSemData] = useState<TypeSemData | null>(null);
    const semList = ['1', '2', '3', '4', '5', '6', '7', '8']



    return (
        <AdminContext.Provider value={{
            branchList, setBranchList, semList,
            semData, setSemData, subjectIndex,
            setSubjectIndex, setSubjectList, subjectList
        }}>
            {children}
        </AdminContext.Provider>
    )
}

export default AdminContext;