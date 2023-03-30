import { ChakraProvider, Text, Tabs, TabList, Tab, TabPanels, TabPanel, Img } from "@chakra-ui/react"
import { Hometheme } from "../theme/HomeTheme"

import './home.css'
import StudentLogin from "./Student/StudentLogin/studentlogin"
import TeacherLogin from "./Teacher/TeacherLogin/TeacherLogin"
import AdminLogin from "./Admin/AdminLogin/AdminLogin"

export const Home = () => {
    return (
        <ChakraProvider theme={Hometheme}>
            <body>
                <div className="left-content home-left-content">
                    <Text fontSize={"5xl"} fontFamily={'Barlow Condensed'} fontStyle='oblique'>Welcome!</Text>
                    <Text fontSize={"4xl"} fontFamily={'Barlow Condensed'}>Let's Make The Attendance System Smart</Text>
                    <Text fontSize={"4xl"} fontFamily={'Barlow Condensed'}>To Continue to our Website</Text>
                    <Text fontSize={"4xl"} fontFamily={'Barlow Condensed'}>Login for Attendance Details</Text>
                </div>
                <div className="login-select-container homepage">
                    <Tabs variant='enclosed'>
                        <TabList>
                            <Tab>Student</Tab>
                            <Tab>Teacher</Tab>
                            <Tab>Admin</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <StudentLogin /></TabPanel>
                            <TabPanel><TeacherLogin /></TabPanel>
                            <TabPanel><AdminLogin /></TabPanel>
                        </TabPanels>
                    </Tabs>
                </div>
            </body>
        </ChakraProvider >
    )
}