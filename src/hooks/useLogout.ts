import api from "../api/axiosConfig";

import { useContext } from "react"
import AuthContext from "../context/AuthProvider";

const useLogout = () => {
    const { setAuth } = useContext(AuthContext)

    const logout = async () => {
        setAuth(null);

        try {

            const response = await api('/logout', {
                withCredentials: true
            });

            setAuth(null);

        } catch (error) {
            console.error(error);
        }
    }

    return logout;
}

export default useLogout;