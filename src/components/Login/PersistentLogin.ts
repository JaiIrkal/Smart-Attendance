
import { Outlet } from "react-router-dom";

import { useState, useEffect, useContext } from "react"
import useRefreshToken from "../../hooks/useRefresh";
import AuthContext from "../../context/AuthProvider";

const PersistentLogin = () => {

    const [isLoading, setIsLoading] = useState(true);

    const refresh = useRefreshToken();

    const { auth } = useContext(AuthContext)

    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                await refresh()
            } catch (error) {

            }
        }
    }, [])

}