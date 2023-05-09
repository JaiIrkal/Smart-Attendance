import { Box, Tab, Tabs, Typography } from "@mui/material";

import { Flex } from "@chakra-ui/react";

import { useState, useContext, useEffect } from "react";
import AuthContext from "../../../context/AuthProvider";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Navbar from "../../NavBar/NavBar";
import { ClassAttendanceTable } from "./TeacherAttendanceVIew/ClassAttendanceTable"
import { TeacherDetails } from "./TeacherDetails/TeacherDetails"


type StudentType = {
    USN: string
    Name: string
    Attendance: Array<number>
}

type AttendanceType = {
    Course: string
    Classes_conducted: Array<string>
    StudentsAttendance: Array<StudentType>
}

type ClassType = {
    Name: string
    Attendance: Array<AttendanceType>
}

type teacherDataType = {
    Name: string
    Classes: Array<ClassType>
}



interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function VerticalTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function HorizontalTabPanel(props: TabPanelProps) {
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
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function horizontalTabProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function verticalTabProps(index: number) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}


const TeacherView: React.FC = () => {



    const [verticalTabvalue, setVerticalTabValue] = useState(0);
    const [horizontalTabValue, setHorizontalTabValue] = useState(0);

    const handleVerticalTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setVerticalTabValue(newValue);
    };

    const handleHorizontalTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setHorizontalTabValue(newValue);
    };

    const [teacherData, setTeacherData] = useState<teacherDataType | null>(null);
    const { auth } = useContext(AuthContext);
    const axiosPrivate = useAxiosPrivate();
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        const getStudentData = async () => {
            try {
                const userid = auth?.userid ? auth?.userid : ""
                const response = await axiosPrivate.get('/teacher/'.concat(userid), {
                    signal: controller.signal
                });
                isMounted && setTeacherData(response.data)
                console.log(teacherData)
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

    console.log(teacherData)



    return (
        <Flex flexFlow={"column"}
            bg={""}
            bgSize="cover"
            bgPos={"center"}
            flex="auto"
            padding={['18px', '1px', '18px', '1px']}
            border="3px solid"
            margin='8px'>

            <Navbar />

            <TeacherDetails />

            <Box
                sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: '100%' }}
            >
                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={verticalTabvalue}
                    onChange={handleVerticalTabChange}
                    aria-label="Vertical tabs example"
                    sx={{ borderRight: 1, borderColor: 'divider' }}
                >


                    {teacherData?.Classes.map((item, j) => (<Tab label={item.Name}  {...verticalTabProps(j)} />))}

                </Tabs>


                {teacherData?.Classes.map((item, j) => (
                    <VerticalTabPanel
                        value={verticalTabvalue}
                        index={j}
                    >
                        <Flex flexFlow={'column'}>
                            <Typography align="center">{item.Name}</Typography>
                            <Box width='100%'>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }} width="100%">
                                    <Tabs
                                        value={horizontalTabValue} onChange={handleHorizontalTabChange} aria-label="basic tabs" >
                                        {item.Attendance.map((subject, k) =>
                                        (
                                            <Tab label={subject.Course} {
                                                ...horizontalTabProps(k)} />
                                        )
                                        )
                                        }
                                    </Tabs>
                                </Box>

                                {
                                    item.Attendance.map((subject, k) =>
                                    (
                                        <HorizontalTabPanel value={horizontalTabValue} index={k}>
                                            <ClassAttendanceTable className={item.Name} subjectCode={subject.Course} data={item.Attendance[k]} />
                                        </HorizontalTabPanel>
                                    )
                                    )
                                }

                            </Box>
                        </Flex>
                    </VerticalTabPanel >))}

            </Box >

        </Flex >
    )
}

export default TeacherView; 