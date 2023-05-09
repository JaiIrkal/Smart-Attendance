import { Flex } from "@chakra-ui/react";
import React, { useState, useEffect, useContext } from "react";
import Navbar from "../../NavBar/NavBar";
import { StudentDetails } from "./StudentDetails/StudentDetails";
import api from "../../../api/axiosConfig"
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import AuthContext from "../../../context/AuthProvider";
import { StudentAttendanceTable } from "./StudentAttendanceTable/StudentAttendanceTable";
import { Typography, Box, Tabs, Tab } from "@mui/material";
import StudentContext from "../../../context/StudentProvider";
import { stringify } from "querystring";
import { TimeTable } from "./TimeTable/TimeTable";



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
        <Flex flexFlow={"column"}
            width="100%"
            bg={""}
            bgSize="cover"
            bgPos={"center"}
            flex="auto"
            padding={['18px', '1px', '18px', '1px']}
            border="3px solid"
            margin='8px'
        >
            <Navbar />
            <Flex flex={"auto"} my='10px'>
                <StudentDetails />
            </Flex>
            <Box flex={"auto"} my='10px' width='100%'>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} variant='scrollable' visibleScrollbar aria-label="basic tabs example">
                        <Tab label="TimeTable" {...a11yProps(0)} />
                        {
                            studentData?.Data.map((sem) => (<Tab label={"Semester ".concat(sem.Semester.toString())} {...a11yProps(1)}></Tab>))
                        }
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <TimeTable />
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
        </Flex>
    )

}


export default StudentPage;