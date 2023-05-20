import { Box } from "@mui/material"
import { Outlet } from "react-router-dom"

const Layout = () => {
    return (
        <Box flex={"auto"}  >
            <Outlet />
        </Box>
    )
}

export default Layout