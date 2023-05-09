import { Flex } from "@chakra-ui/react"
import { Outlet } from "react-router-dom"

const Layout = () => {
    return (
        <Flex flex={"auto"}  >
            <Outlet />
        </Flex>
    )
}

export default Layout