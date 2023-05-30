
import React, { useEffect, useContext } from "react";
import Navbar from "../../NavBar/NavBar";
import { StudentDetails } from "./StudentDetails/StudentDetails";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import AuthContext from "../../../context/AuthProvider";
import { StudentAttendanceTable } from "./StudentAttendanceTable/StudentAttendanceTable";
import { Box, Tabs, Tab } from "@mui/material";
import StudentContext from "../../../context/StudentProvider";
import StudentTimeTable from "./StudentTimeTable/StudentTimeTable";

import styles from "./StudentPage.module.css"



interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <>{children}</>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const StudentPage: React.FC = () => {

    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };


    const { studentData, setStudentData } = useContext(StudentContext)
    const { auth } = useContext(AuthContext);
    const axiosPrivate = useAxiosPrivate();
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        const getStudentData = async () => {
            try {
                const userid = auth?.userid ? auth?.userid : ""
                const response = await axiosPrivate.get('/student/'.concat(userid), {
                    signal: controller.signal
                });
                isMounted && setStudentData(response.data)
                console.log(studentData);
            } catch (error) {
                console.error(error)
            }
        }
        getStudentData();
        return () => {
            isMounted = false;
            controller.abort();
        }
    }, [])
    return (
        <Box className={styles["main-container"]}>
            <Navbar />
            <Box flex={"auto"} my='10px'>
                <StudentDetails />
            </Box>
            <Box flex={"auto"} my='10px' width='100%'>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value}
                        onChange={handleChange}
                        sx={{
                            marginLeft: 1,
                            height: 3,
                        }}

                        variant='scrollable'
                        scrollButtons="auto"
                        aria-label="basic tabs example">
                        <Tab label="TimeTable" {...a11yProps(0)} wrapped
                            sx={{
                                wordWrap: 'normal',
                                display: 'inline',
                                width: '100px'
                            }}

                        />
                        {
                            studentData?.Data.map((sem) => (<Tab sx={{
                                wordWrap: 'normal',
                                display: 'inline',
                                width: '140px'
                            }} label={"Semester ".concat(sem.Semester.toString())} {...a11yProps(1)}></Tab>))
                        }
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <StudentTimeTable schedule={studentData?.TimeTable} />
                </TabPanel>
                {
                    studentData?.Data.map((sem, i) => {
                        return (
                            <TabPanel value={value} index={i + 1}>
                                <StudentAttendanceTable semData={sem} />
                            </TabPanel>
                        )
                    })}
            </Box>
        </Box>

    )

}


export default StudentPage;