
import { Box, Tabs, Tab } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import api from "../../../api/axiosConfig";
import Navbar from "../../NavBar/NavBar";
import AddTeacherForm from "./TeacherDetails/AddTeacherForm/AddTeacherForm";
import { ManageTimeTable } from "./TimeTableManagement/ManageTimeTable";
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { StudentsList } from "./StudentDetails/StudentsList/StudentsList";
import AddStudent from "./StudentDetails/AddStudent/AddStudent";
import AddClass from "./AddClass/AddClass";
import AdminContext from "../../../context/AdminContext";


interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

interface TabProps {
    children?: React.ReactNode;
}
function a11yProps(index: number) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

function TabPanel(props: TabPanelProps) {
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
                    <Box>{children}</Box>
                </Box>
            )}
        </div>
    );
}

const AdminPage: React.FC = () => {

    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const { branchList, setBranchList } = useContext(AdminContext)



    const getBranchList = async () => {
        try {
            const response = await api.get('/branchlist');
            setBranchList(response.data);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getBranchList();
    }, [])




    return (
        <Box flexDirection={'column'}>
            <Navbar />
            <Box
                mt={"15px"}
                sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 624, }}>
                <Tabs
                    orientation="vertical"
                    onChange={handleChange}
                    aria-label="Vertical tabs example"
                    sx={{ borderRight: 1, borderColor: 'divider' }}
                    value={value}
                >
                    <Tab label="Manage TimeTable"
                        {...a11yProps(0)}
                        icon={<EditCalendarIcon />}
                        iconPosition='start'
                    ></Tab>
                    <Tab label="Add Teacher"
                        {...a11yProps(1)}
                        icon={<PersonAddIcon />}
                        iconPosition="start"></Tab>
                    <Tab label="Add Student" {...a11yProps(2)}
                        icon={<PersonAddIcon />} iconPosition="start"></Tab>
                    <Tab label=" Add Class" {...a11yProps(3)}
                        icon={<PersonAddIcon />} iconPosition="start"></Tab>
                    <Tab label="List All Students" {...a11yProps(4)}
                        icon={<PersonAddIcon />} iconPosition="start"></Tab>
                </Tabs>
                <TabPanel index={0} value={value}>
                    <ManageTimeTable />
                </TabPanel>
                <TabPanel index={1} value={value}><AddTeacherForm /></TabPanel>
                <TabPanel index={2} value={value}><AddStudent /> </TabPanel>
                <TabPanel index={3} value={value}><AddClass /> </TabPanel>
                <TabPanel index={4} value={value}><StudentsList /></TabPanel>

            </Box>


        </Box>

    );

}


export default AdminPage;