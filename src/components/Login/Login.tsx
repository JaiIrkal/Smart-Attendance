import { Text, Tabs, TabList, Tab, TabPanels, TabPanel, Flex } from "@chakra-ui/react"
import AdminLogin from "../Admin/AdminLogin/AdminLogin"
import StudentLogin from "../Student/StudentLogin/studentlogin"
import TeacherLogin from "../Teacher/TeacherLogin/TeacherLogin"

import styles from "./Login.module.css"




export const Login = () => {
    return (
        <Flex className={styles.body}>
            <div className={styles.leftcontent}>
                <Text className={styles.h1}>Welcome!</Text>
                <Text className={styles.h1}>Let's Make The Attendance System Smart</Text>
                <Text className={styles.h1}>To Continue to our Website</Text>
                <Text className={styles.h1}>Login for Attendance Details</Text>
            </div>
            <div >
                <Tabs variant='enclosed' className={styles["login-select-container"]}>
                    <TabList>
                        <Tab className={styles["button"]}>Student</Tab>
                        <Tab className={styles["button"]}>Teacher</Tab>
                        <Tab className={styles["button"]}>Admin</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <StudentLogin /></TabPanel>
                        <TabPanel><TeacherLogin /></TabPanel>
                        <TabPanel><AdminLogin /></TabPanel>
                    </TabPanels>
                </Tabs>
            </div>
        </Flex>
    )
}