import { createContext, useState } from "react"


export type AuthUser = {
    userid: string,
    role: string,
    accesstoken: string
}

type UserContextType = {
    auth: AuthUser | null
    setAuth: React.Dispatch<React.SetStateAction<AuthUser | null>>

}

const AuthContext = createContext({} as UserContextType);


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [auth, setAuth] = useState<AuthUser | null>(null);


    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;