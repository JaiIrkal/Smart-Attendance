
import { useState, useEffect, useContext } from "react";
import { Outlet } from "react-router-dom";
import useRefreshToken from "../../hooks/useRefresh"
import AuthContext from "../../context/AuthProvider";


const PersistLogin = () => {

    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();

    const { auth } = useContext(AuthContext)

    useEffect(() => {

        let isMounted = true;
        const verifyRefreshToken = async () => {
            try {
                await refresh();
            } catch (e) {
                console.error(e);
            } finally {
                isMounted && setIsLoading(false);
            }
        }

        !auth?.accesstoken ? verifyRefreshToken() : setIsLoading(false);

        return () => {
            isMounted = false;
        }

    }, [])


    return (<>

        {isLoading ?
            <p> Loading...</p>
            :
            <Outlet />
        }
    </>
    )
}

export default PersistLogin;