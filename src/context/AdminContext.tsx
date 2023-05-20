
import { createContext, useState } from "react"





type AdminDataContextType = {
    branchList: string[];
    setBranchList: React.Dispatch<React.SetStateAction<string[]>>

}

const AdminContext = createContext({} as AdminDataContextType);

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
    const [branchList, setBranchList] = useState<string[]>([])


    return (
        <AdminContext.Provider value={{ branchList, setBranchList }}>
            {children}
        </AdminContext.Provider>
    )
}

export default AdminContext;