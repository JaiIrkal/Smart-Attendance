import { Tabs, Tab, Box, Typography as Text } from "@mui/material"
import AdminLogin from "../Admin/AdminLogin/AdminLogin"
import StudentLogin from "../Student/StudentLogin/studentlogin"
import TeacherLogin from "../Teacher/TeacherLogin/TeacherLogin"
import { useState } from "react"


import styles from "./Login.module.css"

interface TabPanelProps {
    children?: React.ReactNode;
    dir?: string;
    index: number;
    value: number;
}



function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Text>{children}</Text>
                </Box>
            )}
        </div>
    );
}
function a11yProps(index: number) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}


export const Login = () => {

    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index: number) => {
        setValue(index);
    };

    return (
        <Box className={styles["main-container"]} flexDirection='row'>
            <Box className={styles.leftcontent}>
                <Text className={styles.h1}>Welcome!</Text>
                <Text className={styles.h1}>Let's Make The Attendance System Smart</Text>
                <Text className={styles.h1}>To Continue to our Website</Text>
                <Text className={styles.h1}>Login for Attendance Details</Text>
            </Box>
            <Box className={styles["login-select-container"]}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }} alignContent='center' justifyContent={'center'}>
                    <Tabs value={value} onChange={handleChange} aria-label="user type change tab" sx={{
                        alignContent: 'center', justifyItems: 'center', justifyContent: 'center'
                    }} >
                        <Tab label="Student" {...a11yProps(0)} sx={{
                            width: '33%'
                        }} />
                        <Tab label="Teacher" {...a11yProps(1)} sx={{
                            width: '33%'
                        }} />
                        <Tab label="Admin" {...a11yProps(2)} sx={{
                            width: '33%'
                        }} />
                    </Tabs>
                </Box>

                <TabPanel value={value} index={0}><StudentLogin /></TabPanel>
                <TabPanel value={value} index={1}><TeacherLogin /></TabPanel>
                <TabPanel value={value} index={2}><AdminLogin /></TabPanel>
            </Box>
        </Box >

    )
}