import { Text, Tabs, TabList, Tab, TabPanels, TabPanel } from "@chakra-ui/react"
import AdminLogin from "../Admin/AdminLogin/AdminLogin"
import StudentLogin from "../Student/StudentLogin/studentlogin"
import TeacherLogin from "../Teacher/TeacherLogin/TeacherLogin"
import './Login.css'

export const Login = () => {

    return (
        <>
            <div className="left-content home-left-content">
                <Text fontSize={"5xl"} fontFamily={'Barlow Condensed'} fontStyle='oblique'>Welcome!</Text>
                <Text fontSize={"4xl"} fontFamily={'Barlow Condensed'}>Let's Make The Attendance System Smart</Text>
                <Text fontSize={"4xl"} fontFamily={'Barlow Condensed'}>To Continue to our Website</Text>
                <Text fontSize={"4xl"} fontFamily={'Barlow Condensed'}>Login for Attendance Details</Text>
            </div>
            <div className="login-select-container homepage">
                <Tabs variant='enclosed'>
                    <TabList>
                        <Tab className="button">Student</Tab>
                        <Tab className="button">Teacher</Tab>
                        <Tab className="button">Admin</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <StudentLogin /></TabPanel>
                        <TabPanel><TeacherLogin /></TabPanel>
                        <TabPanel><AdminLogin /></TabPanel>
                    </TabPanels>
                </Tabs>
            </div>
        </>
    )
}