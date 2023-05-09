import api from "../api/axiosConfig";
import AuthContext from "../context/AuthProvider";
import { useContext } from "react"


const useRefreshToken = () => {
    const { auth, setAuth } = useContext(AuthContext)

    const refresh = async () => {
        const response = await api.get('/refresh', {
            withCredentials: true
        });

        console.log(response.data);

        setAuth((prevState: any) => {
            return ({ userid: response.data?.userid, role: response.data?.role, accesstoken: response.data?.accesstoken, refreshtoken: response.data?.refreshtoken })
        }
        );

        console.log(auth);

        return response.data?.accesstoken;
    }

    return refresh;
}

export default useRefreshToken;